'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';

type BaseDadosSelectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  emptyMessage: string;
  basesDados: BasesDadosCampanhaApiResponse[];
  onSelect: (baseDadosId: number, nome: string) => void;
};

export function BaseDadosSelectModal({
  open,
  onOpenChange,
  title,
  emptyMessage,
  basesDados,
  onSelect,
}: BaseDadosSelectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80dvh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Selecione uma base de dados para adicionar à visualização.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-2 overflow-y-auto pr-1'>
          {basesDados.length === 0 && (
            <p className='text-sm text-muted-foreground'>{emptyMessage}</p>
          )}

          {basesDados.map((baseDados) => (
            <Button
              key={baseDados.id}
              type='button'
              variant='outline'
              className='h-auto justify-start px-3 py-2'
              onClick={() => {
                onSelect(baseDados.id, baseDados.nome);
                onOpenChange(false);
              }}
            >
              <Database className='h-4 w-4 shrink-0' />
              <span className='flex flex-col items-start min-w-0'>
              <span className='font-medium truncate'>{baseDados.nome}</span>
              <span className='text-xs text-muted-foreground'>
                  {baseDados.campos.length} campos
                </span>
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
