import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { MOODS } from '../../utils/moodMap.js';
import useStore from '../../store/useStore.js';
import { useQueryClient } from '@tanstack/react-query';
import { X, Zap } from 'lucide-react';
import Spinner from '../ui/Spinner.jsx';

export default function VortexMode() {
  const { vortexOpen, setVortexOpen, setFilter, setActiveSection } = useStore();
  const [spinning, setSpinning] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const queryClient = useQueryClient();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSpinning(true);

    setFilter('genre', mood.genres.join(','));
    setFilter('minRating', mood.minRating);

    setTimeout(() => {
      const type = Math.random() > 0.5 ? 'movie' : 'tv';
      setActiveSection(type);
      queryClient.invalidateQueries({ queryKey: ['media', type] });

      setSpinning(false);
      setVortexOpen(false);
      setSelectedMood(null);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {vortexOpen && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !spinning && setVortexOpen(false)} />

          <Motion.div
            className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden"
            style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
            initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          >
            <div className="px-6 py-5 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between">
                <div />
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap size={20} style={{ color: 'var(--accent-color)' }} />
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Vortex Mode</h2>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pick a mood — we'll find something perfect</p>
                </div>
                <button onClick={() => setVortexOpen(false)} className="p-2 rounded-full" style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)' }} aria-label="Close Vortex Mode">
                  <X size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {spinning && (
                <Motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
                  style={{ background: 'rgba(0,0,0,0.85)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl"
                  >
                    🌀
                  </Motion.div>
                  <p className="text-lg font-semibold" style={{ color: 'white' }}>
                    Finding your {selectedMood?.label} pick…
                  </p>
                  <Spinner size={24} />
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOODS.map((mood, i) => (
                <Motion.button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood)}
                  disabled={spinning}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl text-center overflow-hidden border border-white/10 transition-all ${spinning ? 'opacity-50' : 'cursor-pointer'}`}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  whileHover={!spinning ? { scale: 1.05, background: 'rgba(255,255,255,0.1)' } : {}}
                  whileTap={!spinning ? { scale: 0.97 } : {}}
                  aria-label={`Select ${mood.label} mood`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{mood.label}</span>
                  <span className="text-[10px] leading-tight" style={{ color: 'var(--text-secondary)' }}>{mood.description}</span>
                </Motion.button>
              ))}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
