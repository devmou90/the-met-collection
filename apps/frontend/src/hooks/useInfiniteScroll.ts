import { useEffect, useRef } from 'react';

interface UseInfiniteScrollParams {
  enabled: boolean;
  loading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  enabled,
  loading,
  onLoadMore,
  rootMargin = '200px'
}: UseInfiniteScrollParams) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || loading) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, loading, onLoadMore, rootMargin]);

  return ref;
};
