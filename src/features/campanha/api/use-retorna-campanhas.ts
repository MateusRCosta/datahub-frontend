import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { CampanhaFiltros, CampanhasResponse } from '../schema/campanha.schema';

const retornaCampanhas = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: CampanhaFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<CampanhasResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaCampanhas({
  enabled,
  pagination,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: CampanhaFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('campanhas');

  return useQuery({
    queryKey: [baseUrl, pagination, filtro],
    queryFn: () => retornaCampanhas({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
