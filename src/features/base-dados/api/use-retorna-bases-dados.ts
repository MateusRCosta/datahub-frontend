import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  BaseDadosFiltros,
  BasesDadosApiResponse,
} from '../schema/base-dados.schema';

const retornaBasesDados = async ({
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
  return apiRequest<PaginationApiResponse<BasesDadosApiResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaBasesDados({
  enabled,
  pagination,
  path,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  path?: 'campanhas' | 'views';
  filtro?: BaseDadosFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('basesDados');
  const baseUrlFinal =
    path === 'campanhas'
      ? `${baseUrl}/campanhas`
      : baseUrl;
  return useQuery({
    queryKey: [baseUrlFinal, pagination, filtro],
    queryFn: () => retornaBasesDados({ ...pagination, filtro, baseUrl: baseUrlFinal }),
    enabled: enabled && !authLoading,
  });
}
