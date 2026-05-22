import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { IntegracaoCampanhaApiResponse } from '../schema/integracao-campanha.schema';

const retornaIntegracaoCampanha = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<IntegracaoCampanhaApiResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaIntegracaoCampanha({
  id,
  enabled,
}: { id: number } & { enabled: boolean }) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('integracoesCampanha');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaIntegracaoCampanha({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
