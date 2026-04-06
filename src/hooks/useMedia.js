import { useQuery, useQueryClient } from '@tanstack/react-query';
import { discoverMedia, getMediaDetails, getGenres, getWatchProviders } from '../api/tmdb.js';
import { getRandomBook } from '../api/openLibrary.js';
import { useState, useCallback } from 'react';

export function useGenres(type) {
  return useQuery({
    queryKey: ['genres', type],
    queryFn: () => getGenres(type),
    staleTime: Infinity,
    select: (d) => d.genres || [],
  });
}

export function useRandomMedia(type, filters, enabled = true) {
  const [seed, setSeed] = useState(0);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['discover', type, filters, seed],
    queryFn: async () => {
      if (type === 'book') return getRandomBook();
      const list = await discoverMedia(type, filters);
      const results = list.results || [];
      if (!results.length) throw new Error('No results found for these filters');
      const item = results[Math.floor(Math.random() * results.length)];
      return getMediaDetails(type, item.id, filters.language);
    },
    enabled,
    staleTime: 60_000,
    retry: 1,
  });

  const pickAnother = useCallback(() => setSeed((s) => s + 1), []);

  return { ...query, pickAnother };
}

export function useWatchProviders(type, id, region, enabled = true) {
  return useQuery({
    queryKey: ['providers', type, id, region],
    queryFn: () => getWatchProviders(type, id, region),
    enabled: enabled && !!id && type !== 'book',
    staleTime: 3_600_000,
  });
}

export function useSpecificMedia(type, id) {
  return useQuery({
    queryKey: ['media', type, id],
    queryFn: () => getMediaDetails(type, id),
    enabled: !!id && !!type && type !== 'book',
    staleTime: 300_000,
  });
}
