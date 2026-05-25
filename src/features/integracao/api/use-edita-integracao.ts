import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { IntegracaoEdicao } from '../schema/integracao.schema';

const editaIntegracao = async ({
  id,
  baseUrl,
  ...data
}: IntegracaoEdicao & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaIntegracao(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('integracoes');

  return useMutation<
    ApiResponse<string>,
    Error,
    IntegracaoEdicao & { id: number }
  >({
    mutationKey: ['integracao-edita', id],
    mutationFn: (variables) => editaIntegracao({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
