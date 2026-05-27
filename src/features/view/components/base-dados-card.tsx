'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';

type BaseDadosCardProps = {
  baseDados: BasesDadosApiResponse;
};

export function BaseDadosCard({ baseDados }: BaseDadosCardProps) {
  const [expandido, setExpandido] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ baseDadosId: baseDados.id, nome: baseDados.nome }),
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className='border rounded-md bg-card cursor-grab active:cursor-grabbing select-none'
      draggable
      onDragStart={handleDragStart}
    >
      <div
        className='flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors'
        onClick={() => setExpandido((anterior) => !anterior)}
      >
        <GripVertical className='h-4 w-4 text-muted-foreground shrink-0' />
        <span className='text-sm font-medium flex-1'>{baseDados.nome}</span>
        {expandido ? (
          <ChevronDown className='h-4 w-4 text-muted-foreground shrink-0' />
        ) : (
          <ChevronRight className='h-4 w-4 text-muted-foreground shrink-0' />
        )}
      </div>

      {expandido && (
        <div className='border-t divide-y'>
          {baseDados.estrutura.map((metadado) => (
            <div
              key={metadado.cabecalho}
              className='flex flex-col px-3 py-2 text-xs'
            >
              <span className='font-medium'>{metadado.rotulo ?? metadado.cabecalho}</span>
              <span className='text-muted-foreground'>{metadado.cabecalho}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
