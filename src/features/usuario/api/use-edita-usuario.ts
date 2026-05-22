import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { UsuarioUpdateRequest } from '../schema';
import { useAuth } from '@/features/auth/provider/auth-provider';

const editaUsuario = async ({
  id,
  baseUrl,
  ...data
}: UsuarioUpdateRequest & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaUsuario(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('usuarios');

  return useMutation<
    ApiResponse<string>,
    Error,
    UsuarioUpdateRequest & { id: number }
  >({
    mutationKey: [`usuario-edita`, id],
    mutationFn: (variables) => editaUsuario({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
