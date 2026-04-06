import { useState, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Eye, Star, Trash2, Download, Upload, ChevronRight } from 'lucide-react';
import useStore from '../../store/useStore.js';
import { exportWatchlist, importWatchlist, mergeWatchlists } from '../../utils/exportImport.js';
import { TMDB_IMAGE_BASE } from '../../api/constants.js';
import { formatDate } from '../../utils/formatters.js';
import { toast } from '../../hooks/useToast.js';

export default function Sidebar() {
  const {
    sidebarOpen, setSidebarOpen,
    favorites, watched,
    removeFavorite, removeWatched, moveToFavorites,
    setRating, setNotes, setWatchlist,
  } = useStore();
  const [tab, setTab] = useState('favorites');
  const fileRef = useRef();

  const handleExport = () => {
    exportWatchlist(favorites, watched);
    toast('Watchlist exported!', 'success');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importWatchlist(file);
      const merged = mergeWatchlists({ favorites, watched }, imported);
      setWatchlist(merged.favorites, merged.watched);
      toast(`Imported ${imported.favorites.length + imported.watched.length} items!`, 'success');
    } catch {
      toast('Failed to import — invalid file', 'error');
    }
    e.target.value = '';
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <Motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <Motion.aside
        className="fixed top-0 right-0 h-full z-50 flex flex-col w-[360px] max-w-[95vw] overflow-hidden"
        style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-lg)' }}
        initial={{ x: '100%' }}
        animate={{ x: sidebarOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        aria-label="My Collection sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: 'var(--primary-color)' }}>
          <h2 className="flex items-center gap-2 font-semibold text-base" style={{ color: 'var(--text-light)' }}>
            <Heart size={16} /> My Collection
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="p-1.5 rounded-full text-white/70 hover:text-white transition-colors" aria-label="Export watchlist">
              <Download size={15} />
            </button>
            <button onClick={() => fileRef.current?.click()} className="p-1.5 rounded-full text-white/70 hover:text-white transition-colors" aria-label="Import watchlist">
              <Upload size={15} />
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} aria-label="Import watchlist file" />
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-full text-white/70 hover:text-white transition-colors" aria-label="Close sidebar">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex relative border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {['favorites', 'watched'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-medium capitalize transition-colors relative"
              style={{ color: tab === t ? 'var(--secondary-color)' : 'var(--text-secondary)' }}
            >
              {t} {t === 'favorites' ? `(${favorites.length})` : `(${watched.length})`}
              {tab === t && (
                <Motion.div
                  layoutId="sidebar-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'var(--secondary-color)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {tab === 'favorites' && favorites.map((item) => (
              <FavoriteItem
                key={`${item.type}-${item.data?.id}`}
                item={item}
                onRemove={() => removeFavorite(item.data?.id, item.type)}
                onSetRating={(r) => setRating(item.data?.id, item.type, r)}
                onSetNotes={(n) => setNotes(item.data?.id, item.type, n)}
                showMoveToWatched
              />
            ))}
            {tab === 'watched' && watched.map((item) => (
              <FavoriteItem
                key={`${item.type}-${item.data?.id}`}
                item={item}
                onRemove={() => removeWatched(item.data?.id, item.type)}
                onMoveBack={() => moveToFavorites(item.data?.id, item.type)}
                isWatched
              />
            ))}
          </AnimatePresence>

          {tab === 'favorites' && favorites.length === 0 && (
            <EmptyState icon={<Heart size={32} className="mb-3 opacity-30" />} message="No favorites yet. Hit 'S' to save the current pick!" />
          )}
          {tab === 'watched' && watched.length === 0 && (
            <EmptyState icon={<Eye size={32} className="mb-3 opacity-30" />} message="Nothing watched yet. Press 'W' to mark something watched!" />
          )}
        </div>
      </Motion.aside>
    </>
  );
}

function FavoriteItem({ item, onRemove, onSetRating, onSetNotes, onMoveBack, isWatched }) {
  const { data, type, dateAdded, watchedAt, rating = 0, notes = '' } = item;
  const title = data?.title || data?.name || data?.title || 'Untitled';
  const poster = data?.poster_path
    ? `${TMDB_IMAGE_BASE}/w92${data.poster_path}`
    : data?.cover || null;

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
      className="rounded-xl p-3 flex gap-3 relative group"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Poster */}
      {poster ? (
        <img src={poster} alt={title} className="w-12 h-18 object-cover rounded-md flex-shrink-0" style={{ height: '72px', width: '48px' }} />
      ) : (
        <div className="w-12 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-center"
          style={{ height: '72px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
          No img
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          {type.toUpperCase()} · {formatDate(isWatched ? watchedAt : dateAdded)}
        </p>

        {/* Star rating */}
        {!isWatched && onSetRating && (
          <div className="star-rating mb-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => onSetRating(s)} className={s <= rating ? 'active' : ''} aria-label={`Rate ${s} star`}>★</button>
            ))}
          </div>
        )}

        {/* Notes */}
        {!isWatched && onSetNotes && (
          <textarea
            defaultValue={notes}
            onBlur={(e) => onSetNotes(e.target.value)}
            placeholder="Add notes…"
            rows={1}
            className="w-full text-xs px-2 py-1 rounded resize-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
            aria-label="Personal notes"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveBack && (
          <button onClick={onMoveBack} className="p-1 rounded-full hover:text-blue-400 transition-colors" aria-label="Move back to favorites" title="Move to Favorites">
            <ChevronRight size={13} style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}
        <button onClick={onRemove} className="p-1 rounded-full hover:text-red-400 transition-colors" aria-label="Remove item" title="Remove">
          <Trash2 size={13} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </Motion.div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );
}
