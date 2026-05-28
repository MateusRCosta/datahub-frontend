import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ViewApiResponse } from '../schema/view.schema';

const retornaView = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<ViewApiResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaView({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('views');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaView({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
