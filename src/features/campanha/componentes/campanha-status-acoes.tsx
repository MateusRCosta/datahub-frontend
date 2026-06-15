'use client';

import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ApiResponseError } from '@/types/api.schema';
import useAlteraStatusCampanha from '../api/use-altera-status-campanha';
import { mapCampanhaError } from '../types/erros.constant';
import {
  STATUS_CAMPANHA,
  STATUS_CAMPANHA_LABEL,
  STATUS_CAMPANHA_TRANSICOES,
} from '../types/campanha.types';

interface CampanhaStatusAcoesProps {
  id: number;
  status: STATUS_CAMPANHA;
  nome: string;
}

export function CampanhaStatusAcoes({
  id,
  status,
  nome,
}: CampanhaStatusAcoesProps) {
  const transicoes = STATUS_CAMPANHA_TRANSICOES[status];
  const { mutateAsync, isPending } = useAlteraStatusCampanha(id);

  if (transicoes.length === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className='h-7 w-7 opacity-50'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Sem transições permitidas para este status.</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const alterarStatus = async (proximoStatus: STATUS_CAMPANHA) => {
    try {
      const response = await mutateAsync({ id, status: proximoStatus });

      if (response.status === 204) {
        toast.success(
          `Campanha "${nome}" alterada para ${STATUS_CAMPANHA_LABEL[proximoStatus]}.`,
        );
        return;
      }

      toast.error('Erro ao alterar status da campanha.');
    } catch (error) {
      toast.error(mapCampanhaError(error as ApiResponseError));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={isPending}
          className='h-7 w-7'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {transicoes.map((proximoStatus) => (
          <DropdownMenuItem
            key={proximoStatus}
            onClick={() => alterarStatus(proximoStatus)}
          >
            Alterar para {STATUS_CAMPANHA_LABEL[proximoStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
