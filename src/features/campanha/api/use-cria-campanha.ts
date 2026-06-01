import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  ApiResponse,
  ApiResponseError,
  PaginationApiRequest,
} from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { CampanhaFiltros } from '../schema/campanha.schema';
import { CampanhaFormulario } from '../schema/campanha-form.schema';

const criaCampanha = async ({
  baseUrl,
  ...data
}: CampanhaFormulario & { baseUrl: string }): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: baseUrl,
    method: 'POST',
    body: data,
  });
};

export default function useCriaCampanha({
  filtros,
  pagination,
}: {
  filtros?: CampanhaFiltros;
  pagination: PaginationApiRequest<string>;
}) {
  void filtros;
  void pagination;

  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('campanhas');

  return useMutation<ApiResponse<string>, ApiResponseError, CampanhaFormulario>(
    {
      mutationKey: ['campanha-criacao'],
      mutationFn: (variables) => criaCampanha({ ...variables, baseUrl }),
      onSuccess: (response) => {
        if (response.status !== 201) return;
        queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
      },
    },
  );
}
