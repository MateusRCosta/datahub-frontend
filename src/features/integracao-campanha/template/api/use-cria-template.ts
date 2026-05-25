import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse, PaginationApiRequest } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { TemplateCriacao, TemplateFiltros } from '../schema/template.schema';

const criaTemplate = async ({
  baseUrl,
  ...data
}: TemplateCriacao & { baseUrl: string }): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: baseUrl,
    method: 'POST',
    body: data,
  });
};

export default function useCriaTemplate({
  filtros,
  pagination,
}: {
  filtros?: TemplateFiltros;
  pagination: PaginationApiRequest<string>;
}) {
  void filtros;
  void pagination;

  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('templates');

  return useMutation<ApiResponse<string>, Error, TemplateCriacao>({
    mutationKey: ['template-criacao'],
    mutationFn: (variables) => criaTemplate({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 201) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
