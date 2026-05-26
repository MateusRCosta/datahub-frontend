'use client';

import { useState } from 'react';
import { DataTable } from '@/components/layout/tabela';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import { useFiltros } from '@/hooks/use-filtros';
import { PaginationApiRequest } from '@/types/api.schema';
import { getColunas } from './colunas';
import { TemplateCria } from './template-cria';
import { TemplateFiltro } from './template-filtro';
import useRetornaTemplates from '../api/use-retorna-templates';
import {
  templateFiltroSimplesChavesObjeto,
  templateFiltroSimplesChavesOptions,
  templateFiltrosSchema,
} from '../schema/template.schema';

export function TemplateTabela() {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(templateFiltrosSchema);
  const { data, isLoading } = useRetornaTemplates({
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
    <div className='flex flex-col w-full flex-1 min-h-0 mx-auto gap-2'>
      <div
        className='flex flex-col md:flex-row gap-2 shrink-0 self-end'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <TemplateCria pagination={pagination} filtros={filtros} />
        <Filtro
          childrenComplexo={
            <TemplateFiltro filtros={filtros} setFiltros={setFiltros} />
          }
          childrenSimples={
            <FiltroSimplesGenerico
              chavesOpcoes={templateFiltroSimplesChavesOptions}
              opcoesLabels={templateFiltroSimplesChavesObjeto}
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
