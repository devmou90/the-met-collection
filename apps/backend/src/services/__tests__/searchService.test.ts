import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../clients/metClient', () => {
  return {
    metApi: {
      search: vi.fn(),
      getObject: vi.fn(),
      listDepartments: vi.fn()
    }
  };
});

const buildMetObject = (
  overrides: Partial<import('../../types').MetObject> = {}
) => ({
  objectID: 1,
  title: 'Title',
  primaryImage: '',
  primaryImageSmall: '',
  artistDisplayName: '',
  artistDisplayBio: '',
  objectDate: '',
  medium: '',
  department: '',
  culture: '',
  period: '',
  objectURL: '',
  dimensions: '',
  creditLine: '',
  classification: '',
  repository: '',
  tags: [],
  additionalImages: [],
  ...overrides
});

const importSearchService = async () => {
  return await import('../searchService');
};

const importMetApi = async () => {
  const module = await import('../../clients/metClient');
  return module.metApi as unknown as {
    search: ReturnType<typeof vi.fn>;
    getObject: ReturnType<typeof vi.fn>;
    listDepartments: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetModules();
});

describe('parseSearchParams', () => {
  it('parses defaults and trims values', async () => {
    const { parseSearchParams } = await importSearchService();

    const params = parseSearchParams({
      q: '  Monet  ',
      perPage: 'invalid',
      hasImages: 'false',
      departmentId: '42',
      artistOrCulture: 'true'
    });

    expect(params).toEqual({
      query: 'Monet',
      page: 1,
      perPage: 15,
      hasImages: false,
      departmentId: 42,
      artistOrCulture: true
    });
  });

  it('omits optional params when not provided', async () => {
    const { parseSearchParams } = await importSearchService();

    const params = parseSearchParams({
      q: 'Van Gogh',
      page: '2',
      perPage: '5'
    });

    expect(params).toEqual({
      query: 'Van Gogh',
      page: 2,
      perPage: 5,
      hasImages: true
    });
  });
});

describe('searchArtworks', () => {
  it('fetches results and caches subsequent calls', async () => {
    const { searchArtworks } = await importSearchService();
    const metApi = await importMetApi();

    metApi.search.mockResolvedValue({
      objectIDs: [1, 2, 3],
      total: 3
    });
    metApi.getObject.mockImplementation(async (id: number) =>
      buildMetObject({ objectID: id })
    );

    const params = {
      query: 'sunflower',
      page: 1,
      perPage: 2,
      hasImages: true
    } as const;

    const first = await searchArtworks({ ...params });

    expect(metApi.search).toHaveBeenCalledTimes(1);
    expect(metApi.getObject).toHaveBeenCalledTimes(2);
    expect(first.objects).toHaveLength(2);

    const second = await searchArtworks({ ...params });

    expect(metApi.search).toHaveBeenCalledTimes(1);
    expect(metApi.getObject).toHaveBeenCalledTimes(2);
    expect(second.objects).toEqual(first.objects);
  });

  it('filters out objects that fail to load', async () => {
    const { searchArtworks } = await importSearchService();
    const metApi = await importMetApi();

    metApi.search.mockResolvedValue({
      objectIDs: [1, 2],
      total: 2
    });
    metApi.getObject.mockImplementation(async (id: number) => {
      if (id === 2) {
        throw new Error('failed');
      }

      return buildMetObject({ objectID: id });
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await searchArtworks({
      query: 'abstract',
      page: 1,
      perPage: 5,
      hasImages: true
    });

    expect(metApi.getObject).toHaveBeenCalledTimes(2);
    expect(result.objects).toHaveLength(1);
    expect(result.objects[0]?.objectID).toBe(1);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
