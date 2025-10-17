const SEARCH_PARAM_NAME = 'q';

const isWindowAvailable = () => typeof window !== 'undefined';

export const getInitialQueryFromUrl = (): string => {
  if (!isWindowAvailable()) return '';

  return (
    new URLSearchParams(window.location.search)
      .get(SEARCH_PARAM_NAME)
      ?.trim() ?? ''
  );
};

export const updateQueryParam = (query: string) => {
  if (!isWindowAvailable()) return;

  const params = new URLSearchParams(window.location.search);

  if (query) {
    params.set(SEARCH_PARAM_NAME, query);
  } else {
    params.delete(SEARCH_PARAM_NAME);
  }

  const search = params.toString();
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}`;

  window.history.replaceState(null, '', nextUrl);
};
