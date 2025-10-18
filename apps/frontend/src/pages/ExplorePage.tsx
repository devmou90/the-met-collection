import { useCallback, useEffect, useMemo, useState } from 'react';
import { GalleryGrid } from '../components/GalleryGrid';
import { EmptyState } from '../components/EmptyState';
import { FilterDrawer } from '../components/FilterDrawer';
import { SearchBar } from '../components/SearchBar';
import { DepartmentFilter } from '../components/DepartmentFilter';
import { useArtSearch } from '../hooks/useArtSearch';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDepartments } from '../hooks/useDepartments';
import { getInitialSearchParams, updateSearchParams } from '../utils/urlSearch';

export const ExplorePage = () => {
  const initialParams = useMemo(() => getInitialSearchParams(), []);
  const [query, setQuery] = useState(initialParams.query);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    initialParams.departmentId
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { departments, isLoading: isLoadingDepartments } = useDepartments();

  useEffect(() => {
    updateSearchParams({ query, departmentId: selectedDepartment });
  }, [query, selectedDepartment]);

  const searchParams = useMemo(
    () =>
      query
        ? {
            q: query,
            departmentId: selectedDepartment ?? undefined
          }
        : undefined,
    [query, selectedDepartment]
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

  const handleDepartmentChange = (departmentId: number | null) => {
    if (departmentId === selectedDepartment) return;
    setSelectedDepartment(departmentId);
  };

  const selectedDepartmentName = useMemo(() => {
    if (selectedDepartment === null) {
      return null;
    }

    const department = departments.find(
      item => item.departmentId === selectedDepartment
    );
    return department?.displayName ?? null;
  }, [departments, selectedDepartment]);

  const hasActiveFilters = selectedDepartment !== null;

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
        <div className="w-full max-w-md space-y-4">
          <SearchBar initialQuery={query} onSearch={handleSearch} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400"
            >
              Filters
              {hasActiveFilters ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                  1
                </span>
              ) : null}
            </button>
            {selectedDepartmentName ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                {selectedDepartmentName}
                <button
                  type="button"
                  onClick={() => handleDepartmentChange(null)}
                  className="rounded-full p-1 text-emerald-500 transition hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30"
                  aria-label="Clear department filter"
                >
                  ×
                </button>
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                All departments
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        {query ? (
          <>
            <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
              <span>
                Showing {artworks.length} of {totalFound.toLocaleString()}{' '}
                results for “{query}”
                {selectedDepartmentName ? (
                  <>
                    {' '}
                    in <strong>{selectedDepartmentName}</strong>
                  </>
                ) : (
                  ''
                )}
                .
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
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filters"
        description="Refine your search or choose a department to narrow the results."
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Keyword
            </p>
            <SearchBar initialQuery={query} onSearch={handleSearch} />
          </div>
          <div className="space-y-4">
            <DepartmentFilter
              departments={departments}
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              isLoading={isLoadingDepartments}
            />
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => handleDepartmentChange(null)}
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400"
            >
              Clear department filter
            </button>
          ) : null}
        </div>
      </FilterDrawer>
    </main>
  );
};
