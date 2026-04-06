import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORE_VERSION = 1;

const useStore = create(
  persist(
    (set, get) => ({
      // ── Theme ─────────────────────────────────────────
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        set({ theme: next });
      },

      // ── Active section ────────────────────────────────
      activeSection: 'movie',
      setActiveSection: (section) => set({ activeSection: section }),

      // ── Filters ───────────────────────────────────────
      filters: {
        genre: null,
        yearRange: [1950, 2025],
        minRating: 0,
        language: 'en-US',
        region: 'IN',
        runtime: 'any',
        sortBy: 'popularity.desc',
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: {
            genre: null,
            yearRange: [1950, 2025],
            minRating: 0,
            language: 'en-US',
            region: 'IN',
            runtime: 'any',
            sortBy: 'popularity.desc',
          },
        }),

      // ── Watchlist ─────────────────────────────────────
      favorites: [],
      watched: [],

      addFavorite: (item) => {
        const { favorites } = get();
        const exists = favorites.some((f) => f.data?.id === item.data?.id && f.type === item.type);
        if (!exists) set({ favorites: [...favorites, { ...item, dateAdded: new Date().toISOString(), rating: 0, notes: '' }] });
      },
      removeFavorite: (id, type) =>
        set((s) => ({ favorites: s.favorites.filter((f) => !(f.data?.id === id && f.type === type)) })),
      markWatched: (id, type) => {
        const { favorites, watched } = get();
        const item = favorites.find((f) => f.data?.id === id && f.type === type);
        if (item) {
          set({
            favorites: favorites.filter((f) => !(f.data?.id === id && f.type === type)),
            watched: [...watched, { ...item, watchedAt: new Date().toISOString() }],
          });
        } else {
          // Mark directly from current result
          const watchedItem = { type, dateAdded: new Date().toISOString(), watchedAt: new Date().toISOString(), rating: 0, notes: '' };
          set({ watched: [...watched, watchedItem] });
        }
      },
      moveToFavorites: (id, type) => {
        const { watched, favorites } = get();
        const item = watched.find((w) => w.data?.id === id && w.type === type);
        if (item) {
          const { watchedAt, ...rest } = item;
          set({
            watched: watched.filter((w) => !(w.data?.id === id && w.type === type)),
            favorites: [...favorites, rest],
          });
        }
      },
      removeWatched: (id, type) =>
        set((s) => ({ watched: s.watched.filter((w) => !(w.data?.id === id && w.type === type)) })),
      setRating: (id, type, rating) =>
        set((s) => ({
          favorites: s.favorites.map((f) =>
            f.data?.id === id && f.type === type ? { ...f, rating } : f
          ),
        })),
      setNotes: (id, type, notes) =>
        set((s) => ({
          favorites: s.favorites.map((f) =>
            f.data?.id === id && f.type === type ? { ...f, notes } : f
          ),
        })),
      setWatchlist: (favorites, watched) => set({ favorites, watched }),

      // ── Search ────────────────────────────────────────
      recentSearches: [],
      addRecentSearch: (query) => {
        if (!query.trim()) return;
        const searches = [query, ...get().recentSearches.filter((s) => s !== query)].slice(0, 10);
        set({ recentSearches: searches });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),

      // ── UI State ──────────────────────────────────────
      sidebarOpen: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      statsOpen: false,
      setStatsOpen: (v) => set({ statsOpen: v }),
      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
      vortexOpen: false,
      setVortexOpen: (v) => set({ vortexOpen: v }),
      shortcutsOpen: false,
      setShortcutsOpen: (v) => set({ shortcutsOpen: v }),
    }),
    {
      name: 'viewing-vortex-store',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        filters: state.filters,
        favorites: state.favorites,
        watched: state.watched,
        recentSearches: state.recentSearches,
        activeSection: state.activeSection,
      }),
    }
  )
);

export default useStore;
