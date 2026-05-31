'use client';

import { Trash2 } from 'lucide-react';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { STATUS_CAMPANHA, campanhaPodeExcluir } from '../types/campanha.types';

interface CampanhaDeletaProps {
  id: number;
  nome: string;
  status: STATUS_CAMPANHA;
}

export function CampanhaDeleta({ id, nome, status }: CampanhaDeletaProps) {
  if (!campanhaPodeExcluir(status)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Trash2 className='mr-2 h-4 text-muted-foreground opacity-50' />
          </TooltipTrigger>
          <TooltipContent>
            <span>Somente campanhas pendentes podem ser excluídas.</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <DialogDeleta
      id={id}
      path='campanhas'
      nome={nome}
      objeto='Campanha'
      mensagens={{
        naoEncontrado: `A campanha "${nome}" não foi encontrada.`,
        sucesso: `A campanha "${nome}" foi excluída com sucesso.`,
        confirmacao: (
          <p>
            Tem certeza que deseja excluir a campanha <strong>{nome}</strong>?
          </p>
        ),
      }}
    />
  );
}
