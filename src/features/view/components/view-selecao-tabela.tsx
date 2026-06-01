'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/layout/tabela';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import { useFiltros } from '@/hooks/use-filtros';
import { PaginationApiRequest } from '@/types/api.schema';
import useRetornaViews from '@/features/view/api/use-retorna-views';
import {
  viewFiltroSimplesChavesObjeto,
  viewFiltroSimplesChavesOptions,
  viewFiltrosSchema,
  ViewsApiResponse,
} from '@/features/view/schema/view.schema';

interface ViewSelecaoTabelaProps {
  onSelecionar: (view: ViewsApiResponse) => void;
  path: 'campanhas',
}

const colunas: ColumnDef<ViewsApiResponse>[] = [
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
          {row.original.descricao}
        </span>
      </div>
    ),
  }
];

export function ViewSelecaoTabela({ onSelecionar, path }: ViewSelecaoTabelaProps) {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(viewFiltrosSchema);
  const { data, isLoading } = useRetornaViews({
    enabled: true,
    pagination,
    path,
    filtro: {
      ...filtros,
    },
  });

  if (isLoading) {
    return <SkeletonTabela />;
  }

  return (
    <div className='flex flex-col w-full flex-1 min-h-0 h-full mx-auto gap-2'>
      <div
        className='flex flex-col md:flex-row gap-2 shrink-0 self-end'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Filtro
          childrenComplexo={null}
          childrenSimples={
            <FiltroSimplesGenerico
              chavesOpcoes={viewFiltroSimplesChavesOptions}
              opcoesLabels={viewFiltroSimplesChavesObjeto}
              filtros={filtros}
              setFiltros={setFiltros}
            />
          }
        />
      </div>
      <div className='flex-1 min-h-0 w-full'>
        <DataTable
          columns={colunas}
          data={data?.data?.data || []}
          limit={pagination.limit}
          page={pagination.page}
          pageCount={data?.data?.meta?.totalPages || 0}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onPageLimitChange={(limit) => setPagination({ ...pagination, limit })}
          totalItens={data?.data?.meta.total || 0}
          onSelecionar={onSelecionar}
        />
      </div>
    </div>
  );
}
