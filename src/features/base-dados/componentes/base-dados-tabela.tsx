'use client';

import { useState } from 'react';
import { getColunas } from './colunas';
import { DataTable } from '@/components/layout/tabela';
import { PaginationApiRequest } from '@/types/api.schema';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import { useFiltros } from '@/hooks/use-filtros';
import useRetornaBasesDados from '../api/use-retorna-bases-dados';
import {
  baseDadosFiltroSimplesChavesObjeto,
  baseDadosFiltroSimplesChavesOptions,
  baseDadosFiltrosSchema,
} from '../schema/base-dados.schema';
import { BaseDadosCria } from './base-dados-cria';
import { BaseDadosFiltro } from './base-dados-filtro';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import {
  BaseDadosTabelaRow,
  BasesDadosCampanhaApiResponse,
} from '../schema/base-dados.schema';

interface BaseDadosTabelaProps {
  campos?: boolean;
  modoSelecao?: boolean;
  onSelecionar?: (baseDados: BaseDadosTabelaRow) => void;
}

export function BaseDadosTabela({
  campos = false,
  modoSelecao = false,
  onSelecionar,
}: BaseDadosTabelaProps) {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 25,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(baseDadosFiltrosSchema);
  const { data, isLoading } = useRetornaBasesDados({
    enabled: true,
    pagination,
    campos,
    filtro: {
      ...filtros,
    },
  });

  if (isLoading && !data) {
    return <SkeletonTabela />;
  }

  const registros = data?.data?.data as
    | BasesDadosCampanhaApiResponse[]
    | undefined;

  const colunas = getColunas<BasesDadosCampanhaApiResponse>({
    modoSelecao,
    onSelecionar,
  });

  return (
    <div className='flex flex-col w-full flex-1 min-h-0 h-full mx-auto gap-2'>
      <div
        className='flex flex-col md:flex-row gap-2 shrink-0 self-end'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {!modoSelecao && (
          <BaseDadosCria pagination={pagination} filtros={filtros} />
        )}
        {
          <Filtro
            childrenComplexo={
              <BaseDadosFiltro filtros={filtros} setFiltros={setFiltros} />
            }
            childrenSimples={
              <FiltroSimplesGenerico
                chavesOpcoes={baseDadosFiltroSimplesChavesOptions}
                opcoesLabels={baseDadosFiltroSimplesChavesObjeto}
                filtros={filtros}
                setFiltros={setFiltros}
              />
            }
          />
        }
      </div>
      <div className='flex-1 min-h-0 w-full'>
        <DataTable
          columns={colunas}
          data={registros || []}
          limit={pagination.limit}
          page={pagination.page}
          pageCount={data?.data?.meta?.totalPages || 0}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onPageLimitChange={(limit, page) =>
            setPagination((currentPagination) => ({
              ...currentPagination,
              limit,
              page,
            }))
          }
          totalItens={data?.data?.meta.total || 0}
          onSelecionar={onSelecionar}
        />
      </div>
    </div>
  );
}
