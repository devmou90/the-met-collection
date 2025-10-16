const toPositiveNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const MET_API_BASE_URL =
  process.env.MET_API_BASE_URL ??
  'https://collectionapi.metmuseum.org/public/collection/v1';

export const DEFAULT_PAGE_SIZE = toPositiveNumber(
  process.env.MET_RESULTS_PER_PAGE,
  15
);

export const REQUEST_TIMEOUT_MS = toPositiveNumber(
  process.env.MET_API_TIMEOUT_MS,
  10000
);
