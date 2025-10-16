import { useEffect, useMemo, useState } from 'react';
import type { SearchResponse } from '../types/api';
import { searchArtworks, type SearchParams } from '../api/met';

interface UseArtSearchState {
  data: SearchResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (override?: Partial<SearchParams>) => void;
}

const defaultParams: SearchParams = {
  q: 'painting',
  page: 1,
  perPage: 15,
  hasImages: true
};

export const useArtSearch = (
  params?: Partial<SearchParams>
): UseArtSearchState => {
  const mergedParams = useMemo(
    () => ({
      ...defaultParams,
      ...params
    }),
    [params]
  );

  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await searchArtworks(
          {
            ...mergedParams
          },
          controller.signal
        );

        if (!isMounted) return;
        setData(response);
        console.log('ERRO', mergedParams, response);
      } catch (err) {
        if (!isMounted) return;

        if ((err as Error).name === 'AbortError') return;
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [mergedParams]);

  const refetch = (override?: Partial<SearchParams>) => {
    setData(null);
    setError(null);
    setIsLoading(true);

    const controller = new AbortController();

    console.log('REFTECH');

    void searchArtworks(
      {
        ...mergedParams,
        ...override
      },
      controller.signal
    )
      .then(response => setData(response))
      .catch(err => {
        if ((err as Error).name === 'AbortError') return;
        setError(err as Error);
      })
      .finally(() => setIsLoading(false));
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};
