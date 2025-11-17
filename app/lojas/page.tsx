'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { AddressModal } from '@/components/address-modal';
import { lojasAPI, enderecosAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';

export default function LojasPage() {
  const [lojas, setLojas] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [lojasResult, enderecosResult] = await Promise.all([
      lojasAPI.list(),
      enderecosAPI.list(),
    ]);
    setLojas(lojasResult.data || []);
    setEnderecos(enderecosResult.data || []);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    if (editingItem) {
      await lojasAPI.update(editingItem.id, data);
      setEditingItem(null);
    } else {
      await lojasAPI.create(data);
    }
    await loadData();
  }

  async function handleAddressSubmit(data: any) {
    const submitData = {
      ...data,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
    };
    await enderecosAPI.create(submitData);
    await loadData();
    setAddressModalOpen(false);
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja deletar esta loja?')) {
      await lojasAPI.delete(item.id);
      await loadData();
    }
  }

  const enderecoOptions = enderecos.map((end: any) => ({
    value: end.id,
    label: `${end.rua}, ${end.cidade} (${end.id})`,
  }));

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Lojas</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie todas as lojas do sistema
          </p>

          <Card className="p-6">
            <CRUDTable
              data={lojas}
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'telefone', label: 'Telefone' },
                {
                  key: 'endereco_id',
                  label: 'Endereço',
                  render: (value) => {
                    const endereco = enderecos.find(
                      (e: any) => e.id === value
                    );
                    return endereco
                      ? `${endereco.rua}, ${endereco.cidade}`
                      : '-';
                  },
                },
                { key: 'id', label: 'ID', render: (value) => value.substring(0, 8) + '...' },
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
            title={editingItem ? 'Editar Loja' : 'Nova Loja'}
            fields={[
              { name: 'nome', label: 'Nome', placeholder: 'Ex: Loja Centro', required: true },
              {
                name: 'telefone',
                label: 'Telefone',
                placeholder: 'Ex: +55 11 3333-4444',
                required: true,
              },
              {
                name: 'endereco_id',
                label: 'Endereço',
                type: 'select',
                options: enderecoOptions,
                required: true,
              },
            ]}
            initialData={editingItem}
            onSubmit={handleSubmit}
            onOpenChange={setModalOpen}
          />

          <AddressModal
            isOpen={addressModalOpen}
            onOpenChange={setAddressModalOpen}
            onSubmit={handleAddressSubmit}
          />
        </div>
      </main>
    </div>
  );
}
