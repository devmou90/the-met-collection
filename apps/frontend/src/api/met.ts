import { request } from '../lib/http';
import type {
  ArtworkDetail,
  DepartmentResponse,
  SearchResponse
} from '../types/api';

export interface SearchParams {
  q: string;
  page?: number;
  perPage?: number;
  hasImages?: boolean;
  departmentId?: number;
  artistOrCulture?: boolean;
}

export const searchArtworks = async (
  params: SearchParams,
  signal?: AbortSignal
) => {
  return request<SearchResponse>(
    '/search',
    { signal },
    {
      ...params,
      hasImages: params.hasImages ?? true
    }
  );
};

// TODO
export const getArtwork = async (id: number, signal?: AbortSignal) => {
  return request<ArtworkDetail>(`/objects/${id}`, { signal });
};

// TODO
export const listDepartments = async (signal?: AbortSignal) => {
  return request<DepartmentResponse>('/departments', { signal });
};
