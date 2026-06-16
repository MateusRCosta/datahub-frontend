'use client';

import { useMemo, useState } from 'react';
import { DataTable } from '@/components/layout/tabela';
import { PaginationApiRequest } from '@/types/api.schema';
import useRetornaClientes from '../api/use-retorna-clientes';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { DialogTrigger } from '@/components/ui/dialog';
import { Users2 } from 'lucide-react';
import { constroiClienteColunas } from './colunas';
import { Estrutura } from '../../schema/base-dados.schema';
import SeletorColunas from '@/components/layout/seletor-colunas';

interface ClienteTabelaProps {
  baseDadosId: number;
  estrutura: Estrutura;
}

export function ClienteTabela({ baseDadosId, estrutura }: ClienteTabelaProps) {
  const [open, setOpen] = useState(false);
  const [colunasVisiveis, setColunasVisiveis] = useState<string[]>(
    () =>
      estrutura?.slice(0, 3).map((est) => est.cabecalho.toLowerCase().trim()) ??
      [],
  );

  const [pagination, setPagination] = useState<PaginationApiRequest<string>>({
    page: 1,
    limit: 25,
    orderBy: 'id',
    order: 'asc',
  });

  const { data, isPending } = useRetornaClientes({
    enabled: open,
    pagination,
    baseDadosId,
  });

  const camposMetadados = useMemo(() => {
    return estrutura?.map((est) => ({
      key: est.cabecalho,
      label: est.rotulo ?? est.cabecalho.replaceAll('_', ' '),
    }));
  }, [estrutura]);

  const chavesColunasDisponiveis = useMemo(
    () =>
      (camposMetadados ?? []).map((coluna) => coluna.key.toLowerCase().trim()),
    [camposMetadados],
  );

  const colunasVisivelsFiltradas = useMemo(() => {
    const chavesValidas = new Set(chavesColunasDisponiveis);
    const validas = colunasVisiveis.filter((col) => chavesValidas.has(col));
    return validas.length > 0 ? validas : chavesColunasDisponiveis.slice(0, 3);
  }, [colunasVisiveis, chavesColunasDisponiveis]);

  const colunas = constroiClienteColunas({
    colunasVisiveis: colunasVisivelsFiltradas,
    estrutura,
  });

  return (
    <DialogCustom
      titulo={`Editar clientes`}
      descricao={<p className='w-full'>Tabela de clientes</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <DialogTrigger asChild>
          <Users2 className='mr-2 h-4 cursor-pointer hover:text-primary transition-colors' />
        </DialogTrigger>
      }
      isPending={isPending}
      temFooter={false}
    >
      <div className='flex flex-col h-full w-full flex-1 min-h-0 mx-auto gap-2'>
        <div className='shrink-0 self-end'>
          <SeletorColunas
            colunas={camposMetadados ?? []}
            colunasSelecionadas={colunasVisivelsFiltradas}
            onChange={setColunasVisiveis}
          />
        </div>
        <div className='flex-1 min-h-0 w-full'>
          <DataTable
            columns={colunas}
            data={data?.data?.data || []}
            limit={pagination.limit}
            page={pagination.page}
            pageCount={data?.data?.meta.totalPages || 0}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onPageLimitChange={(limit, page) =>
              setPagination((currentPagination) => ({
                ...currentPagination,
                limit,
                page,
              }))
            }
            totalItens={data?.data?.meta.total || 0}
          />
        </div>
      </div>
    </DialogCustom>
  );
}
