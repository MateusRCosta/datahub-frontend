import { useMutation } from '@tanstack/react-query';
import { ApiResponse, PaginationApiRequest } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  BaseDadosCriacao,
  BaseDadosFiltros,
} from '../schema/base-dados.schema';
import { env } from '@/lib/env';

const criaBaseDados = async ({
  baseUrl,
  ...data
}: BaseDadosCriacao & { baseUrl: string }): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('nome', data.nome);
  formData.append('arquivo', data.arquivo);
  formData.append('estrutura', JSON.stringify(data.estrutura));

  const response = await fetch(`${env.BACKEND_URL}/${baseUrl}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const text = await response.text();
  const responseData: string = text ? JSON.parse(text) : '';

  return { data: responseData, status: response.status };
};

export default function useCriaBaseDados({
  filtros,
  pagination,
}: {
  filtros?: BaseDadosFiltros;
  pagination: PaginationApiRequest<string>;
}) {
  const queryClient = getQueryClient();
  const { resolvePath } = useAuth();
  const baseUrl = resolvePath('bases');

  return useMutation<ApiResponse<string>, Error, BaseDadosCriacao>({
    mutationKey: [`usuario-create`],
    mutationFn: (variables) => criaBaseDados({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 201) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
