import { useQuery } from '@tanstack/react-query';

import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';
import { Me } from '../schema/me.schema';

const retornaMe = async (): Promise<ApiResponse<Me>> => {
  return apiRequest<Me>({
    path: 'auth/me',
    method: 'GET',
  });
};

export default function useRetornaMe({ enabled }: { enabled: boolean }) {
  return useQuery<ApiResponse<Me>, Error>({
    queryKey: ['me'],
    queryFn: retornaMe,
    enabled,
    retry: false,
  });
}
