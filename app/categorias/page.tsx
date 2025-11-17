'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { categoriasAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  async function loadCategorias() {
    setLoading(true);
    const result = await categoriasAPI.list();
    setCategorias(result.data || []);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    if (editingItem) {
      await categoriasAPI.update(editingItem.id, data);
      setEditingItem(null);
    } else {
      await categoriasAPI.create(data);
    }
    await loadCategorias();
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      await categoriasAPI.delete(item.id);
      await loadCategorias();
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Categorias de Veículos</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie as categorias de veículos
          </p>

          <Card className="p-6">
            <CRUDTable
              data={categorias}
              columns={[{ key: 'nome', label: 'Nome da Categoria' }]}
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
            title={editingItem ? 'Editar Categoria' : 'Nova Categoria'}
            fields={[
              {
                name: 'nome',
                label: 'Nome',
                placeholder: 'Ex: SUV, Sedan, Hatchback',
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
