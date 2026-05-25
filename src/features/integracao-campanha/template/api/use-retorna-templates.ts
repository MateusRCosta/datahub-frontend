import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  TemplateFiltros,
  TemplatesApiResponse,
} from '../schema/template.schema';

const retornaTemplates = async ({
  page,
  limit,
  orderBy,
  order,
  filtro,
  baseUrl,
}: PaginationApiRequest<string> & {
  filtro?: TemplateFiltros;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<TemplatesApiResponse[]>>({
    path: baseUrl,
    method: 'GET',
    query: { page, limit, orderBy, order, ...filtro },
  });
};

export default function useRetornaTemplates({
  enabled,
  pagination,
  filtro,
}: {
  enabled: boolean;
  pagination: PaginationApiRequest<string>;
  filtro?: TemplateFiltros;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('templates');

  return useQuery({
    queryKey: [baseUrl, pagination, filtro],
    queryFn: () => retornaTemplates({ ...pagination, filtro, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
