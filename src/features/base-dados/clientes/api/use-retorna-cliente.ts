import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ClienteResponse } from '../schema/cliente.schema';

const retornaCliente = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<ClienteResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaCliente({
  id,
  enabled,
}: { id: number } & { enabled: boolean }) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('clientes');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaCliente({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
