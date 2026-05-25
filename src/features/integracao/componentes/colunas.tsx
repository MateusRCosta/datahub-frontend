'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import { SwitchStatus } from '@/components/layout/switch-status';
import { IntegracoesApiResponse } from '../schema/integracao.schema';
import { IntegracaoAtualiza } from './integracao-atualiza';

export const getColunas = (): ColumnDef<IntegracoesApiResponse>[] => {
  return [
    {
      accessorKey: 'id',
      header: () => <div className="sr-only">Identificador</div>,
      cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: 'nome',
      header: () => <div>Nome</div>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.nome}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.usuario
              ? `Criado pelo usuário: ${row.original.usuario.nome}`
              : ''}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <div className="flex items-right">
          <SwitchStatus
            status={row.original.status}
            id={row.original.id}
            path="integracoes"
            mensagens={{
              naoEncontrado: `A integração "${row.original.nome}" não foi encontrada.`,
              sucesso: 'Status alterado com sucesso.',
            }}
          />
        </div>
      ),
    },
    {
      id: 'acoes',
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IntegracaoAtualiza id={row.original.id} />
          <DialogDeleta
            id={row.original.id}
            path="integracoes"
            nome={row.original.nome}
            objeto="Integração"
            mensagens={{
              naoEncontrado: `A integração "${row.original.nome}" não foi encontrada.`,
              sucesso: `A integração "${row.original.nome}" foi excluída com sucesso.`,
              confirmacao: (
                <p>
                  Tem certeza que deseja excluir a integração{' '}
                  <strong>{row.original.nome}</strong>?
                </p>
              ),
            }}
          />
        </div>
      ),
    },
  ];
};
