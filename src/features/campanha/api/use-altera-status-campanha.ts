import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { STATUS_CAMPANHA } from '../types/campanha.types';

const alteraStatusCampanha = async ({
  status,
  id,
  baseUrl,
}: {
  status: STATUS_CAMPANHA;
  id: number;
  baseUrl: string;
}): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}/status`,
    method: 'PATCH',
    body: { status },
  });
};

export default function useAlteraStatusCampanha(id: number) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();
  const baseUrl = resolvePathApi('campanhas');

  return useMutation<
    ApiResponse<string>,
    Error,
    { id: number; status: STATUS_CAMPANHA }
  >({
    mutationKey: ['campanha-status', id],
    mutationFn: (variables) => alteraStatusCampanha({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
