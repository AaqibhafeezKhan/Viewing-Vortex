import { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchMulti } from '../../api/tmdb.js';
import { searchBooks, normalizeBook } from '../../api/openLibrary.js';
import useStore from '../../store/useStore.js';
import { TMDB_IMAGE_BASE } from '../../api/constants.js';
import { formatYear } from '../../utils/formatters.js';
import Badge from '../ui/Badge.jsx';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const TYPE_COLOR = { movie: 'blue', tv: 'purple', person: 'gray', book: 'green' };

export default function SearchBar() {
  const { searchOpen, setSearchOpen, recentSearches, addRecentSearch, setSelectedMedia } = useStore();
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef();
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => setQuery(''), 0);
    }
  }, [searchOpen]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      try {
        const [tmdbRes, booksRes] = await Promise.allSettled([
          searchMulti(debouncedQuery),
          searchBooks(debouncedQuery)
        ]);
        const tmdbResults = tmdbRes.status === 'fulfilled' && tmdbRes.value?.results ? tmdbRes.value.results : [];
        const books = booksRes.status === 'fulfilled' && booksRes.value?.docs ? booksRes.value.docs : [];
        const normalizedBooks = books.slice(0, 3).map((b) => ({
          ...normalizeBook(b),
          media_type: 'book',
          coverMedium: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : null,
          title: b.title,
        }));
        return [...tmdbResults, ...normalizedBooks].slice(0, 8);
      } catch (err) {
        console.error("Search error:", err);
        return [];
      }
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const showRecent = !query && recentSearches.length > 0;
  const showResults = query.length >= 2 && results.length > 0;
  const totalItems = showResults ? results : showRecent ? recentSearches.map((s) => ({ _isRecent: true, query: s })) : [];

  const handleSelect = (item) => {
    if (item._isRecent) { setQuery(item.query); return; }
    const type = item.media_type;
    if (type === 'movie' || type === 'tv' || type === 'book') {
      addRecentSearch(query || item.title || item.name);
      setSelectedMedia({ id: item.id, type, data: item });
      setSearchOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex((i) => Math.min(i + 1, totalItems.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex((i) => Math.max(i - 1, -1)); }
    if (e.key === 'Enter' && highlightIndex >= 0) handleSelect(totalItems[highlightIndex]);
    if (e.key === 'Escape') setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />

          <Motion.div
            className="relative z-10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}
            initial={{ y: -20, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <Search size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlightIndex(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, TV shows, books…"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Search"
                aria-autocomplete="list"
                aria-activedescendant={highlightIndex >= 0 ? `search-item-${highlightIndex}` : undefined}
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} style={{ color: 'var(--text-secondary)' }} /></button>
              )}
            </div>

            {/* Results / recent */}
            {(showResults || showRecent) && (
              <ul role="listbox" className="py-2 max-h-80 overflow-y-auto">
                {showRecent && (
                  <li className="px-4 py-1.5 flex items-center gap-2">
                    <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Recent searches</span>
                  </li>
                )}
                {totalItems.map((item, i) => (
                  <li
                    key={i}
                    id={`search-item-${i}`}
                    role="option"
                    aria-selected={i === highlightIndex}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all"
                    style={{ background: i === highlightIndex ? 'rgba(59,130,246,0.12)' : 'transparent' }}
                    onMouseEnter={() => setHighlightIndex(i)}
                  >
                    {item._isRecent ? (
                      <>
                        <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.query}</span>
                      </>
                    ) : (
                      <>
                        {(item.poster_path || item.profile_path || item.coverMedium) ? (
                          <img
                            src={item.media_type === 'book' ? item.coverMedium : `${TMDB_IMAGE_BASE}/w92${item.poster_path || item.profile_path}`}
                            alt={item.title || item.name}
                            className="rounded object-cover flex-shrink-0"
                            style={{ width: 32, height: 48 }}
                          />
                        ) : (
                          <div className="rounded flex-shrink-0 flex items-center justify-center text-lg"
                            style={{ width: 32, height: 48, background: 'rgba(255,255,255,0.08)' }}>
                            {item.media_type === 'movie' ? '🎬' : item.media_type === 'tv' ? '📺' : item.media_type === 'book' ? '📚' : '👤'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {item.title || item.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {item.media_type === 'book' && item.author ? `${item.author} · ` : ''}
                            {formatYear(item.release_date || item.first_air_date || item.year)}
                          </p>
                        </div>
                        <Badge color={TYPE_COLOR[item.media_type] || 'gray'} size="xs">
                          {item.media_type}
                        </Badge>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {isLoading && (
              <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>Searching…</div>
            )}

            {query.length >= 2 && !isLoading && results.length === 0 && (
              <div className="px-4 py-5 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                No results for "{query}"
              </div>
            )}

            <div className="px-4 py-2 border-t text-[10px] flex gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
              <span>↑↓ Navigate</span><span>Enter Select</span><span>Esc Close</span>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
