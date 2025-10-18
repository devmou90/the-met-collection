import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useFavorites } from './useFavorites';
import { getArtwork } from '../api/met';
import type { ArtworkDetail } from '../types/api';

interface FavoriteArtworksResult {
  favoriteIds: number[];
  artworks: ArtworkDetail[];
  isLoading: boolean;
  error: string | null;
}

export const useFavoriteArtworks = (): FavoriteArtworksResult => {
  const { favorites } = useFavorites();

  const favoriteIds = useMemo(
    () => favorites.filter(id => Number.isFinite(id) && id > 0),
    [favorites]
  );

  const artworkQueries = useQueries({
    queries: favoriteIds.map(objectID => ({
      queryKey: ['artwork', objectID],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getArtwork(objectID, signal),
      staleTime: 1000 * 60 * 10,
      retry: 1
    }))
  });

  const isLoading = artworkQueries.some(query => query.isLoading);
  const firstError = artworkQueries.find(query => query.isError)?.error;

  const error = (() => {
    if (!firstError) {
      return null;
    }
    return firstError instanceof Error
      ? firstError.message
      : 'Failed to load some favorites.';
  })();

  const artworks = artworkQueries
    .map(query => query.data)
    .filter((artwork): artwork is ArtworkDetail => Boolean(artwork));

  return {
    favoriteIds,
    artworks,
    isLoading,
    error
  };
};
