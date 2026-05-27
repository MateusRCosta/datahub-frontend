import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  ViewCampanhaFiltros,
  ViewsApiResponse,
} from '../schema/view.schema';

const retornaViews = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: ViewCampanhaFiltros;
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
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: ViewCampanhaFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('views');

  return useQuery({
    queryKey: [baseUrl, pagination, filtro],
    queryFn: () => retornaViews({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
