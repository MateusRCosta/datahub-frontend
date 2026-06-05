'use client';

import { useQueries } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import {
  BaseDadosFiltros,
  BasesDadosCampanhaApiResponse,
} from '../schema/base-dados.schema';

const retornaBasesDadosCampos = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: BaseDadosFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<BasesDadosCampanhaApiResponse[]>>({
    path: `${baseUrl}/campos`,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaBasesDadosCampos({
  enabled,
  pagination,
  ids,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  ids: number[];
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('basesDados');

  return useQueries({
    queries: ids.map((id) => ({
      queryKey: [baseUrl, 'campos', id, pagination],
      queryFn: () =>
        retornaBasesDadosCampos({
          ...pagination,
          baseUrl,
          filtro: { id: String(id) },
        }),
      enabled: enabled && !authLoading,
    })),
  });
}
