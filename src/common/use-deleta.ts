import { useMutation } from '@tanstack/react-query';

import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { getQueryClient } from '@/lib/query-client';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ResourceName } from '@/features/auth/config/resources';

const deleta = async ({
  id,
  baseUrl,
}: {
  path: ResourceName;
  id: string | number;
  baseUrl: string;
}): Promise<ApiResponse<string>> => {
  return apiRequest<string>({
    path: `${baseUrl}/${id}`,
    method: 'DELETE',
    headers: 'none',
  });
};

export default function useDeleta({
  path,
  id,
}: {
  path: ResourceName;
  id: string | number;
}) {
  const queryClient = getQueryClient();
  const { resolvePathApi } = useAuth();

  const baseUrl = resolvePathApi(path as ResourceName);

  return useMutation<
    ApiResponse<string>,
    Error,
    { id: string | number; path: ResourceName }
  >({
    mutationKey: [`deleta-${path}`, id],
    mutationFn: (variables) => deleta({ ...variables, baseUrl }),
    onSuccess: (response) => {
      if (response.status !== 204) return;
      queryClient.invalidateQueries({ queryKey: [baseUrl], exact: false });
    },
  });
}
