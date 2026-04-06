import { useState, useCallback, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { discoverMedia, getMediaDetails } from '../../api/tmdb.js';
import { getRandomBook } from '../../api/openLibrary.js';
import useStore from '../../store/useStore.js';
import { useKeyboard } from '../../hooks/useKeyboard.js';
import MediaCard from '../cards/MediaCard.jsx';
import SkeletonCard from '../cards/SkeletonCard.jsx';
import FilterBar from '../filters/FilterBar.jsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function SectionView({ type }) {
  const { filters, selectedMedia, setSelectedMedia } = useStore();
  const [seed, setSeed] = useState(0);
  const [specificId, setSpecificId] = useState(null);
  const cardRef = useRef();

  const pickAnother = useCallback(() => {
    setSelectedMedia(null);
    setSpecificId(null);
    setSeed((s) => s + 1);
  }, [setSelectedMedia]);

  useKeyboard({ onPickAnother: pickAnother });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['media', type, filters, seed, specificId],
    queryFn: async () => {
      // 1. Check for specific choice from store (Search)
      if (selectedMedia && selectedMedia.type === type) {
        const id = selectedMedia.id;
        // Optionally use data if already fetched, but details API might have more
        return getMediaDetails(type, id, filters.language);
      }
      // 2. Check for internal "similar" pick
      if (specificId) return getMediaDetails(type, specificId, filters.language);
      // 3. Random pick for books
      if (type === 'book') return getRandomBook();
      // 4. Discover random movie/tv
      const list = await discoverMedia(type, filters);
      const results = list.results || [];
      if (!results.length) throw new Error('No results found. Try adjusting your filters.');
      const item = results[Math.floor(Math.random() * results.length)];
      return getMediaDetails(type, item.id, filters.language);
    },
    staleTime: 60_000,
    retry: 1,
  });

  const handleSelectSimilar = (id) => {
    setSpecificId(id);
    setSeed((s) => s + 1);
  };

  return (
    <div className="min-h-[60vh] flex flex-col gap-6">
      <FilterBar type={type} />

      <AnimatePresence mode="wait">
        {isLoading && (
          <Motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonCard />
          </Motion.div>
        )}

        {isError && !isLoading && (
          <Motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-lg mx-auto text-center py-16 px-6 rounded-2xl"
            style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-md)' }}
          >
            <AlertCircle size={40} className="mx-auto mb-4" style={{ color: '#ef4444' }} />
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Oops, something went wrong</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {error?.message || 'Failed to load content. Please try again.'}
            </p>
            <Button variant="primary" onClick={pickAnother}>
              <RefreshCw size={15} /> Try Again
            </Button>
          </Motion.div>
        )}

        {data && !isLoading && !isError && (
          <Motion.div key={`${type}-${data.id || seed}`} className="w-full">
            <MediaCard
              data={data}
              type={type}
              onPickAnother={pickAnother}
              onSelectSimilar={handleSelectSimilar}
              cardRef={cardRef}
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
