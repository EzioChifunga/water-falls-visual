'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { historicoStatusAPI, veiculosAPI } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function HistoricoPage() {
  const [historico, setHistorico] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVeiculo, setSelectedVeiculo] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [historicoResult, veiculosResult] = await Promise.all([
      historicoStatusAPI.list(),
      veiculosAPI.list(),
    ]);
    setHistorico(historicoResult.data || []);
    setVeiculos(veiculosResult.data || []);
    setLoading(false);
  }

  const veiculoFiltrado =
    selectedVeiculo && historico.filter((h: any) => h.veiculo_id === selectedVeiculo);
  const dadosExibir = selectedVeiculo ? veiculoFiltrado : historico;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'bg-green-100 text-green-800';
      case 'ALUGADO':
        return 'bg-blue-100 text-blue-800';
      case 'MANUTENCAO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Histórico de Status</h1>
          <p className="text-muted-foreground mb-6">
            Acompanhe o histórico de mudanças de status dos veículos
          </p>

          <Card className="p-6 mb-6">
            <label className="block text-sm font-medium mb-2">
              Filtrar por Veículo
            </label>
            <select
              value={selectedVeiculo}
              onChange={(e) => setSelectedVeiculo(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Todos os veículos</option>
              {veiculos.map((vei: any) => (
                <option key={vei.id} value={vei.id}>
                  {vei.marca} {vei.modelo} - {vei.placa}
                </option>
              ))}
            </select>
          </Card>

          <Card className="p-6">
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : dadosExibir.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum histórico encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosExibir.map((item: any) => {
                      const veiculo = veiculos.find(
                        (v: any) => v.id === item.veiculo_id
                      );
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {veiculo
                              ? `${veiculo.marca} ${veiculo.modelo}`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              item.criado_em
                            ).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>{item.descricao || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
