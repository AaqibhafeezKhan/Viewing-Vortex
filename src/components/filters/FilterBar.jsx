import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, RotateCcw } from 'lucide-react';
import useStore from '../../store/useStore.js';
import { useGenres } from '../../hooks/useMedia.js';
import { SORT_OPTIONS, REGIONS } from '../../api/constants.js';

export default function FilterBar({ type }) {
  const [open, setOpen] = useState(false);
  const { filters, setFilter, resetFilters } = useStore();
  const { data: genres = [] } = useGenres(type === 'book' ? 'movie' : type);

  const activeCount = [
    filters.genre,
    filters.minRating > 0,
    filters.yearRange[0] !== 1950 || filters.yearRange[1] !== 2025,
    filters.runtime !== 'any',
    filters.sortBy !== 'popularity.desc',
  ].filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Toggle button */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: open ? 'var(--secondary-color)' : 'rgba(255,255,255,0.08)', color: open ? 'white' : 'var(--text-primary)' }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          aria-expanded={open}
          aria-label="Toggle filters"
        >
          <Filter size={15} />
          Filters
          {activeCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
              style={{ background: 'var(--accent-color)', color: 'white' }}>
              {activeCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </motion.button>

        {activeCount > 0 && (
          <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)' }}
            aria-label="Reset all filters">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="overflow-hidden mt-3 rounded-2xl"
            style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-md)' }}
          >
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              {/* Genre pills */}
              {type !== 'book' && (
                <div className="sm:col-span-2">
                  <Label>Genre</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Pill active={!filters.genre} onClick={() => setFilter('genre', null)}>All</Pill>
                    {genres.map((g) => (
                      <Pill key={g.id} active={filters.genre === String(g.id)} onClick={() => setFilter('genre', String(g.id))}>
                        {g.name}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}

              {/* Year range slider */}
              <div>
                <Label>Year Range: {filters.yearRange[0]} – {filters.yearRange[1]}</Label>
                <DualSlider
                  min={1920} max={2025}
                  value={filters.yearRange}
                  onChange={(val) => setFilter('yearRange', val)}
                />
              </div>

              {/* Rating floor */}
              <div>
                <Label>Min Rating: {filters.minRating.toFixed(1)} ⭐</Label>
                <input
                  type="range" min={0} max={10} step={0.5}
                  value={filters.minRating}
                  onChange={(e) => setFilter('minRating', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 mt-2"
                  aria-label="Minimum rating filter"
                />
              </div>

              {/* Runtime */}
              {type !== 'book' && (
                <div>
                  <Label>Runtime</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {[['any','Any'],['short','< 1h'],['standard','1–2h'],['epic','2.5h+']].map(([v,l]) => (
                      <Pill key={v} active={filters.runtime === v} onClick={() => setFilter('runtime', v)}>{l}</Pill>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort + Region */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Sort By</Label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilter('sortBy', e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-primary)' }}
                    aria-label="Sort by"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <Label>Region</Label>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilter('region', e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-primary)' }}
                    aria-label="Streaming region"
                  >
                    {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Label({ children }) {
  return <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{children}</p>;
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs rounded-full font-medium transition-all"
      style={{
        background: active ? 'var(--secondary-color)' : 'rgba(255,255,255,0.07)',
        color: active ? 'white' : 'var(--text-secondary)',
      }}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function DualSlider({ min, max, value, onChange }) {
  const [low, high] = value;
  return (
    <div className="relative mt-3 pt-1">
      <div className="relative h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="absolute h-1 rounded-full"
          style={{
            background: 'var(--secondary-color)',
            left: `${((low - min) / (max - min)) * 100}%`,
            right: `${100 - ((high - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <input type="range" min={min} max={max} value={low} className="absolute inset-0 w-full opacity-0 cursor-pointer h-4" aria-label="Start year"
        onChange={(e) => { const v = Math.min(parseInt(e.target.value), high - 1); onChange([v, high]); }} />
      <input type="range" min={min} max={max} value={high} className="absolute inset-0 w-full opacity-0 cursor-pointer h-4" aria-label="End year"
        onChange={(e) => { const v = Math.max(parseInt(e.target.value), low + 1); onChange([low, v]); }} />
    </div>
  );
}
