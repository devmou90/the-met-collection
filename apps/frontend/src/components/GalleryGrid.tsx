import type { ArtworkDetail } from '../types/api';

interface GalleryGridProps {
  items: ArtworkDetail[];
  isLoading?: boolean;
  error?: string | null;
}

export const GalleryGrid = ({ items, isLoading, error }: GalleryGridProps) => {
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
      {items.map(artwork => (
        <article
          key={artwork.objectID}
          className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
            {artwork.primaryImageSmall ? (
              <img
                src={artwork.primaryImageSmall}
                alt={artwork.title}
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
            <a
              href={artwork.objectURL}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center justify-center rounded-full border border-emerald-500 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
            >
              View on The Met
            </a>
          </div>
        </article>
      ))}
    </div>
  );
};
