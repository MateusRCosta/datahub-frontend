import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { BaseDadosEdicao } from '../schema/base-dados.schema';

const editaBaseDados = async ({
  id,
  baseUrl,
  ...data
}: BaseDadosEdicao & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaBaseDados(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('basesDados');

  return useMutation<
    ApiResponse<string>,
    Error,
    BaseDadosEdicao & { id: number }
  >({
    mutationKey: [`usuario-edita`, id],
    mutationFn: (variables) => editaBaseDados({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
