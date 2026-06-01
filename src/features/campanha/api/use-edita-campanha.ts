import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse, ApiResponseError } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { CampanhaFormulario } from '../schema/campanha-form.schema';

const editaCampanha = async ({
  id,
  baseUrl,
  ...data
}: CampanhaFormulario & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaCampanha(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('campanhas');

  return useMutation<
    ApiResponse<string>,
    ApiResponseError,
    CampanhaFormulario & { id: number }
  >({
    mutationKey: ['campanha-edita', id],
    mutationFn: (variables) => editaCampanha({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
