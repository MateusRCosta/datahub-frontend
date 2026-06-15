import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ViewFiltros, ViewTabelaRow } from '../schema/view.schema';

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
  return apiRequest<PaginationApiResponse<ViewTabelaRow[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaViews({
  enabled,
  pagination,
  campos,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  campos?: boolean;
  filtro?: ViewFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('views');
  const baseUrlFinal = campos ? `${baseUrl}/campos` : baseUrl;
  return useQuery({
    queryKey: [baseUrlFinal, pagination, filtro],
    queryFn: () =>
      retornaViews({ ...pagination, filtro, baseUrl: baseUrlFinal }),
    enabled: enabled && !authLoading,
  });
}
