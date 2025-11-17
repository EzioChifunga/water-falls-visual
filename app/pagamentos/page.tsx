'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { pagamentosAPI, reservasAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  async function loadData() {
    setLoading(true);
    let pagamentosResult;
    if (statusFilter) {
      pagamentosResult = await pagamentosAPI.filterByStatus(statusFilter);
    } else {
      pagamentosResult = await pagamentosAPI.list();
    }
    const reservasResult = await reservasAPI.list();
    setPagamentos(pagamentosResult.data || []);
    setReservas(reservasResult.data || []);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    if (editingItem) {
      await pagamentosAPI.update(editingItem.id, data);
      setEditingItem(null);
    } else {
      await pagamentosAPI.create(data);
    }
    await loadData();
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja deletar este pagamento?')) {
      await pagamentosAPI.delete(item.id);
      await loadData();
    }
  }

  const reservaOptions = reservas.map((res: any) => ({
    value: res.id,
    label: `Reserva ${res.id?.slice(0, 8)} - R$ ${res.valor_total}`,
  }));

  const metodoOptions = [
    { value: 'CARTAO', label: 'Cartão de Crédito' },
    { value: 'TRANSFERENCIA', label: 'Transferência' },
    { value: 'PIX', label: 'PIX' },
    { value: 'DINHEIRO', label: 'Dinheiro' },
  ];

  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'PROCESSANDO', label: 'Processando' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'FALHADO', label: 'Falhado' },
    { value: 'REEMBOLSADO', label: 'Reembolsado' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSANDO':
        return 'bg-blue-100 text-blue-800';
      case 'PAGO':
        return 'bg-green-100 text-green-800';
      case 'FALHADO':
        return 'bg-red-100 text-red-800';
      case 'REEMBOLSADO':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Pagamentos</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie todos os pagamentos de reservas
          </p>

          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setStatusFilter('')}
                variant={statusFilter === '' ? 'default' : 'outline'}
              >
                Todos
              </Button>
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  variant={
                    statusFilter === option.value ? 'default' : 'outline'
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <CRUDTable
              data={pagamentos}
              columns={[
                {
                  key: 'reserva_id',
                  label: 'Reserva',
                  render: (value) => {
                    const reserva = reservas.find((r: any) => r.id === value);
                    return reserva ? `${reserva.id?.slice(0, 8)}` : '-';
                  },
                },
                { key: 'metodo', label: 'Método' },
                { key: 'valor', label: 'Valor (R$)' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => (
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                        value
                      )}`}
                    >
                      {value}
                    </span>
                  ),
                },
                { key: 'transacao_gateway_id', label: 'ID Transação' },
              ]}
              onAdd={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              onEdit={(item) => {
                setEditingItem(item);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
              loading={loading}
            />
          </Card>

          <CRUDModal
            isOpen={modalOpen}
            title={editingItem ? 'Editar Pagamento' : 'Novo Pagamento'}
            fields={[
              {
                name: 'reserva_id',
                label: 'Reserva',
                type: 'select',
                options: reservaOptions,
              },
              {
                name: 'metodo',
                label: 'Método',
                type: 'select',
                options: metodoOptions,
              },
              { name: 'valor', label: 'Valor (R$)', type: 'number' },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: statusOptions,
              },
              {
                name: 'transacao_gateway_id',
                label: 'ID da Transação',
                placeholder: 'Ex: TRX123456',
              },
            ]}
            initialData={editingItem}
            onSubmit={handleSubmit}
            onOpenChange={setModalOpen}
          />
        </div>
      </main>
    </div>
  );
}
