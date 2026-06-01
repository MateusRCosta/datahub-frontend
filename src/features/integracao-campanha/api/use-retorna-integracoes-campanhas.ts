import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  IntegracaoCampanhaFiltros,
  IntegracoesCampanhasApiResponse,
} from '../schema/integracao-campanha.schema';

const retornaIntegracoesCampanhas = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: IntegracaoCampanhaFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<IntegracoesCampanhasApiResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useIntegracoesCampanhas({
  enabled,
  pagination,
  filtro,
  path,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: IntegracaoCampanhaFiltros;
  path?: 'templates';
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const integracoesCampanhaPath = resolvePathApi('integracoesCampanhas');
  const baseUrl =
    path === 'templates'
      ? `${integracoesCampanhaPath}/templates`
      : integracoesCampanhaPath;

  return useQuery({
    queryKey: [baseUrl, pagination, filtro],
    queryFn: () =>
      retornaIntegracoesCampanhas({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
