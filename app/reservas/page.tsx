'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import {
  reservasAPI,
  clientesAPI,
  veiculosAPI,
  lojasAPI,
} from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [reservasResult, clientesResult, veiculosResult, lojasResult] =
      await Promise.all([
        reservasAPI.list(),
        clientesAPI.list(),
        veiculosAPI.list(),
        lojasAPI.list(),
      ]);
    setReservas(reservasResult.data || []);
    setClientes(clientesResult.data || []);
    setVeiculos(veiculosResult.data || []);
    setLojas(lojasResult.data || []);
    setLoading(false);
  }

  const calculateReservationValues = (dataInicio: string, dataFim: string, veiculoId: string) => {
    if (dataInicio && dataFim && veiculoId) {
      const start = new Date(dataInicio);
      const end = new Date(dataFim);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const vehicle = veiculos.find((v: any) => v.id === veiculoId);
      const diaria = vehicle ? vehicle.diaria : 0;
      
      return {
        periodo: diffDays,
        valor_total: (diffDays * diaria).toFixed(2),
      };
    }
    return { periodo: 0, valor_total: '0.00' };
  };

  async function handleSubmit(data: any) {
    const valores = calculateReservationValues(data.data_inicio, data.data_fim, data.veiculo_id);
    
    const submitData = {
      cliente_id: data.cliente_id,
      veiculo_id: data.veiculo_id,
      loja_retirada_id: data.loja_retirada_id,
      loja_devolucao_id: data.loja_devolucao_id,
      data_inicio: data.data_inicio, // Format: YYYY-MM-DD
      data_fim: data.data_fim, // Format: YYYY-MM-DD
      valor_total: parseFloat(valores.valor_total),
      periodo: valores.periodo,
      motorista_incluido: data.motorista_incluido === 'true' || data.motorista_incluido === true,
      canal_origem: data.canal_origem || 'WEB',
      status: data.status || 'PENDENTE_PAGAMENTO',
    };

    if (editingItem) {
      await reservasAPI.update(editingItem.id, submitData);
      setEditingItem(null);
    } else {
      await reservasAPI.create(submitData);
    }
    await loadData();
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja deletar esta reserva?')) {
      await reservasAPI.delete(item.id);
      await loadData();
    }
  }

  async function handleConfirm(item: any) {
    if (confirm('Confirmar esta reserva?')) {
      await reservasAPI.confirm(item.id);
      await loadData();
    }
  }

  async function handleCancel(item: any) {
    if (confirm('Cancelar esta reserva?')) {
      await reservasAPI.cancel(item.id);
      await loadData();
    }
  }

  const clienteOptions = clientes.map((cli: any) => ({
    value: cli.id,
    label: `${cli.nome} (${cli.id.substring(0, 8)})`,
  }));

  const veiculoOptions = veiculos.map((vei: any) => ({
    value: vei.id,
    label: `${vei.marca} ${vei.modelo} - ${vei.placa} (${vei.id.substring(0, 8)})`,
  }));

  const lojaOptions = lojas.map((loja: any) => ({
    value: loja.id,
    label: `${loja.nome} (${loja.id.substring(0, 8)})`,
  }));

  const statusOptions = [
    { value: 'PENDENTE_PAGAMENTO', label: 'Pendente Pagamento' },
    { value: 'CONFIRMADA', label: 'Confirmada' },
    { value: 'EM_CURSO', label: 'Em Curso' },
    { value: 'FINALIZADA', label: 'Finalizada' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ];

  const canalOptions = [
    { value: 'WEB', label: 'Web' },
    { value: 'LOJA', label: 'Loja' },
    { value: 'TELEFONE', label: 'Telefone' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE_PAGAMENTO':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMADA':
        return 'bg-blue-100 text-blue-800';
      case 'EM_CURSO':
        return 'bg-green-100 text-green-800';
      case 'FINALIZADA':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Reservas</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie todas as reservas de veículos
          </p>

          <Card className="p-6">
            <CRUDTable
              data={reservas}
              columns={[
                {
                  key: 'cliente_id',
                  label: 'Cliente',
                  render: (value) => {
                    const cliente = clientes.find((c: any) => c.id === value);
                    return cliente ? cliente.nome : '-';
                  },
                },
                {
                  key: 'veiculo_id',
                  label: 'Veículo',
                  render: (value) => {
                    const veiculo = veiculos.find((v: any) => v.id === value);
                    return veiculo
                      ? `${veiculo.marca} ${veiculo.modelo}`
                      : '-';
                  },
                },
                { key: 'data_inicio', label: 'Data Início' },
                { key: 'data_fim', label: 'Data Fim' },
                { key: 'periodo', label: 'Período (dias)' },
                { key: 'valor_total', label: 'Valor Total (R$)' },
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
                { key: 'id', label: 'ID', render: (value) => value.substring(0, 8) + '...' },
              ]}
              customActions={(item) => [
                ...(item.status !== 'CONFIRMADA' && item.status !== 'CANCELADA' ? [
                  <Button
                    key="confirm"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleConfirm(item)}
                  >
                    Confirmar
                  </Button>,
                ] : []),
                ...(item.status !== 'CANCELADA' && item.status !== 'FINALIZADA' ? [
                  <Button
                    key="cancel"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(item)}
                  >
                    Cancelar
                  </Button>,
                ] : []),
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
            title={editingItem ? 'Editar Reserva' : 'Nova Reserva'}
            fields={[
              {
                name: 'cliente_id',
                label: 'Cliente',
                type: 'select',
                options: clienteOptions,
                required: true,
              },
              {
                name: 'veiculo_id',
                label: 'Veículo',
                type: 'searchable-select',
                options: veiculoOptions,
                required: true,
              },
              {
                name: 'loja_retirada_id',
                label: 'Loja de Retirada',
                type: 'select',
                options: lojaOptions,
                required: true,
              },
              {
                name: 'loja_devolucao_id',
                label: 'Loja de Devolução',
                type: 'select',
                options: lojaOptions,
                required: true,
              },
              { 
                name: 'data_inicio', 
                label: 'Data de Início', 
                type: 'date', 
                required: true 
              },
              { 
                name: 'data_fim', 
                label: 'Data de Fim', 
                type: 'date', 
                required: true 
              },
              {
                name: 'periodo',
                label: 'Período (dias)',
                type: 'number',
                readOnly: true,
                required: false,
              },
              {
                name: 'valor_total',
                label: 'Valor Total (R$)',
                type: 'number',
                readOnly: true,
                required: false,
              },
              {
                name: 'motorista_incluido',
                label: 'Incluir Motorista',
                type: 'checkbox',
                placeholder: 'Motorista Incluído',
                required: false,
              },
              {
                name: 'canal_origem',
                label: 'Canal de Origem',
                type: 'select',
                options: canalOptions,
                required: true,
              },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: statusOptions,
                required: true,
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
