import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { GalleryGrid } from './components/GalleryGrid';
import { useArtSearch } from './hooks/useArtSearch';

function App() {
  const [query, setQuery] = useState('painting');
  const searchParams = useMemo(() => ({ q: query }), [query]);
  const searchState = useArtSearch(searchParams);

  const totalFound = searchState.data?.total ?? 0;
  const artworks = useMemo(
    () => searchState.data?.objects ?? [],
    [searchState.data]
  );

  const handleSearch = (value: string) => {
    if (!value.trim() || value.trim() === query) return;
    setQuery(value.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header />
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
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
            <span>
              Showing {artworks.length} of {totalFound.toLocaleString()} results
              for “{query}”.
            </span>
            <button
              type="button"
              onClick={() => searchState.refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400"
            >
              Refresh
            </button>
          </div>

          <GalleryGrid
            items={artworks}
            isLoading={searchState.isLoading}
            error={searchState.error?.message ?? null}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
