'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox' | 'searchable-select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  readOnly?: boolean;
  onChange?: (value: any, allData: any) => void;
}

interface CRUDModalProps {
  isOpen: boolean;
  title: string;
  fields: Field[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function CRUDModal({
  isOpen,
  title,
  fields,
  initialData,
  onSubmit,
  onOpenChange,
}: CRUDModalProps) {
  const [formData, setFormData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInputs, setSearchInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(initialData || {});
    setError('');
    setSearchInputs({});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked ? 'true' : 'false';
    }

    const newData = {
      ...formData,
      [name]: finalValue,
    };
    setFormData(newData);
    setError('');

    const field = fields.find(f => f.name === name);
    if (field?.onChange) {
      field.onChange(finalValue, newData);
    }
  };

  const handleSearchInput = (fieldName: string, value: string) => {
    setSearchInputs({
      ...searchInputs,
      [fieldName]: value,
    });
  };

  const getFilteredOptions = (fieldName: string, options?: { value: string; label: string }[]) => {
    if (!options) return [];
    const searchTerm = searchInputs[fieldName]?.toLowerCase() || '';
    if (!searchTerm) return options;
    return options.filter(opt => opt.label.toLowerCase().includes(searchTerm));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      setFormData({});
      onOpenChange(false);
    } catch (error) {
      console.error('[v0] Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'searchable-select' ? (
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchInputs[field.name] || ''}
                    onChange={(e) => handleSearchInput(field.name, e.target.value)}
                    className="text-sm"
                  />
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => {
                      handleChange(e);
                      setSearchInputs({ ...searchInputs, [field.name]: '' });
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    required={field.required}
                    disabled={field.readOnly}
                  >
                    <option value="">Selecione...</option>
                    {getFilteredOptions(field.name, field.options).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  required={field.required}
                  disabled={field.readOnly}
                >
                  <option value="">Selecione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required !== false}
                  disabled={field.readOnly}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows={3}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] === 'true' || formData[field.name] === true}
                    onChange={handleChange}
                    disabled={field.readOnly}
                    className="w-4 h-4"
                  />
                  <label className="ml-2 text-sm">{field.placeholder || field.label}</label>
                </div>
              ) : (
                <Input
                  type={field.type || 'text'}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required !== false}
                  disabled={field.readOnly}
                  readOnly={field.readOnly}
                  className="text-sm"
                />
              )}
            </div>
          ))}
          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
