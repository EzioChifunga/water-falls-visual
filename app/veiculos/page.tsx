'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { CRUDTable } from '@/components/crud-table';
import { CRUDModal } from '@/components/crud-modal';
import { VehicleDetailModal } from '@/components/vehicle-detail-modal';
import { VehicleCard } from '@/components/vehicle-card';
import { estoqueAPI, veiculosAPI, categoriasAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, List, Grid } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [marcaFilter, setMarcaFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = veiculos;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v: any) =>
          v.placa.toLowerCase().includes(search) ||
          v.marca.toLowerCase().includes(search) ||
          v.modelo.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((v: any) => v.status === statusFilter);
    }

    if (marcaFilter) {
      filtered = filtered.filter((v: any) => v.marca === marcaFilter);
    }

    setFilteredVeiculos(filtered);
  }, [veiculos, searchTerm, statusFilter, marcaFilter]);

  async function loadData() {
    setLoading(true);
    const [veiculosResult, categoriasResult] = await Promise.all([
      veiculosAPI.list(),
      categoriasAPI.list(),
    ]);
    setVeiculos(veiculosResult.data || []);
    setCategorias(categoriasResult.data || []);
    setLoading(false);
  }

  async function handleSubmit(data: any) {
    const submitData = {
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      ano: parseInt(data.ano),
      categoria_id: data.categoria_id,
      diaria: parseFloat(data.diaria),
      image_url: data.image_url || '',
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      cor: data.cor,
      combustivel: data.combustivel,
      portas: parseInt(data.portas),
      cambio: data.cambio,
      quilometragem: parseFloat(data.quilometragem),
    };

    if (editingItem) {
      await veiculosAPI.update(editingItem.id, submitData);
      setEditingItem(null);
    } else {
      await veiculosAPI.create(submitData);
    }
    await loadData();
  }

  async function handleStatusChange(vehicleId: string, newStatus: string) {
    try {
      const result = await veiculosAPI.updateStatus(vehicleId, newStatus);
      if (result.error) {
        console.error('[v0] Error updating status:', result.error);
        alert('Erro ao atualizar status do veículo');
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('[v0] Error updating status:', error);
      alert('Erro ao atualizar status do veículo');
    }
  }

  async function handleDelete(item: any) {
    if (confirm('Tem certeza que deseja deletar este veículo?')) {
      await veiculosAPI.delete(item.id);
      await loadData();
    }
  }

  const categoriaOptions = categorias.map((cat: any) => ({
    value: cat.id,
    label: cat.nome,
  }));

  const statusOptions = [
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'ALUGADO', label: 'Alugado' },
    { value: 'RESERVADO', label: 'Reservado' },
    { value: 'MANUTENCAO', label: 'Manutenção' },
    { value: 'FORA_AREA', label: 'Fora da Área' },
    { value: 'EM_USO', label: 'Em Uso' },
  ];

  const uniqueBrands = Array.from(new Set(veiculos.map((v: any) => v.marca)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'bg-green-100 text-green-800';
      case 'ALUGADO':
        return 'bg-blue-100 text-blue-800';
      case 'RESERVADO':
        return 'bg-purple-100 text-purple-800';
      case 'MANUTENCAO':
        return 'bg-yellow-100 text-yellow-800';
      case 'FORA_AREA':
        return 'bg-red-100 text-red-800';
      case 'EM_USO':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8 lg:py-4 lg:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Veículos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os veículos da frota
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              + Novo Veículo
            </Button>
          </div>

          <Card className="p-4 mb-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar por placa, marca ou modelo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List size={18} />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Todos os status</option>
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Marca</label>
                  <select
                    value={marcaFilter}
                    onChange={(e) => setMarcaFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Todas as marcas</option>
                    {uniqueBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchTerm || statusFilter || marcaFilter) && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                        setMarcaFilter('');
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <p className="text-sm text-muted-foreground mb-4">
            {filteredVeiculos.length} veículo{filteredVeiculos.length !== 1 ? 's' : ''} encontrado{filteredVeiculos.length !== 1 ? 's' : ''}
          </p>

          {viewMode === 'list' ? (
            <Card className="p-6">
              <CRUDTable
                data={filteredVeiculos}
                columns={[
                  { key: 'placa', label: 'Placa' },
                  { key: 'marca', label: 'Marca' },
                  { key: 'modelo', label: 'Modelo' },
                  { key: 'ano', label: 'Ano' },

                  {
                    key: 'status',
                    label: 'Status',
                    render: (value, row) => (
                      <select
                        value={value}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className="px-2 py-1 border rounded-md text-sm"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ),
                  },

                  { key: 'diaria', label: 'Diária (R$)' },
                  {
                    key: 'id',
                    label: 'ID',
                    render: (value) => value.substring(0, 8) + '...',
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
                onView={(item) => {
                  setViewingItem(item);
                  setDetailModalOpen(true);
                }}
                loading={loading}
                showViewButton={true}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVeiculos.map((vehicle: any) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onView={(v) => {
                    setViewingItem(v);
                    setDetailModalOpen(true);
                  }}
                  onEdit={(v) => {
                    setEditingItem(v);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          <CRUDModal
            isOpen={modalOpen}
            title={editingItem ? 'Editar Veículo' : 'Novo Veículo'}
            fields={[
              { name: 'placa', label: 'Placa', placeholder: 'Ex: ABC1234', required: true },
              { name: 'marca', label: 'Marca', placeholder: 'Ex: Toyota', required: true },
              { name: 'modelo', label: 'Modelo', placeholder: 'Ex: Corolla', required: true },
              { name: 'ano', label: 'Ano', type: 'number', required: true },
              { name: 'cor', label: 'Cor', placeholder: 'Ex: Prata', required: true },
              {
                name: 'combustivel',
                label: 'Combustível',
                placeholder: 'Ex: Flex',
                required: true,
              },
              { name: 'portas', label: 'Portas', type: 'number', required: true },
              { name: 'cambio', label: 'Câmbio', placeholder: 'Ex: Automático', required: true },
              {
                name: 'quilometragem',
                label: 'Quilometragem',
                type: 'number',
                required: true,
              },
              {
                name: 'categoria_id',
                label: 'Categoria',
                type: 'select',
                options: categoriaOptions,
                required: true,
              },
              { name: 'diaria', label: 'Diária (R$)', type: 'number', required: true },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: statusOptions,
                required: true,
              },
              {
                name: 'image_url',
                label: 'URL da Imagem',
                placeholder: 'https://example.com/image.jpg',
                required: false,
              },
              { name: 'latitude', label: 'Latitude', type: 'number', required: false },
              { name: 'longitude', label: 'Longitude', type: 'number', required: false },
            ]}
            initialData={editingItem}
            onSubmit={handleSubmit}
            onOpenChange={setModalOpen}
          />

          <VehicleDetailModal
            isOpen={detailModalOpen}
            vehicle={viewingItem}
            onOpenChange={setDetailModalOpen}
          />
        </div>
      </main>
    </div>
  );
}
