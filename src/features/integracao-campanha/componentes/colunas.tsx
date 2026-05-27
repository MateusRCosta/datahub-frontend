'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import { TableModal } from '@/types/util.schema';
import { IntegracoesCampanhasApiResponse } from '../schema/integracao-campanha.schema';
import { SwitchStatus } from '@/components/layout/switch-status';
import { IntegracaoCampanhaAtualiza } from './integracao-campanha-atualiza';

export const getColunas = ({
  modoSelecao,
}: TableModal<IntegracoesCampanhasApiResponse>): ColumnDef<IntegracoesCampanhasApiResponse>[] => {
  const baseCols: ColumnDef<IntegracoesCampanhasApiResponse>[] = [];

  baseCols.push(
    {
      accessorKey: 'id',
      header: () => {
        return <div className='sr-only'>Identificador</div>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.id}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'nome',
      header: () => {
        return <div>Nome</div>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.nome}</span>
            <span className='text-xs text-muted-foreground'>
              {row.original.usuario
                ? `Criado pelo usuário: ${row.original.usuario.nome}`
                : ''}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'provedor',
      header: () => {
        return <div>Provedor</div>;
      },
      cell: ({ row }) => {
        return (
          <span className='font-medium'>
            {row.original.provedor.toUpperCase()}
          </span>
        );
      },
    },
  );

  if (!modoSelecao) {
    baseCols.push(
      {
        accessorKey: 'status',
        header: () => {
          return <div className=''>Status</div>;
        },
        cell: ({ row }) => {
          return (
            <div className='flex items-right'>
              <SwitchStatus
                status={row.original.status}
                id={row.original.id}
                path='integracoesCampanhas'
                mensagens={{
                  naoEncontrado: `A integração de campanha "${row.original.nome}" não foi encontrada.`,
                  sucesso: 'Status alterado com sucesso.',
                }}
              />
            </div>
          );
        },
      },
      {
        id: 'acoes',
        header: () => {
          return <span className='sr-only'>Ações</span>;
        },
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1'>
              <IntegracaoCampanhaAtualiza id={row.original.id} />
              <DialogDeleta
                id={row.original.id}
                path='integracoesCampanhas'
                nome={row.original.nome}
                objeto={'Integração de campanha'}
                mensagens={{
                  naoEncontrado: `A integração de campanha "${row.original.nome}" não foi encontrado.`,
                  sucesso: `A integração de campanha "${row.original.nome}" foi excluído com sucesso.`,
                  confirmacao: (
                    <p>
                      Tem certeza que deseja excluir a integração de campanha{' '}
                      <strong>{row.original.nome}</strong>?
                    </p>
                  ),
                }}
              />
            </div>
          );
        },
      },
    );
  }
  return baseCols;
};
