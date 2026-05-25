import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { IntegracaoApiResponse } from '../schema/integracao.schema';

const retornaIntegracao = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<IntegracaoApiResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaIntegracao({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('integracoes');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaIntegracao({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
