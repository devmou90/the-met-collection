import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArtwork } from '../api/met';
import type { ArtworkDetail } from '../types/api';

const DetailField = ({
  label,
  value
}: {
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        {label}
      </dt>
      <dd className="text-sm text-slate-600 dark:text-slate-300">{value}</dd>
    </div>
  );
};

const renderAdditionalImages = (artwork: ArtworkDetail) => {
  if (!artwork.additionalImages?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Additional Views
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {artwork.additionalImages.map(url => (
          <img
            key={url}
            src={url}
            loading="lazy"
            decoding="async"
            alt={`${artwork.title} additional view`}
            className="w-full rounded-lg border border-slate-200 object-cover dark:border-slate-700"
          />
        ))}
      </div>
    </div>
  );
};

export const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const objectId = Number(id);
  const isValidId = Number.isFinite(objectId) && objectId > 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ['artwork', objectId],
    queryFn: ({ signal }) => getArtwork(objectId, signal),
    enabled: isValidId
  });

  if (!isValidId) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Invalid artwork identifier.
        </p>
        <Link
          to="/"
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
        >
          ← Back to explore
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
        <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center">
        <p className="text-sm text-red-500">Failed to load artwork details.</p>
        <Link
          to="/"
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
        >
          ← Back to explore
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <Link
        to="/"
        className="text-sm font-medium text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300"
      >
        ← Back to explore
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          {data.primaryImage ? (
            <img
              src={data.primaryImage}
              alt={data.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Image unavailable
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.title}
            </h1>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              {data.artistDisplayName || 'Unknown artist'}
            </p>
            {data.artistDisplayBio ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {data.artistDisplayBio}
              </p>
            ) : null}
          </header>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label="Department" value={data.department} />
            <DetailField label="Classification" value={data.classification} />
            <DetailField label="Medium" value={data.medium} />
            <DetailField label="Dimensions" value={data.dimensions} />
            <DetailField label="Date" value={data.objectDate} />
            <DetailField label="Credit" value={data.creditLine} />
            <DetailField label="Culture" value={data.culture} />
            <DetailField label="Repository" value={data.repository} />
          </dl>

          <div className="flex flex-wrap gap-3">
            <a
              href={data.objectURL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
            >
              View on The Met
            </a>
          </div>

          {renderAdditionalImages(data)}
        </aside>
      </div>
    </main>
  );
};
