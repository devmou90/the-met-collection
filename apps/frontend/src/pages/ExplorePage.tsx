import { useCallback, useEffect, useMemo, useState } from 'react';
import { GalleryGrid } from '../components/GalleryGrid';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { useArtSearch } from '../hooks/useArtSearch';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getInitialQueryFromUrl, updateQueryParam } from '../utils/urlSearch';

export const ExplorePage = () => {
  const [query, setQuery] = useState(getInitialQueryFromUrl);

  useEffect(() => {
    updateQueryParam(query);
  }, [query]);

  const searchParams = useMemo(
    () => (query ? { q: query } : undefined),
    [query]
  );
  const {
    items: artworks,
    total: totalFound,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error
  } = useArtSearch(searchParams);

  const handleLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const loadMoreRef = useInfiniteScroll({
    enabled: Boolean(query) && hasNextPage && !isInitialLoading,
    loading: isFetchingNextPage,
    onLoadMore: handleLoadMore
  });

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === query) return;
    setQuery(trimmed);
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      <section className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
            The Met Collection
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">
            Discover masterpieces from The Met
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Search artworks through our Node proxy service powered by The Met
            Museum API. Use the search below to explore paintings, sculptures,
            and more.
          </p>
        </div>
        <div className="w-full max-w-sm md:w-auto">
          <SearchBar initialQuery={query} onSearch={handleSearch} />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        {query ? (
          <>
            <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
              <span>
                Showing {artworks.length} of {totalFound.toLocaleString()}{' '}
                results for “{query}”.
              </span>
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400"
              >
                Refresh
              </button>
            </div>

            <GalleryGrid
              items={artworks}
              isLoading={isInitialLoading}
              error={error?.message ?? null}
            />

            <div ref={loadMoreRef} className="h-12 w-full" />
            {isFetchingNextPage ? (
              <p className="text-center text-sm text-slate-400">
                Loading more…
              </p>
            ) : null}
            {!hasNextPage && !isInitialLoading && artworks.length > 0 ? (
              <p className="text-center text-xs uppercase tracking-wider text-slate-400">
                End of results
              </p>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="Start exploring artworks"
            description="Search for an artist, artwork title, or keyword to see results curated from The Met collection."
            action={
              <button
                type="button"
                onClick={() => setQuery('painting')}
                className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
              >
                Try “painting”
              </button>
            }
          />
        )}
      </section>
    </main>
  );
};
