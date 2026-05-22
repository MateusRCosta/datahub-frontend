'use client';

import { useState } from 'react';
import { getColunas } from './colunas';
import { DataTable } from '@/components/layout/tabela';
import { PaginationApiRequest } from '@/types/api.schema';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import { useFiltros } from '@/hooks/use-filtros';
import useRetornaIntegracoesCampanhas from '../api/use-retorna-integracoes-campanhas';
import { IntegracaoCampanhaFiltro } from './integracao-campanha-filtro';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import {
  integracaoCampanhaFiltroSimplesChavesObjeto,
  integracaoCampanhaFiltroSimplesChavesOptions,
  integracaoCampanhaFiltrosSchema,
} from '../schema/integracao-campanha.schema';
import { IntegracaoCampanhaCria } from './integracao-campanha-cria';

export function IntegracaoCampanhaTabela() {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(integracaoCampanhaFiltrosSchema);
  const { data, isLoading } = useRetornaIntegracoesCampanhas({
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

  const colunas = getColunas({ modoSelecao: false });

  return (
    <div className="flex flex-col w-full flex-1 min-h-0 mx-auto gap-2">
      <div
        className="flex flex-col md:flex-row gap-2 shrink-0 self-end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IntegracaoCampanhaCria pagination={pagination} filtros={filtros} />
        {
          <Filtro
            childrenComplexo={
              <IntegracaoCampanhaFiltro
                filtros={filtros}
                setFiltros={setFiltros}
              />
            }
            childrenSimples={
              <FiltroSimplesGenerico
                chavesOpcoes={integracaoCampanhaFiltroSimplesChavesOptions}
                opcoesLabels={integracaoCampanhaFiltroSimplesChavesObjeto}
                filtros={filtros}
                setFiltros={setFiltros}
              />
            }
          />
        }
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
