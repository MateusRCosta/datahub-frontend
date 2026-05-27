'use client';

import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FromComNome } from '../types';

type FromColunaProps = {
  from: FromComNome | null;
  onDrop: (baseDadosId: number, nome: string) => void;
  onRemove: () => void;
};

export function FromColuna({ from, onDrop, onRemove }: FromColunaProps) {
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
      {from ? (
        <div className='flex items-center gap-2 bg-primary/10 border border-primary/30 rounded px-3 py-2'>
          <Database className='h-4 w-4 text-primary shrink-0' />
          <div className='flex flex-col text-sm flex-1 min-w-0'>
            <span className='font-medium'>{from.nome}</span>
            <span className='text-xs text-muted-foreground'>ID: {from.baseDadosId}</span>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='shrink-0'
            onClick={onRemove}
          >
            <Trash2 className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      ) : (
        <p className='text-xs text-muted-foreground text-center py-4'>
          Arraste uma base aqui
        </p>
      )}
    </div>
  );
}
