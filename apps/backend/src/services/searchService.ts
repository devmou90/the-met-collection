import { DEFAULT_PAGE_SIZE } from '../config';
import { metApi } from '../metClient';
import type { MetObject, SearchParams, SearchResult } from '../types';

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const toPositiveNumber = (value: unknown): number | undefined => {
  const parsed = toNumber(value);

  if (parsed === undefined || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const toBoolean = (value: unknown, fallback: boolean): boolean => {
  if (value === undefined || value === null) {
    return fallback;
  }

  const normalized = String(value).toLowerCase();

  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  return fallback;
};

export const parseSearchParams = (query: Record<string, unknown>): SearchParams => {
  const searchQuery = String(query.q ?? '').trim();
  const page = toPositiveNumber(query.page) ?? 1;
  const perPage = toPositiveNumber(query.perPage) ?? DEFAULT_PAGE_SIZE;
  const hasImages = toBoolean(query.hasImages, true);
  const departmentId = toPositiveNumber(query.departmentId);
  const artistOrCulture =
    query.artistOrCulture !== undefined && query.artistOrCulture !== null
      ? toBoolean(query.artistOrCulture, false)
      : undefined;

  return {
    query: searchQuery,
    page,
    perPage,
    hasImages,
    ...(departmentId !== undefined ? { departmentId } : {}),
    ...(artistOrCulture !== undefined ? { artistOrCulture } : {}),
  };
};

export const searchArtworks = async (params: SearchParams): Promise<SearchResult> => {
  const { query, hasImages, departmentId, artistOrCulture, page, perPage } = params;

  const searchResponse = await metApi.search({
    q: query,
    hasImages,
    ...(departmentId ? { departmentId } : {}),
    ...(artistOrCulture ? { artistOrCulture } : {}),
  });

  const allIds = searchResponse.objectIDs ?? [];
  const total = searchResponse.total ?? allIds.length;
  const totalPages = allIds.length > 0 ? Math.ceil(allIds.length / perPage) : 1;
  const startIndex = (page - 1) * perPage;
  const paginatedIds = allIds.slice(startIndex, startIndex + perPage);

  const objects = await Promise.all(
    paginatedIds.map(async (id): Promise<MetObject | null> => {
      try {
        return await metApi.getObject(id);
      } catch (error) {
        console.error(`[met] failed to fetch object ${id}`, error);
        return null;
      }
    })
  );

  const filteredObjects = objects.filter(
    (object): object is MetObject => object !== null
  );

  return {
    page,
    perPage,
    total,
    totalPages,
    objectIDs: paginatedIds,
    objects: filteredObjects,
  };
};
