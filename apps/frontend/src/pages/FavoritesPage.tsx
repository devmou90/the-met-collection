import { Link } from 'react-router-dom';
import { GalleryGrid } from '../components/GalleryGrid';
import { useFavoriteArtworks } from '../hooks/useFavoriteArtworks';

const emptyState = (
  <main className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        No favorites yet
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Mark artworks as favorites to collect them here.
      </p>
    </div>
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
    >
      ← Browse artworks
    </Link>
  </main>
);

export const FavoritesPage = () => {
  const { favoriteIds, artworks, isLoading, error } = useFavoriteArtworks();

  if (!favoriteIds.length) {
    return emptyState;
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Your favorites
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {artworks.length
              ? `Saved artworks: ${artworks.length}`
              : 'Fetching your saved artworks...'}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400"
        >
          ← Back to explore
        </Link>
      </div>

      <GalleryGrid
        items={artworks}
        isLoading={isLoading && !artworks.length}
        error={error}
      />
    </main>
  );
};
