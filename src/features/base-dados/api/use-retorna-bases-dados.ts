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
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: BaseDadosFiltros;
}) {
  const { resolvePath, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePath('bases');
  console.log('Base URL:', baseUrl);
  console.log('Filtros:', filtro);
  return useQuery({
    queryKey: [baseUrl, pagination, filtro],
    queryFn: () => retornaBasesDados({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
