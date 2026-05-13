import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse, PaginationApiRequest } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { UsuarioCreateRequest, UsuarioFiltros } from '../schema';
import { useAuth } from '@/features/auth/provider/auth-provider';

const criaUsuario = async ({
  baseUrl,
  ...data
}: UsuarioCreateRequest & { baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: baseUrl,
    method: 'POST',
    body: data,
  });
};

export default function useCriaUsuario({
  filtros,
  pagination,
}: {
  filtros?: UsuarioFiltros;
  pagination: PaginationApiRequest<string>;
}) {
  const queryClient = getQueryClient();
  const { resolvePath } = useAuth();
  const baseUrl = resolvePath('usuarios');

  return useMutation<ApiResponse<string>, Error, UsuarioCreateRequest>({
    mutationKey: [`usuario-create`],
    mutationFn: (variables) => criaUsuario({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 201) return;
      queryClient.invalidateQueries({ queryKey: [`usuarios`], exact: false });
    },
  });
}
