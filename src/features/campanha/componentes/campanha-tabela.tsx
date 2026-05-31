'use client';

import { useState } from 'react';
import { DataTable } from '@/components/layout/tabela';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import { useFiltros } from '@/hooks/use-filtros';
import { PaginationApiRequest } from '@/types/api.schema';
import useRetornaCampanhas from '../api/use-retorna-campanhas';
import {
  campanhaFiltroSimplesChavesObjeto,
  campanhaFiltroSimplesChavesOptions,
  campanhaFiltrosSchema,
} from '../schema/campanha.schema';
import { CampanhaCria } from './campanha-cria';
import { CampanhaFiltro } from './campanha-filtro';
import { colunas } from './colunas';

export function CampanhaTabela() {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(campanhaFiltrosSchema);
  const { data, isLoading } = useRetornaCampanhas({
    enabled: true,
    pagination,
    filtro: {
      ...filtros,
    },
  });

  if (isLoading) {
    return <SkeletonTabela />;
  }

  const registros = data?.data?.data;

  return (
    <div className='flex flex-col w-full flex-1 min-h-0 mx-auto gap-2'>
      <div
        className='flex flex-col md:flex-row gap-2 shrink-0 self-end'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <CampanhaCria pagination={pagination} filtros={filtros} />
        <Filtro
          childrenComplexo={
            <CampanhaFiltro filtros={filtros} setFiltros={setFiltros} />
          }
          childrenSimples={
            <FiltroSimplesGenerico
              chavesOpcoes={campanhaFiltroSimplesChavesOptions}
              opcoesLabels={campanhaFiltroSimplesChavesObjeto}
              filtros={filtros}
              setFiltros={setFiltros}
            />
          }
        />
      </div>
      <div className='flex-1 min-h-0 w-full'>
        <DataTable
          columns={colunas}
          data={registros || []}
          limit={pagination.limit}
          page={pagination.page}
          pageCount={data?.data?.meta?.totalPages || 0}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onPageLimitChange={(limit) => setPagination({ ...pagination, limit })}
          totalItens={data?.data?.meta.total || 0}
        />
      </div>
    </div>
  );
}
