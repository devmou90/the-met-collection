import { OBJECT_CACHE_TTL_MS } from '../config';
import { metApi } from '../clients/metClient';
import { TTLCache } from '../lib/cache';
import type { MetObject } from '../types';

const objectCache = new TTLCache<number, MetObject>(OBJECT_CACHE_TTL_MS);

export const getArtwork = async (id: number): Promise<MetObject> => {
  const cached = objectCache.get(id);
  if (cached) {
    return cached;
  }

  const object = await metApi.getObject(id);
  objectCache.set(id, object);
  return object;
};
