import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { BaseDadosApiResponse } from '../schema/base-dados.schema';

const retornaBaseDados = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<BaseDadosApiResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaBaseDados({
  id,
  enabled,
}: { id: number } & { enabled: boolean }) {
  const { resolvePath, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePath('bases');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaBaseDados({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
