import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse, PaginationApiRequest } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  IntegracaoCriacao,
  IntegracaoFiltros,
} from '../schema/integracao.schema';

const criaIntegracao = async ({
  baseUrl,
  ...data
}: IntegracaoCriacao & { baseUrl: string }): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: baseUrl,
    method: 'POST',
    body: data,
  });
};

export default function useCriaIntegracao({
  filtros,
  pagination,
}: {
  filtros?: IntegracaoFiltros;
  pagination: PaginationApiRequest<string>;
}) {
  void filtros;
  void pagination;

  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('integracoes');

  return useMutation<ApiResponse<string>, Error, IntegracaoCriacao>({
    mutationKey: ['integracao-criacao'],
    mutationFn: (variables) => criaIntegracao({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 201) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
