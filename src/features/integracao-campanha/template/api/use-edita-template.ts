import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { TemplateEdicao } from '../schema/template.schema';

const editaTemplate = async ({
  id,
  baseUrl,
  ...data
}: TemplateEdicao & { id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'PUT',
    body: data,
  });
};

export default function useEditaTemplate(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('templates');

  return useMutation<
    ApiResponse<string>,
    Error,
    TemplateEdicao & { id: number }
  >({
    mutationKey: ['template-edita', id],
    mutationFn: (variables) => editaTemplate({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
