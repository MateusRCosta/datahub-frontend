import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  IntegracaoFiltros,
  IntegracoesApiResponse,
} from '../schema/integracao.schema';

const retornaIntegracoes = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: IntegracaoFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<IntegracoesApiResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaIntegracoes({
  enabled,
  pagination,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: IntegracaoFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('integracoes');

  return useQuery({
    queryKey: [baseUrl, pagination, filtro],
    queryFn: () => retornaIntegracoes({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
