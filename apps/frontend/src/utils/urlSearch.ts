const SEARCH_PARAM_NAME = 'q';
const DEPARTMENT_PARAM_NAME = 'departmentId';

const isWindowAvailable = () => typeof window !== 'undefined';

export interface InitialSearchParams {
  query: string;
  departmentId: number | null;
}

const parseDepartmentId = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const getInitialSearchParams = (): InitialSearchParams => {
  if (!isWindowAvailable()) {
    return { query: '', departmentId: null };
  }

  const params = new URLSearchParams(window.location.search);
  const query = params.get(SEARCH_PARAM_NAME)?.trim() ?? '';
  const departmentId = parseDepartmentId(params.get(DEPARTMENT_PARAM_NAME));

  return { query, departmentId };
};

export const updateSearchParams = ({
  query,
  departmentId
}: InitialSearchParams) => {
  if (!isWindowAvailable()) return;

  const params = new URLSearchParams(window.location.search);

  if (query) {
    params.set(SEARCH_PARAM_NAME, query);
  } else {
    params.delete(SEARCH_PARAM_NAME);
  }

  if (departmentId) {
    params.set(DEPARTMENT_PARAM_NAME, String(departmentId));
  } else {
    params.delete(DEPARTMENT_PARAM_NAME);
  }

  const search = params.toString();
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}`;

  window.history.replaceState(null, '', nextUrl);
};
