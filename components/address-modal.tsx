'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddressModal({ isOpen, onOpenChange, onSubmit }: AddressModalProps) {
  const [formData, setFormData] = useState({
    rua: '',
    cidade: '',
    estado: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      setFormData({
        rua: '',
        cidade: '',
        estado: '',
        latitude: '',
        longitude: '',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[v0] Error submitting address:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Endereço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rua <span className="text-red-500">*</span></label>
            <Input
              name="rua"
              placeholder="Ex: Av. Paulista, 1000"
              value={formData.rua}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cidade <span className="text-red-500">*</span></label>
            <Input
              name="cidade"
              placeholder="Ex: São Paulo"
              value={formData.cidade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado <span className="text-red-500">*</span></label>
            <Input
              name="estado"
              placeholder="Ex: SP"
              value={formData.estado}
              onChange={handleChange}
              maxLength={2}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                name="latitude"
                placeholder="-23.564369"
                value={formData.latitude}
                onChange={handleChange}
                step="0.000001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                name="longitude"
                placeholder="-46.653620"
                value={formData.longitude}
                onChange={handleChange}
                step="0.000001"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Endereço'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
