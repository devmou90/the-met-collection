import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/searchService', () => ({
  parseSearchParams: vi.fn(),
  searchArtworks: vi.fn()
}));

vi.mock('../../services/artworkService', () => ({
  getArtwork: vi.fn()
}));

vi.mock('../../services/departmentService', () => ({
  getDepartments: vi.fn()
}));

const importRouterDeps = async () => {
  const searchService = await import('../../services/searchService');
  const artworkService = await import('../../services/artworkService');
  const departmentService = await import('../../services/departmentService');
  const { artRouter } = await import('../art');
  return { searchService, artworkService, ...departmentService, artRouter };
};

const buildApp = async () => {
  const { artRouter } = await import('../art');
  const app = express();
  app.use(express.json());
  app.use('/api', artRouter);
  return app;
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetModules();
});

describe('art router', () => {
  it('returns 400 when q param is missing', async () => {
    const { searchService } = await importRouterDeps();
    (
      searchService.parseSearchParams as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({ query: '' });

    const app = await buildApp();

    const response = await request(app).get('/api/search');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing required query param: q' });
  });

  it('returns search results when query is provided', async () => {
    const { searchService } = await importRouterDeps();
    (
      searchService.parseSearchParams as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({ query: 'monet' });
    (
      searchService.searchArtworks as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ total: 1 });

    const app = await buildApp();

    const response = await request(app).get('/api/search?q=monet');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ total: 1 });
  });

  it('returns 400 for invalid object id', async () => {
    const app = await buildApp();

    const response = await request(app).get('/api/objects/not-a-number');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid object ID' });
  });

  it('returns artwork data when id is valid', async () => {
    const { artworkService } = await importRouterDeps();
    (
      artworkService.getArtwork as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ objectID: 10 });

    const app = await buildApp();

    const response = await request(app).get('/api/objects/10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ objectID: 10 });
  });

  it('returns departments list', async () => {
    const { getDepartments } = await importRouterDeps();
    (getDepartments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      departments: []
    });

    const app = await buildApp();

    const response = await request(app).get('/api/departments');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ departments: [] });
  });
});
