import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import { useAuth } from '@/features/auth/provider/auth-provider';
import { TemplateApiResponse } from '../schema/template.schema';

const retornaTemplate = async ({
  id,
  baseUrl,
}: {
  id: number;
  baseUrl: string;
}) => {
  return apiRequest<TemplateApiResponse>({
    path: `${baseUrl}/${id}`,
    method: 'GET',
  });
};

export default function useRetornaTemplate({
  id,
  enabled,
}: { id: number } & { enabled: boolean }) {
  const { resolvePathApi, isLoading: authLoading } = useAuth();
  const baseUrl = resolvePathApi('templates');

  return useQuery({
    queryKey: [baseUrl, id],
    queryFn: () => retornaTemplate({ id, baseUrl }),
    enabled: enabled && !authLoading,
  });
}
