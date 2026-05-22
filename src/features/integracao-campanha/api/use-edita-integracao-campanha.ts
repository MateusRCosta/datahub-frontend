import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { IntegracaoCampanhaEdicao } from '../schema/integracao-campanha.schema';

const editaIntegracaoCampanha = async ({
  id,
  baseUrl,
  ...data
}: IntegracaoCampanhaEdicao & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaIntegracaoCampanha(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('integracoesCampanha');

  return useMutation<
    ApiResponse<string>,
    Error,
    IntegracaoCampanhaEdicao & { id: number }
  >({
    mutationKey: [`integracao-campanha-edita`, id],
    mutationFn: (variables) =>
      editaIntegracaoCampanha({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
