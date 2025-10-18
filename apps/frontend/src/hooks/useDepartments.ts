import { useQuery } from '@tanstack/react-query';
import { listDepartments } from '../api/met';
import type { Department } from '../types/api';

interface UseDepartmentsResult {
  departments: Department[];
  isLoading: boolean;
  error: Error | null;
}

export const useDepartments = (): UseDepartmentsResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: ({ signal }) => listDepartments(signal),
    staleTime: Infinity,
    select: response => response.departments ?? []
  });

  return {
    departments: data ?? [],
    isLoading,
    error: error ?? null
  };
};
