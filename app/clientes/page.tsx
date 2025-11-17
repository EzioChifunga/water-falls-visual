'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { AddressModal } from '@/components/address-modal';
import { clientesAPI, enderecosAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
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
    const [clientesResult, enderecosResult] = await Promise.all([
      clientesAPI.list(),
      enderecosAPI.list(),
    ]);
    setClientes(clientesResult.data || []);
    setEnderecos(enderecosResult.data || []);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    const submitData = {
      ...data,
      cpf: data.cpf?.replace(/\D/g, ''),
    };
    
    if (editingItem) {
      await clientesAPI.update(editingItem.id, submitData);
      setEditingItem(null);
    } else {
      await clientesAPI.create(submitData);
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
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      await clientesAPI.delete(item.id);
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
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie todos os clientes cadastrados
          </p>

          <Card className="p-6">
            <CRUDTable
              data={clientes}
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'cpf', label: 'CPF' },
                { key: 'email', label: 'Email' },
                { key: 'telefone', label: 'Telefone' },
                { key: 'cnh_numero', label: 'CNH' },
                { key: 'cnh_validade', label: 'CNH Válida até' },
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
            title={editingItem ? 'Editar Cliente' : 'Novo Cliente'}
            fields={[
              { name: 'nome', label: 'Nome', placeholder: 'Ex: João Silva', required: true },
              { name: 'cpf', label: 'CPF', placeholder: 'Ex: 12345678901', required: true },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'joao@example.com',
                required: true,
              },
              {
                name: 'telefone',
                label: 'Telefone',
                placeholder: 'Ex: +55 11 99999-0000',
                required: false,
              },
              {
                name: 'endereco_id',
                label: 'Endereço',
                type: 'select',
                options: enderecoOptions,
                required: false,
              },
              {
                name: 'cnh_numero',
                label: 'Número da CNH',
                placeholder: 'Ex: 123456789',
                required: true,
              },
              {
                name: 'cnh_validade',
                label: 'Validade da CNH',
                type: 'date',
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
