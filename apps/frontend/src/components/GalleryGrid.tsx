import { useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { ArtworkDetail } from '../types/api';
import { useFavorites } from '../hooks/useFavorites';

interface GalleryGridProps {
  items: ArtworkDetail[];
  isLoading?: boolean;
  error?: string | null;
}

export const GalleryGrid = ({ items, isLoading, error }: GalleryGridProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const handleFavoriteClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const datasetId = event.currentTarget.dataset.artworkId;
      if (!datasetId) {
        return;
      }

      const artworkId = Number(datasetId);
      if (!Number.isFinite(artworkId)) {
        return;
      }

      toggleFavorite(artworkId);
    },
    [toggleFavorite]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200/50 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="aspect-[4/5] w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-500/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No artworks found. Try another search term.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(artwork => {
        const favorite = isFavorite(artwork.objectID);
        return (
          <article
            key={artwork.objectID}
            className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                aria-pressed={favorite}
                aria-label={
                  favorite ? 'Remove from favorites' : 'Add to favorites'
                }
                onClick={handleFavoriteClick}
                data-artwork-id={String(artwork.objectID)}
                title={favorite ? 'Remove from favorites' : 'Add to favorites'}
                className={`absolute z-10 right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-400 shadow-sm transition duration-200 hover:text-rose-500 dark:bg-slate-900/90 dark:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 group-hover:pointer-events-auto group-hover:opacity-100 ${favorite ? 'pointer-events-auto opacity-100 text-rose-500' : 'pointer-events-none opacity-0'} cursor-pointer`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill={favorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.001 20.727 4.708 13.43a5.25 5.25 0 0 1 7.425-7.425l-.132.132.001.002.124-.124a5.25 5.25 0 0 1 7.426 7.425l-7.551 7.287"
                  />
                </svg>
              </button>
              {artwork.primaryImageSmall ? (
                <img
                  src={artwork.primaryImageSmall}
                  alt={artwork.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  No image available
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex flex-1 flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {artwork.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {artwork.artistDisplayName || 'Unknown artist'}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <dt className="font-medium uppercase tracking-wider text-slate-400">
                      Department
                    </dt>
                    <dd>{artwork.department}</dd>
                  </div>
                  <div>
                    <dt className="font-medium uppercase tracking-wider text-slate-400">
                      Date
                    </dt>
                    <dd>{artwork.objectDate || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link
                  to={`/artworks/${artwork.objectID}`}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400"
                >
                  View details
                </Link>
                <a
                  href={artwork.objectURL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-emerald-500 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                >
                  View on The Met
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
