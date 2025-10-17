import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchArtworks, type SearchParams } from '../api/met';
import type { SearchResponse } from '../types/api';

interface UseArtSearchState {
  data: SearchResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const buildQueryKey = (params: SearchParams) => {
  return [
    'search',
    params.q,
    params.page,
    params.perPage,
    params.hasImages,
    params.departmentId ?? null,
    params.artistOrCulture ?? null
  ] as const;
};

const createSearchParams = (
  params?: Partial<SearchParams>
): SearchParams | null => {
  if (!params?.q?.trim()) {
    return null;
  }

  return {
    q: params.q.trim(),
    page: params.page ?? 1,
    perPage: params.perPage ?? 15,
    hasImages: params.hasImages ?? true,
    departmentId: params.departmentId,
    artistOrCulture: params.artistOrCulture
  };
};

const emptySearchResponse: SearchResponse = {
  page: 1,
  perPage: 0,
  total: 0,
  totalPages: 0,
  objectIDs: [],
  objects: []
};

export const useArtSearch = (
  params?: Partial<SearchParams>
): UseArtSearchState => {
  const mergedParams = createSearchParams(params);

  const query = useQuery<SearchResponse, Error>({
    queryKey: mergedParams ? buildQueryKey(mergedParams) : ['search', 'empty'],
    queryFn: ({ signal }) => {
      if (!mergedParams) {
        return Promise.resolve(emptySearchResponse);
      }

      return searchArtworks(mergedParams, signal);
    },
    enabled: Boolean(mergedParams),
    placeholderData: mergedParams ? keepPreviousData : undefined
  });

  return {
    data: (query.data as SearchResponse | undefined) ?? null,
    isLoading: query.isLoading,
    error: query.error ?? null,
    refetch: query.refetch
  };
};
