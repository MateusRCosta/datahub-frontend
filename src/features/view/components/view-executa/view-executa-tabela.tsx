'use client';

import { useMemo, useState } from 'react';
import { DataTable } from '@/components/layout/tabela';
import { PaginationApiRequest } from '@/types/api.schema';
import SeletorColunas from '@/components/layout/seletor-colunas';
import useExecutaView from '../../api/use-executa-view';
import { constroiViewColunas } from './colunas';
import { SkeletonTabela } from '@/components/layout/skeleton-tabela';
import { mapViewError } from './view-executa-errors.constant';

type ViewExecutaTabelaProps = {
  viewId: number;
};

export function ViewExecutaTabela({ viewId }: ViewExecutaTabelaProps) {
  const [colunasVisiveis, setColunasVisiveis] = useState<string[]>([]);
  const [pagination, setPagination] = useState<
    Pick<PaginationApiRequest<string>, 'page' | 'limit'>
  >({
    page: 1,
    limit: 20,
  });

  const { data, isPending, isError, error } = useExecutaView({
    enabled: true,
    id: viewId,
    pagination,
  });

  const linhas = useMemo(() => data?.data?.data ?? [], [data]);

  const colunasDisponiveis = useMemo(() => {
    const chaves = new Set<string>();

    linhas.forEach((linha) => {
      Object.keys(linha).forEach((chave) => chaves.add(chave));
    });

    return Array.from(chaves);
  }, [linhas]);

  const camposMetadados = useMemo(
    () =>
      colunasDisponiveis.map((coluna) => ({
        key: coluna,
        label: coluna.replaceAll('_', ' '),
      })),
    [colunasDisponiveis],
  );

  const chavesColunasDisponiveis = useMemo(
    () => colunasDisponiveis.map((coluna) => coluna.toLowerCase().trim()),
    [colunasDisponiveis],
  );

  const colunasSelecionadas = useMemo(() => {
    const chavesValidas = new Set(chavesColunasDisponiveis);
    const colunasValidas = colunasVisiveis.filter((coluna) =>
      chavesValidas.has(coluna.toLowerCase().trim()),
    );

    return colunasValidas.length > 0
      ? colunasValidas
      : chavesColunasDisponiveis.slice(0, 5);
  }, [chavesColunasDisponiveis, colunasVisiveis]);

  const colunas = useMemo(
    () =>
      constroiViewColunas({
        colunasVisiveis: colunasSelecionadas,
        colunasDisponiveis,
      }),
    [colunasDisponiveis, colunasSelecionadas],
  );

  return (
    <div className='flex flex-col h-full w-full gap-2'>
      <div className='flex shrink-0 items-center justify-between gap-2'>
        <h2 className='text-sm font-semibold'>Resultado da visualização</h2>
        {!isError && (
          <SeletorColunas
            colunas={camposMetadados}
            colunasSelecionadas={colunasSelecionadas}
            onChange={setColunasVisiveis}
          />
        )}
      </div>
      <div className='flex-1 min-h-0 w-full'>
        {isError && <p>Erro ao carregar visualização: {mapViewError(error)}</p>}
        {isPending && <SkeletonTabela />}
        {!isError && !isPending && data?.data?.data && (
          <DataTable
            columns={colunas}
            data={linhas}
            limit={pagination.limit}
            page={pagination.page}
            pageCount={data.data.meta.totalPages || 0}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onPageLimitChange={(limit) => setPagination({ page: 1, limit })}
            totalItens={data.data.meta.total || 0}
          />
        )}
      </div>
    </div>
  );
}
