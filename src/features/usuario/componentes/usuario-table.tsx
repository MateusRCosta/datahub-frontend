'use client';

import { useState } from 'react';
import { getColunas } from './colunas';
import { DataTable } from '@/components/layout/tabela';
import { PaginationApiRequest } from '@/types/api.schema';
import { Filtro } from '@/components/layout/filtro';
import { FiltroSimplesGenerico } from '@/components/layout/filtro-simples-input';
import {
  usuarioFiltroSimplesChavesObjeto,
  usuarioFiltroSimplesChavesOptions,
  usuarioFiltrosSchema,
} from '../schema';
import { useFiltros } from '@/hooks/use-filtros';
import useRetornaUsuarios from '../api/use-retorna-usuarios';
import { UsuarioCreate } from './usuario-create';
import { UsuarioFiltro } from './usuario-filtro';

export function UsuariosTable() {
  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    order: 'asc',
  });
  const { filtros, setFiltros } = useFiltros(usuarioFiltrosSchema);
  const { data } = useRetornaUsuarios({
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
        <UsuarioCreate pagination={pagination} filtros={filtros} />
        {
          <Filtro
            childrenComplexo={
              <UsuarioFiltro filtros={filtros} setFiltros={setFiltros} />
            }
            childrenSimples={
              <FiltroSimplesGenerico
                chavesOpcoes={usuarioFiltroSimplesChavesOptions}
                opcoesLabels={usuarioFiltroSimplesChavesObjeto}
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
