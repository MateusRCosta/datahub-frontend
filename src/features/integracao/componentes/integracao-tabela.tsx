'use client';

import { useState } from 'react';
import { DataTable } from '@/components/layout/tabela';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import { useFiltros } from '@/hooks/use-filtros';
import { PaginationApiRequest } from '@/types/api.schema';
import useRetornaIntegracoes from '../api/use-retorna-integracoes';
import {
  integracaoFiltroSimplesChavesObjeto,
  integracaoFiltroSimplesChavesOptions,
  integracaoFiltrosSchema,
} from '../schema/integracao.schema';
import { getColunas } from './colunas';
import { IntegracaoCria } from './integracao-cria';
import { IntegracaoFiltro } from './integracao-filtro';

export function IntegracaoTabela() {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(integracaoFiltrosSchema);
  const { data, isLoading } = useRetornaIntegracoes({
    enabled: true,
    pagination,
    filtro: { ...filtros },
  });

  if (isLoading) {
    return <SkeletonTabela />;
  }

  const registros = data?.data?.data;
  const colunas = getColunas();

  return (
    <div className="flex flex-col w-full flex-1 min-h-0 mx-auto gap-2">
      <div
        className="flex flex-col md:flex-row gap-2 shrink-0 self-end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IntegracaoCria pagination={pagination} filtros={filtros} />
        <Filtro
          childrenComplexo={
            <IntegracaoFiltro filtros={filtros} setFiltros={setFiltros} />
          }
          childrenSimples={
            <FiltroSimplesGenerico
              chavesOpcoes={integracaoFiltroSimplesChavesOptions}
              opcoesLabels={integracaoFiltroSimplesChavesObjeto}
              filtros={filtros}
              setFiltros={setFiltros}
            />
          }
        />
      </div>
      <div className="flex-1 min-h-0 w-full">
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
