import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesStorage } from '../favorites/storage';

const favoritesQueryKey = ['favorites'];

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: async () => favoritesStorage.load(),
    staleTime: Infinity,
    initialData: () => favoritesStorage.load()
  });

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = useCallback(
    (artworkId: number) => {
      queryClient.setQueryData<number[]>(
        favoritesQueryKey,
        currentFavorites => {
          const next = new Set(currentFavorites ?? []);

          if (next.has(artworkId)) {
            next.delete(artworkId);
          } else {
            next.add(artworkId);
          }

          const result = Array.from(next);
          favoritesStorage.save(result);
          return result;
        }
      );
    },
    [queryClient]
  );

  const isFavorite = useCallback(
    (artworkId: number) => favoritesSet.has(artworkId),
    [favoritesSet]
  );

  return useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite
    }),
    [favorites, isFavorite, toggleFavorite]
  );
};
