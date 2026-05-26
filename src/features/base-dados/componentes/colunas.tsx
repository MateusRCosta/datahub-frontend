'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import { TableModal } from '@/types/util.schema';
import { BasesDadosApiResponse } from '../schema/base-dados.schema';
import { BaseDadosAtualiza } from './base-dados-atualiza';
import { ClienteTabela } from '../clientes/componentes/cliente-tabela';

export const getColunas = ({
  modoSelecao,
}: TableModal<BasesDadosApiResponse>): ColumnDef<BasesDadosApiResponse>[] => {
  const baseCols: ColumnDef<BasesDadosApiResponse>[] = [];

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
        return <div className=''>Nome</div>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.nome}</span>
            <span className='text-xs text-muted-foreground'>
              {row.original.usuario
                ? `Criado pelo usuário: ${row.original.usuario.nome}`
                : ''}
              {row.original.integracao
                ? `Criado pela integração: ${row.original.integracao.nome}`
                : ''}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: '_count',
      header: () => {
        return <div className=''>Clientes</div>;
      },
      cell: ({ row }) => {
        return (
          <span className='font-medium'>{row.original._count.clientes}</span>
        );
      },
    },
  );

  if (!modoSelecao) {
    baseCols.push({
      id: 'acoes',
      header: () => {
        return <span className='sr-only'>Ações</span>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-1'>
            <ClienteTabela
              baseDadosId={row.original.id}
              estrutura={row.original.estrutura}
            />
            <BaseDadosAtualiza id={row.original.id} />
            <DialogDeleta
              id={row.original.id}
              path='basesDados'
              nome={row.original.nome}
              objeto={'Base de dados'}
              mensagens={{
                naoEncontrado: `A base de dados "${row.original.nome}" não foi encontrado.`,
                sucesso: `A base de dados "${row.original.nome}" foi excluído com sucesso.`,
                confirmacao: (
                  <p>
                    Tem certeza que deseja excluir a base de dados{' '}
                    <strong>{row.original.nome}</strong>?
                  </p>
                ),
              }}
            />
          </div>
        );
      },
    });
  }
  return baseCols;
};
