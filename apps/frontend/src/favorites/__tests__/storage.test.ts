import { describe, expect, it, beforeEach, vi } from 'vitest';
import { favoritesStorage } from '../storage';

const STORAGE_KEY = 'met:favorites';

describe('favoritesStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads an array of numbers from localStorage', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([1, '2', 'foo']));

    const favorites = favoritesStorage.load();

    expect(favorites).toEqual([1, 2]);
  });

  it('returns an empty array when stored value is invalid', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ not json');

    expect(favoritesStorage.load()).toEqual([]);
  });

  it('deduplicates and stores favorites', () => {
    favoritesStorage.save([2, 2, 3]);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).toBe(JSON.stringify([2, 3]));
  });

  it('swallows storage errors on save', () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });

    expect(() => favoritesStorage.save([1])).not.toThrow();
    expect(setItemSpy).toHaveBeenCalled();
  });
});
