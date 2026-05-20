'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import { ClientesResponse } from '../schema/cliente.schema';
import { Estrutura } from '../../schema/base-dados.schema';
import { formataData } from '@/lib/utils';

interface ConstroiColunasParams {
  colunasVisiveis: string[];
  estrutura: Estrutura | undefined;
}

export function constroiClienteColunas({
  colunasVisiveis,
  estrutura,
}: ConstroiColunasParams): ColumnDef<ClientesResponse>[] {
  const visiveis = new Set(colunasVisiveis.map(c => c.toLowerCase().trim()));

  const colunaId: ColumnDef<ClientesResponse> = {
    accessorKey: 'id',
    header: () => {
      return <div className="sr-only">Identificador</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.id}</span>
        </div>
      );
    },
  }

  const colunasDinamicas: ColumnDef<ClientesResponse>[] = (estrutura ?? [])
    .filter((est) => visiveis.has(est.cabecalho.toLowerCase().trim()))
    .map((est) => ({
      accessorKey: `dados.${est.cabecalho}`,
      header: () => (
        <span className="font-semibold">
          {est.rotulo ?? est.cabecalho.replaceAll('_', ' ')}
        </span>
      ),
      cell: ({ getValue }) => {
        const valor = getValue();

        if (valor == null) {
          return <span className="text-muted-foreground">(sem valor)</span>;
        }

        return <span>{String(valor)}</span>;
      },
    }));

  const colunaAcoes: ColumnDef<ClientesResponse> = {
    id: 'acoes',
    enableSorting: false,
    enableHiding: false,
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <DialogDeleta
          id={row.original.id}
          path="clientes"
          objeto="Cliente"
          mensagens={{
            naoEncontrado: `O cliente "${row.original.id}" não foi encontrado.`,
            sucesso: `O cliente "${row.original.id}" foi excluído com sucesso.`,
            confirmacao: (
              <p>
                Tem certeza que deseja excluir o cliente{' '}
                <strong>{row.original.id}</strong>?
              </p>
            ),
          }}
        />
      </div>
    ),
  };

  return [colunaId, ...colunasDinamicas, colunaAcoes];
}