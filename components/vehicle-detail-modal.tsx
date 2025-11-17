'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VehicleDetailModalProps {
  isOpen: boolean;
  vehicle: any;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetailModal({
  isOpen,
  vehicle,
  onOpenChange,
}: VehicleDetailModalProps) {
  if (!vehicle) return null;

  const specs = [
    { label: 'Placa', value: vehicle.placa },
    { label: 'Marca', value: vehicle.marca },
    { label: 'Modelo', value: vehicle.modelo },
    { label: 'Ano', value: vehicle.ano },
    { label: 'Cor', value: vehicle.cor },
    { label: 'Combustível', value: vehicle.combustivel },
    { label: 'Portas', value: vehicle.portas },
    { label: 'Câmbio', value: vehicle.cambio },
    { label: 'Quilometragem', value: `${vehicle.quilometragem} km` },
    { label: 'Diária', value: `R$ ${vehicle.diaria?.toFixed(2) || '0.00'}` },
    { label: 'Status', value: vehicle.status },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Veículo</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url || "/placeholder.svg"}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">Sem imagem</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-center">
              {vehicle.marca} {vehicle.modelo}
            </h2>
            <p className="text-muted-foreground text-center mt-1">
              {vehicle.ano}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {specs.map((spec) => (
              <div key={spec.label} className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground font-medium">
                  {spec.label}
                </p>
                <p className="text-sm font-semibold mt-1">
                  {spec.value || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {(vehicle.latitude || vehicle.longitude) && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Localização</h3>
            <p className="text-sm text-muted-foreground">
              Latitude: {vehicle.latitude} | Longitude: {vehicle.longitude}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
