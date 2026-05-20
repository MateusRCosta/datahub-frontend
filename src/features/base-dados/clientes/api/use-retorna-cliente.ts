import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ClienteResponse } from '../schema/cliente.schema';

const retornaUsuario = async ({
  id,
  baseUrl,
}: {
  id: string;
  baseUrl: string;
}) => {
  return apiRequest<ClienteResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaUsuario({
  id,
  enabled,
}: { id: string } & { enabled: boolean }) {
  const { resolvePath, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePath('usuarios');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaUsuario({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
