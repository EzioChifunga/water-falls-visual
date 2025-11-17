'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { enderecosAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';

export default function EnderecosPage() {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadEnderecos();
  }, []);

  async function loadEnderecos() {
    setLoading(true);
    const result = await enderecosAPI.list();
    setEnderecos(result.data || []);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    if (editingItem) {
      await enderecosAPI.update(editingItem.id, data);
      setEditingItem(null);
    } else {
      await enderecosAPI.create(data);
    }
    await loadEnderecos();
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja deletar este endereço?')) {
      await enderecosAPI.delete(item.id);
      await loadEnderecos();
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Endereços</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie todos os endereços do sistema
          </p>

          <Card className="p-6">
            <CRUDTable
              data={enderecos}
              columns={[
                { key: 'rua', label: 'Rua' },
                { key: 'cidade', label: 'Cidade' },
                { key: 'estado', label: 'Estado' },
                { key: 'latitude', label: 'Latitude' },
                { key: 'longitude', label: 'Longitude' },
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
            title={editingItem ? 'Editar Endereço' : 'Novo Endereço'}
            fields={[
              { name: 'rua', label: 'Rua', placeholder: 'Ex: Av. Paulista' },
              { name: 'cidade', label: 'Cidade', placeholder: 'Ex: São Paulo' },
              { name: 'estado', label: 'Estado', placeholder: 'Ex: SP' },
              { name: 'latitude', label: 'Latitude', type: 'number' },
              { name: 'longitude', label: 'Longitude', type: 'number' },
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
