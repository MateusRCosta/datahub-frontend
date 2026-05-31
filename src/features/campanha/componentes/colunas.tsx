'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formataDataUI } from '@/lib/utils';
import { CampanhasResponse } from '../schema/campanha.schema';
import {
  STATUS_CAMPANHA,
  STATUS_CAMPANHA_LABEL,
} from '../types/campanha.types';
import { CampanhaAtualiza } from './campanha-atualiza';
import { CampanhaDeleta } from './campanha-deleta';
import { CampanhaStatusAcoes } from './campanha-status-acoes';

const statusBadgeVariant: Record<
  STATUS_CAMPANHA,
  React.ComponentProps<typeof Badge>['variant']
> = {
  [STATUS_CAMPANHA.PENDENTE]: 'outline',
  [STATUS_CAMPANHA.EM_ENVIO]: 'default',
  [STATUS_CAMPANHA.PAUSA]: 'secondary',
  [STATUS_CAMPANHA.CANCELADA]: 'destructive',
  [STATUS_CAMPANHA.ENVIADA]: 'ghost',
};

export const colunas: ColumnDef<CampanhasResponse>[] = [
  {
    accessorKey: 'id',
    header: () => <div className='sr-only'>Identificador</div>,
    cell: ({ row }) => <span className='font-medium'>{row.original.id}</span>,
  },
  {
    accessorKey: 'nome',
    header: () => <div>Nome</div>,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.nome}</span>
        <span className='text-xs text-muted-foreground'>
          {row.original.usuario
            ? `Criada pelo usuário: ${row.original.usuario.nome}`
            : ''}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => (
      <Badge variant={statusBadgeVariant[row.original.status]}>
        {STATUS_CAMPANHA_LABEL[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: 'template.nome',
    header: () => <div>Template</div>,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.template.nome}</span>
        <span className='text-xs text-muted-foreground'>
          {row.original.template.integracaoCampanha.provedor.toUpperCase()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'view.nome',
    header: () => <div>Fonte</div>,
    cell: ({ row }) => {
      const viewNome = row.original.view?.nome;
      const baseDadosNome = row.original.baseDeDados?.nome;

      return (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {viewNome ?? baseDadosNome ?? '-'}
          </span>
          <span className='text-xs text-muted-foreground'>
            {viewNome ? 'Visualização' : 'Base de dados'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduledAt',
    header: () => <div>Agendado em</div>,
    cell: ({ row }) => (
      <span className='font-medium'>
        {formataDataUI(row.original.scheduledAt)}
      </span>
    ),
  },
  {
    id: 'acoes',
    header: () => <span className='sr-only'>Ações</span>,
    cell: ({ row }) => (
      <div className='flex items-center gap-1'>
        <CampanhaStatusAcoes
          id={row.original.id}
          status={row.original.status}
          nome={row.original.nome}
        />
        <CampanhaAtualiza id={row.original.id} status={row.original.status} />
        <CampanhaDeleta
          id={row.original.id}
          status={row.original.status}
          nome={row.original.nome}
        />
      </div>
    ),
  },
];
