import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { UsuarioFiltros, UsuariosResponse } from '../schema';
import { useAuth } from '@/features/auth/provider/auth-provider';

const retornaUsuarios = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: UsuarioFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<UsuariosResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaUsuarios({
  enabled,
  pagination,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: UsuarioFiltros;
}) {
  const { resolvePath, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePath('usuarios');
  console.log('Base URL:', baseUrl);
  console.log('Filtros:', filtro);
  return useQuery({
    queryKey: ['usuarios', baseUrl, pagination, filtro],
    queryFn: () => retornaUsuarios({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
