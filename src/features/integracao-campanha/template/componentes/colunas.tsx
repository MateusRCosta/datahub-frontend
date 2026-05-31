'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import { TableModal } from '@/types/util.schema';
import { TemplatesApiResponse } from '../schema/template.schema';
import { TemplateAtualiza } from './template-atualiza';

export const getColunas = ({
  modoSelecao,
}: TableModal<TemplatesApiResponse>): ColumnDef<TemplatesApiResponse>[] => {
  const baseCols: ColumnDef<TemplatesApiResponse>[] = [];

  baseCols.push(
    {
      accessorKey: 'id',
      header: () => {
        return <div className='sr-only'>Identificador</div>;
      },
      cell: ({ row }) => {
        return <span className='font-medium'>{row.original.id}</span>;
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
              {row.original.integracaoCampanha
                ? `Criado pelo usuário: ${row.original.integracaoCampanha.nome}`
                : ''}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'quantidadeVars',
      header: () => {
        return <div>Quantidade variáveis</div>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.quantidadeVars}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'integracaoCampanha.provedor',
      header: () => {
        return <div>Provedor</div>;
      },
      cell: ({ row }) => {
        return (
          <span className='font-medium'>
            {row.original.integracaoCampanha.provedor.toUpperCase()}
          </span>
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
            <TemplateAtualiza id={row.original.id} />
            <DialogDeleta
              id={row.original.id}
              path='templates'
              nome={row.original.nome}
              objeto='Template'
              mensagens={{
                naoEncontrado: `O template "${row.original.nome}" não foi encontrado.`,
                sucesso: `O template "${row.original.nome}" foi excluído com sucesso.`,
                confirmacao: (
                  <p>
                    Tem certeza que deseja excluir o template{' '}
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
