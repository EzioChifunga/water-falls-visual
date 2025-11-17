'use client';

import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VehicleCardProps {
  vehicle: any;
  onView: (vehicle: any) => void;
  onEdit: (vehicle: any) => void;
  onDelete: (vehicle: any) => void;
  onStatusChange: (vehicleId: string, newStatus: string) => void;
}

export function VehicleCard({
  vehicle,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: VehicleCardProps) {
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    'DISPONIVEL',
    'ALUGADO',
    'RESERVADO',
    'MANUTENCAO',
    'FORA_AREA',
  ];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 overflow-hidden relative group">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url || "/placeholder.svg"}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-gray-600 font-semibold">Sem Imagem</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(vehicle)}
            className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition"
            title="Ver detalhes"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => onEdit(vehicle)}
            className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition"
            title="Editar"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => onDelete(vehicle)}
            className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition"
            title="Deletar"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-balance">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          <p className="text-sm text-muted-foreground">
            {vehicle.ano} • {vehicle.cor}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Placa:</span>
            <p className="font-semibold">{vehicle.placa}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Diária:</span>
            <p className="font-semibold">R$ {vehicle.diaria.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Câmbio:</span>
            <p className="font-semibold">{vehicle.cambio}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Combustível:</span>
            <p className="font-semibold">{vehicle.combustivel}</p>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Status</span>
          <select
            value={vehicle.status}
            onChange={(e) => onStatusChange(vehicle.id, e.target.value)}
            className={`w-full py-1 rounded text-sm font-medium border border-input cursor-pointer px-2 ${getStatusColor(
              vehicle.status
            )}`}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
