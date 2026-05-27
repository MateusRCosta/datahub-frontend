'use client';

import { useState } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAX_JOINS } from '../constants';
import { JoinModal } from './join-modal';
import { Join } from '../schema/view.schema';
import { JoinComNome } from '../types';

type JoinsColunaProps = {
  joins: JoinComNome[];
  onDrop: (baseDadosId: number, nome: string) => void;
  onUpdate: (index: number, data: Join) => void;
  onRemove: (index: number) => void;
};

export function JoinsColuna({ joins, onDrop, onUpdate, onRemove }: JoinsColunaProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (joins.length >= MAX_JOINS) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (joins.length >= MAX_JOINS) return;
    e.preventDefault();
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/json')) as {
        baseDadosId: number;
        nome: string;
      };
      onDrop(payload.baseDadosId, payload.nome);
    } catch {
      // ignore malformed drag data
    }
  };

  return (
    <div
      className='flex flex-col gap-2 min-h-24 border-2 border-dashed rounded-md p-3 transition-colors hover:bg-muted/30'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {joins.map((join, index) => (
        <div
          key={index}
          className='flex items-center gap-2 bg-secondary/30 border rounded px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors'
          onClick={() => setEditingIndex(index)}
        >
          <Database className='h-4 w-4 shrink-0' />
          <div className='flex flex-col text-sm flex-1 min-w-0'>
            <span className='font-medium truncate'>{join.nome}</span>
            {join.campoFrom && (
              <span className='text-xs text-muted-foreground'>
                {join.campoFrom} → {join.campoJoin} ({join.tipo})
              </span>
            )}
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

      {joins.length < MAX_JOINS ? (
        <p className='text-xs text-muted-foreground text-center py-2'>
          Arraste bases aqui (máx. {MAX_JOINS})
        </p>
      ) : (
        <p className='text-xs text-muted-foreground text-center py-2'>
          Limite de {MAX_JOINS} joins atingido
        </p>
      )}

      {editingIndex !== null && (
        <JoinModal
          open={editingIndex !== null}
          onClose={() => setEditingIndex(null)}
          onSave={(data) => onUpdate(editingIndex, data)}
          initialData={{
            baseDadosIdJoin: joins[editingIndex].baseDadosIdJoin,
            nome: joins[editingIndex].nome,
          }}
        />
      )}
    </div>
  );
}
