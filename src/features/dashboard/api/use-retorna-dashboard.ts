import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-request';
import type { DashboardResponse } from '../types';

export default function useRetornaDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      apiRequest<DashboardResponse>({ path: 'dashboard', method: 'GET' }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
