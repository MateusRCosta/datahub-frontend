import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';

const ativarIntegracao = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}/ativar`,
    method: 'PATCH',
    headers: 'none',
  });
};

export default function useIntegracaoAtivar(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('integracoes');

  return useMutation<ApiResponse<string>, Error, void>({
    mutationKey: ['integracao-ativar', id],
    mutationFn: () => ativarIntegracao({ id, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204 && response.status !== 200) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
