import {
  DEFAULT_PAGE_SIZE,
  OBJECT_CACHE_TTL_MS,
  SEARCH_CACHE_TTL_MS
} from '../config';
import { metApi } from '../clients/metClient';
import { TTLCache } from '../lib/cache';
import type { MetObject, SearchParams, SearchResult } from '../types';

const searchCache = new TTLCache<string, SearchResult>(SEARCH_CACHE_TTL_MS);
const objectCache = new TTLCache<number, MetObject>(OBJECT_CACHE_TTL_MS);

const getSearchCacheKey = (params: SearchParams): string => {
  const { query, page, perPage, hasImages, departmentId, artistOrCulture } =
    params;
  return JSON.stringify({
    query,
    page,
    perPage,
    hasImages,
    departmentId,
    artistOrCulture
  });
};

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

export const parseSearchParams = (
  query: Record<string, unknown>
): SearchParams => {
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
    ...(artistOrCulture !== undefined ? { artistOrCulture } : {})
  };
};

export const searchArtworks = async (
  params: SearchParams
): Promise<SearchResult> => {
  const { query, hasImages, departmentId, artistOrCulture, page, perPage } =
    params;

  const cacheKey = getSearchCacheKey(params);
  const cached = searchCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const searchResponse = await metApi.search({
    q: query,
    hasImages,
    ...(departmentId ? { departmentId } : {}),
    ...(artistOrCulture ? { artistOrCulture } : {})
  });

  const allIds = searchResponse.objectIDs ?? [];
  const total = searchResponse.total ?? allIds.length;
  const totalPages = allIds.length > 0 ? Math.ceil(allIds.length / perPage) : 1;
  const startIndex = (page - 1) * perPage;
  const paginatedIds = allIds.slice(startIndex, startIndex + perPage);

  const objects = await Promise.all(
    paginatedIds.map(async (id: number): Promise<MetObject | null> => {
      try {
        const cachedObject = objectCache.get(id);
        if (cachedObject) {
          return cachedObject;
        }

        const object = await metApi.getObject(id);
        objectCache.set(id, object);
        return object;
      } catch (error) {
        console.error(`[met] failed to fetch object ${id}`, error);
        return null;
      }
    })
  );

  const filteredObjects = objects.filter(
    (object: MetObject | null): object is MetObject => object !== null
  );

  const result = {
    page,
    perPage,
    total,
    totalPages,
    objectIDs: paginatedIds,
    objects: filteredObjects
  };

  searchCache.set(cacheKey, result);

  return result;
};
