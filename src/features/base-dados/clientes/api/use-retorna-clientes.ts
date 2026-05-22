import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ClientesResponse } from '../schema/cliente.schema';

const retornaClientes = async ({
  page,
  limit,
  orderBy,
  order,
  baseUrl,
  baseDadosId,
}: PaginationApiRequest<string> & {
  baseDadosId: number;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<ClientesResponse[]>>({
    path: `${baseUrl}?baseDeDadosId=${baseDadosId}`,
    method: 'GET',
    query: { page, limit, orderBy, order,  },
  });
};

export default function useRetornaClientes({
  enabled,
  pagination,
  baseDadosId
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  baseDadosId: number;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('clientes');
  return useQuery({
    queryKey: [baseUrl, pagination, baseDadosId],
    queryFn: () => retornaClientes({ ...pagination, baseUrl, baseDadosId }),
    enabled: enabled && !authLoading,
  });
}
