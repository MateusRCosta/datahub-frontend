import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { ApiResponse, StatusUpdate } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ResourceName } from '@/features/auth/config/resources';

const alteraStatusAtivo = async ({
  status,
  id,
  baseUrl,
}: StatusUpdate & { path: ResourceName; id: number; baseUrl: string }): Promise<
  ApiResponse<string>
> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}/status`,
    method: 'PATCH',
    body: { status },
  });
};

export default function useAlteraStatusAtivo({
  path,
  id,
}: {
  path: ResourceName;
  id: number;
}) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();

  const baseUrl = resolvePathApi(path as ResourceName);

  return useMutation<
    ApiResponse<string>,
    Error,
    StatusUpdate & { id: number; path: ResourceName }
  >({
    mutationKey: [`alterar-${path}-status`, id],
    mutationFn: (variables) => alteraStatusAtivo({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
