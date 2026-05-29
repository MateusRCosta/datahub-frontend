'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ViewExecutaLinha } from '../../schema/view.schema';

type ConstroiViewColunasParams = {
  colunasVisiveis: string[];
  colunasDisponiveis: string[];
};

const formataCabecalho = (coluna: string) => coluna.replaceAll('_', ' ');

export function constroiViewColunas({
  colunasVisiveis,
  colunasDisponiveis,
}: ConstroiViewColunasParams): ColumnDef<ViewExecutaLinha>[] {
  const visiveis = new Set(colunasVisiveis.map((c) => c.toLowerCase().trim()));

  return colunasDisponiveis
    .filter((coluna) => visiveis.has(coluna.toLowerCase().trim()))
    .map((coluna) => ({
      accessorKey: coluna,
      header: () => (
        <span className='font-semibold'>{formataCabecalho(coluna)}</span>
      ),
      cell: ({ getValue }) => {
        const valor = getValue();

        if (valor == null || valor === '') {
          return (
            <span className='text-muted-foreground truncate'>(sem valor)</span>
          );
        }

        return <span className='block max-w-48 truncate'>{String(valor)}</span>;
      },
    }));
}
