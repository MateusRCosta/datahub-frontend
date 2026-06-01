import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ViewFiltros, ViewsApiResponse } from '../schema/view.schema';

const retornaViews = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: ViewFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<ViewsApiResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaViews({
  enabled,
  pagination,
  path,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  path?:'campanhas',
  filtro?: ViewFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('views');
  const baseUrlFinal = path ? `${baseUrl}/${path}` : baseUrl 
  return useQuery({
    queryKey: [baseUrlFinal, pagination, filtro],
    queryFn: () => retornaViews({ ...pagination, filtro, baseUrl: baseUrlFinal }),
    enabled: enabled && !authLoading,
  });
}
