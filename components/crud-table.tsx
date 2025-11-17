'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface CRUDTableProps {
  data: any[];
  columns: Column[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView?: (item: any) => void;
  loading?: boolean;
  showViewButton?: boolean;
}

export function CRUDTable({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading,
  showViewButton = false,
}: CRUDTableProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onAdd} className="gap-2">
        <Plus size={20} />
        Adicionar
      </Button>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum registro encontrado
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      {showViewButton && onView && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView(item)}
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(item)}
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
