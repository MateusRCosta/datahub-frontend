'use client';

import { useState } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectModal } from './select-modal';
import { BasesDadosApiResponse, Metadado } from '@/features/base-dados/schema/base-dados.schema';
import { SelectCampo } from '../schema/view.schema';
import { SelectComNome } from '../types';

type SelectColunaProps = {
  selects: SelectComNome[];
  basesDados: BasesDadosApiResponse[];
  basesDadosPermitidas: number[];
  onDrop: (baseDadosId: number, nome: string) => void;
  onUpdate: (index: number, campos: SelectCampo[]) => void;
  onRemove: (index: number) => void;
};

export function SelectColuna({
  selects,
  basesDados,
  basesDadosPermitidas,
  onDrop,
  onUpdate,
  onRemove,
}: SelectColunaProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const basesDadosPermitidasSet = new Set(basesDadosPermitidas);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/json')) as {
        baseDadosId: number;
        nome: string;
      };
      if (!basesDadosPermitidasSet.has(payload.baseDadosId)) return;
      onDrop(payload.baseDadosId, payload.nome);
    } catch {
      // ignore malformed drag data
    }
  };

  const getEstrutura = (baseDadosId: number): Metadado[] => {
    return basesDados.find((bd) => bd.id === baseDadosId)?.estrutura ?? [];
  };

  const editingEntry = editingIndex !== null ? selects[editingIndex] : null;

  return (
    <div
      className='flex flex-col gap-2 min-h-24 border-2 border-dashed rounded-md p-3 transition-colors hover:bg-muted/30'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {selects.map((entry, index) => (
        <div
          key={index}
          className='flex items-start gap-2 bg-accent/30 border rounded px-3 py-2 cursor-pointer hover:bg-accent/50 transition-colors'
          onClick={() => setEditingIndex(index)}
        >
          <Database className='h-4 w-4 shrink-0 mt-0.5' />
          <div className='flex flex-col text-sm flex-1 min-w-0'>
            <span className='font-medium truncate'>{entry.nome}</span>
            <span className='text-xs text-muted-foreground'>
              {entry.campos.length > 0
                ? entry.campos.map((campo) => campo.rotulo).join(', ')
                : 'Nenhum campo selecionado'}
            </span>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='shrink-0'
            onClick={(event) => {
              event.stopPropagation();
              onRemove(index);
            }}
          >
            <Trash2 className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      ))}

      <p className='text-xs text-muted-foreground text-center py-2'>
        Arraste bases do From ou dos Joins aqui
      </p>

      {editingIndex !== null && editingEntry !== null && (
        <SelectModal
          open={editingIndex !== null}
          onClose={() => setEditingIndex(null)}
          onSave={(campos) => onUpdate(editingIndex, campos)}
          baseDadosId={editingEntry.baseDadosId}
          estrutura={getEstrutura(editingEntry.baseDadosId)}
          selectedCampos={editingEntry.campos}
        />
      )}
    </div>
  );
}
