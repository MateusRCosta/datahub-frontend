'use client';

import { Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface FiltroProps {
  childrenComplexo: ReactNode;
  childrenSimples: ReactNode;
}

export function Filtro({ childrenComplexo, childrenSimples }: FiltroProps) {
  return (
    <div
      className='flex flex-row items-center gap-1 self-end place-self-end'
      data-filtro-wrapper
    >
      {childrenSimples}

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            className='bg-field-background dark:bg-input/30'
          >
            <Settings2 className='mr-2 h-4 w-4' /> Filtros
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtro Avançado</SheetTitle>
            <SheetDescription>
              Dica de uso: apague a pesquisa e selecione os campos e valores
              desejados aqui
            </SheetDescription>
          </SheetHeader>
          <div className='px-4'>{childrenComplexo}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
