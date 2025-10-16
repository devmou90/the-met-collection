const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) return '/api';

  return value.endsWith('/') ? value.slice(0, -1) : value;
};

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL as string | undefined
);
