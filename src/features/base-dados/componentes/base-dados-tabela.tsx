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

export function BaseDadosTabela() {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(baseDadosFiltrosSchema);
  const { data } = useRetornaBasesDados({
    enabled: true,
    pagination,
    filtro: {
      ...filtros,
    },
  });
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
        <BaseDadosCria pagination={pagination} filtros={filtros} />
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
      <div className="flex-1 min-h-0 w-full">
        <DataTable
          columns={colunas}
          data={registros || []}
          limit={pagination.limit}
          page={pagination.page}
          pageCount={data?.data?.meta?.totalPage || 0}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onPageLimitChange={(limit) => setPagination({ ...pagination, limit })}
          totalItens={data?.data?.meta.total || 0}
        />
      </div>
    </div>
  );
}
