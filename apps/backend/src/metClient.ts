import axios from 'axios';
import { MET_API_BASE_URL, REQUEST_TIMEOUT_MS } from './config';
import type { MetDepartmentResponse, MetObject, MetSearchResponse } from './types';

const client = axios.create({
  baseURL: MET_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

export const metApi = {
  async search(params: Record<string, string | number | boolean | undefined>) {
    const response = await client.get<MetSearchResponse>('/search', {
      params,
    });

    return response.data;
  },

  async getObject(objectID: number) {
    const response = await client.get<MetObject>(`/objects/${objectID}`);

    return response.data;
  },

  async listDepartments() {
    const response = await client.get<MetDepartmentResponse>('/departments');

    return response.data;
  },
};
