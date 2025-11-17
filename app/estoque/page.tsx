'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { estoqueAPI, veiculosAPI, lojasAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EstoquePage() {
  const [estoque, setEstoque] = useState([]);
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

    const [veiculosResult, lojasResult] = await Promise.all([
      veiculosAPI.list(),
      lojasAPI.list(),
    ]);

    setVeiculos(veiculosResult.data || []);
    setLojas(lojasResult.data || []);

    // carregar estoque por loja
    const allEstoque: any[] = [];
    for (const loja of lojasResult.data || []) {
      const res = await estoqueAPI.listByLoja(loja.id);
      if (res.data) allEstoque.push(...res.data);
    }

    setEstoque(allEstoque);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    const submitData = {
      veiculo_id: data.veiculo_id,
      loja_id: data.loja_id,
      quantidade: parseInt(data.quantidade),
      status: data.status || 'DISPONIVEL',
    };

    if (editingItem) {
      await estoqueAPI.update(editingItem.id, submitData);
      setEditingItem(null);
    } else {
      await estoqueAPI.create(submitData);
    }

    await loadData();
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja remover este item do estoque?')) {
      await estoqueAPI.delete(item.id);
      await loadData();
    }
  }

  const veiculoOptions = veiculos.map((v: any) => ({
    value: v.id,
    label: `${v.marca} ${v.modelo} - ${v.placa}`,
  }));

  const lojaOptions = lojas.map((l: any) => ({
    value: l.id,
    label: l.nome,
  }));

  const statusOptions = [
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'ALUGADO', label: 'Alugado' },
    { value: 'RESERVADO', label: 'Reservado' },
    { value: 'MANUTENCAO', label: 'Manutenção' },
    { value: 'FORA_AREA', label: 'Fora da Área' },
    { value: 'EM_USO', label: 'Em Uso' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL': return 'bg-green-100 text-green-800';
      case 'ALUGADO': return 'bg-blue-100 text-blue-800';
      case 'RESERVADO': return 'bg-purple-100 text-purple-800';
      case 'MANUTENCAO': return 'bg-yellow-100 text-yellow-800';
      case 'FORA_AREA': return 'bg-red-100 text-red-800';
      case 'EM_USO': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Estoque de Veículos</h1>
              <p className="text-muted-foreground">
                Gerencie a quantidade de veículos por loja
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              + Adicionar Estoque
            </Button>
          </div>

          <Card className="p-6">
            <CRUDTable
              data={estoque}
              columns={[
                {
                  key: 'veiculo_id',
                  label: 'Veículo',
                  render: (value) => {
                    const veiculo = veiculos.find((v: any) => v.id === value);
                    return veiculo ? `${veiculo.marca} ${veiculo.modelo}` : '-';
                  },
                },
                {
                  key: 'loja_id',
                  label: 'Loja',
                  render: (value) => {
                    const loja = lojas.find((l: any) => l.id === value);
                    return loja ? loja.nome : '-';
                  },
                },
                { key: 'quantidade', label: 'Quantidade' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => (
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(value)}`}
                    >
                      {value}
                    </span>
                  ),
                },
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
            title={editingItem ? 'Editar Estoque' : 'Adicionar ao Estoque'}
            fields={[
              {
                name: 'veiculo_id',
                label: 'Veículo',
                type: 'searchable-select',
                options: veiculoOptions,
                required: true,
              },
              {
                name: 'loja_id',
                label: 'Loja',
                type: 'searchable-select',
                options: lojaOptions,
                required: true,
              },
              {
                name: 'quantidade',
                label: 'Quantidade',
                type: 'number',
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
            initialData={editingItem || {}}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}
