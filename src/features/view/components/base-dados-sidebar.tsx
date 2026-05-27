'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { BaseDadosCard } from './base-dados-card';

type BaseDadosSidebarProps = {
  basesDados: BasesDadosApiResponse[];
};

export function BaseDadosSidebar({ basesDados }: BaseDadosSidebarProps) {
  const [recolhido, setRecolhido] = useState(false);

  return (
    <aside
      className={`flex flex-col border-l bg-background h-full overflow-y-auto p-4 gap-3 transition-[width] ${
        recolhido ? 'w-16 min-w-16' : 'w-72 min-w-64'
      }`}
    >
      <div className='flex items-center gap-2'>
        {!recolhido && (
          <h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide flex-1'>
            Bases de Dados
          </h2>
        )}
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => setRecolhido((valor) => !valor)}
          aria-label={recolhido ? 'Expandir bases de dados' : 'Recolher bases de dados'}
        >
          {recolhido ? (
            <ChevronLeft className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
      </div>

      {!recolhido && (
        <>
          {basesDados.length === 0 && (
            <p className='text-sm text-muted-foreground'>Nenhuma base encontrada.</p>
          )}
          {basesDados.map((bd) => (
            <BaseDadosCard key={bd.id} baseDados={bd} />
          ))}
        </>
      )}
    </aside>
  );
}
