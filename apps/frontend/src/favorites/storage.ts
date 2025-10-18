const STORAGE_KEY = 'met:favorites';

export interface FavoritesStorage {
  load(): number[];
  save(favorites: number[]): void;
}

const ensureArrayOfNumbers = (value: unknown): number[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => {
      const parsed = Number(item);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .filter((item): item is number => item !== null);
};

const readFromLocalStorage = (): number[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return ensureArrayOfNumbers(parsed);
  } catch {
    return [];
  }
};

const writeToLocalStorage = (favorites: number[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const uniqueFavorites = Array.from(new Set(favorites));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueFavorites));
  } catch {
    // Swallow errors to avoid breaking the UI when storage is unavailable.
  }
};

export const favoritesStorage: FavoritesStorage = {
  load: readFromLocalStorage,
  save: writeToLocalStorage
};
