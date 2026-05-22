import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { UsuarioResponse } from '../schema';
import { useAuth } from '@/features/auth/provider/auth-provider';

const retornaUsuario = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<UsuarioResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaUsuario({
  id,
  enabled,
}: { id: number } & { enabled: boolean }) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('usuarios');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaUsuario({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
