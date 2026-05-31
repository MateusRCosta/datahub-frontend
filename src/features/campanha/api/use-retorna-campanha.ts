import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { CampanhaResponse } from '../schema/campanha.schema';

const retornaCampanha = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<CampanhaResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaCampanha({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('campanhas');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaCampanha({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
