import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse, PaginationApiRequest } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  IntegracaoCampanhaCriacao,
  IntegracaoCampanhaFiltros,
} from '../schema/integracao-campanha.schema';

const criaIntegracaoCampanha = async ({
  baseUrl,
  ...data
}: IntegracaoCampanhaCriacao & { baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: baseUrl,
    method: 'POST',
    body: data,
  });
};

export default function useIntegracaoCampanha({
  filtros,
  pagination,
}: {
  filtros?: IntegracaoCampanhaFiltros;
  pagination: PaginationApiRequest<string>;
}) {
  void filtros;
  void pagination;

  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('integracoesCampanhas');

  return useMutation<ApiResponse<string>, Error, IntegracaoCampanhaCriacao>({
    mutationKey: [`integracao-campanha-criacao`],
    mutationFn: (variables) =>
      criaIntegracaoCampanha({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 201) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
