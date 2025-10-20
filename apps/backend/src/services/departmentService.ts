import { DEPARTMENT_CACHE_TTL_MS } from '../config';
import { metApi } from '../clients/metClient';
import { TTLCache } from '../lib/cache';
import type { MetDepartmentResponse } from '../types';

const CACHE_KEY = 'departments';

const departmentCache = new TTLCache<string, MetDepartmentResponse>(
  DEPARTMENT_CACHE_TTL_MS
);

export const getDepartments = async () => {
  const cached = departmentCache.get(CACHE_KEY);
  if (cached) {
    return cached;
  }

  const departments = await metApi.listDepartments();
  departmentCache.set(CACHE_KEY, departments);

  return departments;
};

export const clearDepartmentsCache = () => {
  departmentCache.clear();
};
