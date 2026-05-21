import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ClienteEdicao } from '../schema/cliente.schema';

const editaCliente = async ({
  id,
  baseUrl,
  ...data
}: ClienteEdicao & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaCliente(id: number) {
  const queryClient = getQueryClient();
  const { resolvePath } = useAuth();
  const baseUrl = resolvePath('clientes');

  return useMutation<
    ApiResponse<string>,
    Error,
    ClienteEdicao & { id: number }
  >({
    mutationKey: [`cliente-edita`, id],
    mutationFn: (variables) => editaCliente({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
