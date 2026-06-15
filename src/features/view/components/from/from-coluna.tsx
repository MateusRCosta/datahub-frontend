'use client';

import { Database, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FromComNome } from '../../types';

type FromColunaProps = {
  from: FromComNome | null;
  onRemove: () => void;
};

export function FromColuna({ from, onRemove }: FromColunaProps) {
  return (
    <div className='flex flex-col gap-2 min-h-24 border-2 border-dashed rounded-md p-3 transition-colors hover:bg-muted/30'>
      {from && from.baseDadosId !== 0 ? (
        <div className='flex items-center gap-2 bg-secondary/30 border rounded px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors'>
          <Database className='h-4 w-4 shrink-0' />
          <div className='flex flex-col text-sm flex-1 min-w-0'>
            <span className='font-medium'>
              {from.nome}{' '}
              <span className='text-muted-foreground'>#{from.baseDadosId}</span>
            </span>
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
          Use o botão + para selecionar uma base
        </p>
      )}
    </div>
  );
}
