import { useInfiniteQuery } from '@tanstack/react-query';
import { searchArtworks, type SearchParams } from '../api/met';
import type { ArtworkDetail, SearchResponse } from '../types/api';

interface UseArtSearchState {
  items: ArtworkDetail[];
  total: number;
  totalPages: number;
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  refetch: () => Promise<unknown>;
}

const buildQueryKey = (params: SearchParams) => {
  return [
    'search',
    params.q,
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

  const query = useInfiniteQuery<SearchResponse, Error>({
    queryKey: mergedParams ? buildQueryKey(mergedParams) : ['search', 'empty'],
    queryFn: ({ pageParam = 1, signal }) => {
      if (!mergedParams) {
        return Promise.resolve(emptySearchResponse);
      }

      return searchArtworks(
        {
          ...mergedParams,
          page: pageParam as number
        },
        signal
      );
    },
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: Boolean(mergedParams)
  });

  const pages = query.data?.pages ?? [];
  const items = pages.flatMap(page => page.objects);
  const total = pages[0]?.total ?? 0;
  const totalPages = pages[0]?.totalPages ?? 0;

  return {
    items,
    total,
    totalPages,
    isInitialLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.error ?? null,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch
  };
};
