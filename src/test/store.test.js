import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import useStore from '../../store/useStore.js';

const initialState = useStore.getState();

beforeEach(() => {
  useStore.setState({
    ...initialState,
    favorites: [],
    watched: [],
    filters: {
      genre: null, yearRange: [1950, 2025], minRating: 0,
      language: 'en-US', region: 'IN', runtime: 'any', sortBy: 'popularity.desc',
    },
    theme: 'dark',
    activeSection: 'movie',
  });
});

const mockItem = { type: 'movie', data: { id: 101, title: 'Test Movie', poster_path: null } };

describe('Zustand store', () => {
  it('addFavorite adds an item', () => {
    const { addFavorite } = useStore.getState();
    act(() => addFavorite(mockItem));
    expect(useStore.getState().favorites).toHaveLength(1);
    expect(useStore.getState().favorites[0].data.id).toBe(101);
  });

  it('addFavorite does not duplicate same item', () => {
    act(() => useStore.getState().addFavorite(mockItem));
    act(() => useStore.getState().addFavorite(mockItem));
    expect(useStore.getState().favorites).toHaveLength(1);
  });

  it('removeFavorite removes an item', () => {
    act(() => useStore.getState().addFavorite(mockItem));
    act(() => useStore.getState().removeFavorite(101, 'movie'));
    expect(useStore.getState().favorites).toHaveLength(0);
  });

  it('markWatched moves from favorites to watched', () => {
    act(() => useStore.getState().addFavorite(mockItem));
    act(() => useStore.getState().markWatched(101, 'movie'));
    expect(useStore.getState().favorites).toHaveLength(0);
    expect(useStore.getState().watched).toHaveLength(1);
  });

  it('setRating updates rating on favorite', () => {
    act(() => useStore.getState().addFavorite(mockItem));
    act(() => useStore.getState().setRating(101, 'movie', 4));
    expect(useStore.getState().favorites[0].rating).toBe(4);
  });

  it('setFilter updates a single filter', () => {
    act(() => useStore.getState().setFilter('genre', '28'));
    expect(useStore.getState().filters.genre).toBe('28');
  });

  it('resetFilters resets to defaults', () => {
    act(() => useStore.getState().setFilter('genre', '18'));
    act(() => useStore.getState().setFilter('minRating', 7));
    act(() => useStore.getState().resetFilters());
    const { filters } = useStore.getState();
    expect(filters.genre).toBeNull();
    expect(filters.minRating).toBe(0);
  });

  it('toggleTheme switches between light and dark', () => {
    expect(useStore.getState().theme).toBe('dark');
    act(() => useStore.getState().toggleTheme());
    expect(useStore.getState().theme).toBe('light');
    act(() => useStore.getState().toggleTheme());
    expect(useStore.getState().theme).toBe('dark');
  });

  it('addRecentSearch stores up to 10 queries', () => {
    for (let i = 0; i < 12; i++) {
      act(() => useStore.getState().addRecentSearch(`query-${i}`));
    }
    expect(useStore.getState().recentSearches.length).toBeLessThanOrEqual(10);
  });
});
