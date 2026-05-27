import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ViewCampanhaCriacao } from '../schema/view.schema';

const criaView = async ({
  baseUrl,
  ...data
}: ViewCampanhaCriacao & { baseUrl: string }): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: baseUrl,
    method: 'POST',
    body: data,
  });
};

export default function useCriaView() {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('views');

  return useMutation<ApiResponse<string>, Error, ViewCampanhaCriacao>({
    mutationKey: ['view-criacao'],
    mutationFn: (variables) => criaView({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 201) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
