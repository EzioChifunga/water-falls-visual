'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  veiculosAPI,
  clientesAPI,
  reservasAPI,
  pagamentosAPI,
} from '@/lib/api-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  veiculos: number;
  clientes: number;
  reservas: number;
  pagamentos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    veiculos: 0,
    clientes: 0,
    reservas: 0,
    pagamentos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [veiculos, clientes, reservas, pagamentos] = await Promise.all([
          veiculosAPI.list(),
          clientesAPI.list(),
          reservasAPI.list(),
          pagamentosAPI.list(),
        ]);

        setStats({
          veiculos: (veiculos.data as any[])?.length || 0,
          clientes: (clientes.data as any[])?.length || 0,
          reservas: (reservas.data as any[])?.length || 0,
          pagamentos: (pagamentos.data as any[])?.length || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const chartData = [
    { name: 'Veículos', value: stats.veiculos },
    { name: 'Clientes', value: stats.clientes },
    { name: 'Reservas', value: stats.reservas },
    { name: 'Pagamentos', value: stats.pagamentos },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-background">
        <div className="p-4 lg:p-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Bem-vindo ao sistema de aluguel de carros
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">
                    Veículos
                  </div>
                  <div className="text-3xl font-bold mt-2">{stats.veiculos}</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">
                    Clientes
                  </div>
                  <div className="text-3xl font-bold mt-2">{stats.clientes}</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">
                    Reservas
                  </div>
                  <div className="text-3xl font-bold mt-2">{stats.reservas}</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">
                    Pagamentos
                  </div>
                  <div className="text-3xl font-bold mt-2">{stats.pagamentos}</div>
                </Card>
              </div>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Resumo de Dados</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#5b5bff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
