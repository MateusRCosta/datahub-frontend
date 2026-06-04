'use client';

import { useState } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAX_JOINS } from '../../constants';
import { JoinModal } from './join-modal';
import { type Join } from '../../schema/view.schema';
import { type JoinComNome } from '../../types';

type JoinsColunaProps = {
  joins: JoinComNome[];
  onUpdate: (index: number, data: Join) => void;
  onRemove: (index: number) => void;
};

export function JoinsColuna({ joins, onUpdate, onRemove }: JoinsColunaProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className='flex flex-col gap-2 min-h-24 border-2 border-dashed rounded-md p-3 transition-colors hover:bg-muted/30'>
      {joins.map((join, index) => (
        <div
          key={index}
          className='flex items-center gap-2 bg-secondary/30 border rounded px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors'
          onClick={() => setEditingIndex(index)}
        >
          <Database className='h-4 w-4 shrink-0' />
          <div className='flex flex-col text-sm flex-1 min-w-0'>
            <span className='font-medium truncate'>{join.nome} <span className='text-muted-foreground'>#{join.baseDadosIdJoin}</span></span>
            {join.campoFrom && (
              <span className='text-xs text-muted-foreground'>
                Referência: {join.campoFrom}
                <br/>
                Junção: {join.campoJoin} 
                <br/>
                Tipo: {join.tipo}
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
          Use o botão + para adicionar bases (máx. {MAX_JOINS})
        </p>
      ) : (
        <p className='text-xs text-muted-foreground text-center py-2'>
          Limite de {MAX_JOINS} junções atingido
        </p>
      )}

      {editingIndex !== null && (
        <JoinModal
          open={editingIndex !== null}
          onClose={() => setEditingIndex(null)}
          onSave={(data) => onUpdate(editingIndex, data)}
          initialData={joins[editingIndex]}
        />
      )}
    </div>
  );
}
