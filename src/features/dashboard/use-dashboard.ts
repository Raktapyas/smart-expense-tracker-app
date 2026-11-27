import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/client';
import type { DashboardData } from '@/api/types';

export const dashboardKey = ['dashboard'] as const;

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKey,
    queryFn: async () => (await api<{ data: DashboardData }>('/dashboard')).data,
  });
}