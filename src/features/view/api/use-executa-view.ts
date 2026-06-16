import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import {
  ApiResponse,
  ApiResponseError,
  PaginationApiRequest,
  PaginationApiResponse,
} from '@/types/api.schema';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { ViewExecutaLinha } from '../schema/view.schema';

const executaView = async ({
  id,
  page,
  limit,
  baseUrl,
}: Pick<PaginationApiRequest<string>, 'page' | 'limit'> & {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<PaginationApiResponse<ViewExecutaLinha[]>>({
    path: `${baseUrl}/${id}/executa`,
    method: 'GET',
    query: { page, limit },
  });
};

export default function useExecutaView({
  enabled,
  id,
  pagination,
}: {
  enabled: boolean;
  id: number;
  pagination: Pick<PaginationApiRequest<string>, 'page' | 'limit'>;
}) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('views');

  return useQuery<
    ApiResponse<PaginationApiResponse<ViewExecutaLinha[]>>,
    ApiResponseError
  >({
    queryKey: [baseUrl, id, 'executa', pagination.page, pagination.limit],
    queryFn: () => executaView({ ...pagination, id, baseUrl }),
    enabled: enabled && id > 0 && !authLoading,
  });
}
