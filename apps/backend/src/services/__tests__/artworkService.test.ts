import { describe, expect, it, vi } from 'vitest';

vi.mock('../../clients/metClient', () => ({
  metApi: {
    getObject: vi.fn()
  }
}));

const importArtworkService = async () => {
  return await import('../artworkService');
};

const importMetApi = async () => {
  const module = await import('../../clients/metClient');
  return module.metApi as unknown as {
    getObject: ReturnType<typeof vi.fn>;
  };
};

describe('getArtwork', () => {
  it('fetches and caches artwork by id', async () => {
    const { getArtwork } = await importArtworkService();
    const metApi = await importMetApi();

    metApi.getObject.mockResolvedValue({ objectID: 7 });

    const first = await getArtwork(7);
    const second = await getArtwork(7);

    expect(metApi.getObject).toHaveBeenCalledTimes(1);
    expect(first).toEqual({ objectID: 7 });
    expect(second).toEqual({ objectID: 7 });
  });
});
