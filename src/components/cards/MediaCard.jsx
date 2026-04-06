import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Heart, Eye, Share2, PlayCircle, BookOpen, ExternalLink, Star, Clock, Calendar, Layers } from 'lucide-react';
import useStore from '../../store/useStore.js';
import { TMDB_IMAGE_BASE } from '../../api/constants.js';
import { formatRuntime, formatSeasons, formatYear, formatRating } from '../../utils/formatters.js';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import CastRow from './CastRow.jsx';
import SimilarRail from './SimilarRail.jsx';
import StreamingBadges from './StreamingBadges.jsx';
import Confetti from '../ui/Confetti.jsx';
import { toast } from '../../hooks/useToast.js';
import { useShareHash } from '../../hooks/useShareHash.js';
import html2canvas from 'html2canvas';

export default function MediaCard({ data, type, onPickAnother, onSelectSimilar, cardRef: externalRef }) {
  const { addFavorite, markWatched, favorites } = useStore();
  const [confetti, setConfetti] = useState(false);
  const cardRef = externalRef || useRef();
  const { writeHash } = useShareHash();

  if (!data) return null;

  const title = data.title || data.name || 'Untitled';
  const year = formatYear(data.release_date || data.first_air_date || (data.year ? `${data.year}-01-01` : null));
  const rating = formatRating(data.vote_average);
  const overview = data.overview || data.description || 'No description available.';
  const tagline = data.tagline;
  const poster = data.poster_path ? `${TMDB_IMAGE_BASE}/w500${data.poster_path}` : data.cover || null;
  const backdrop = data.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${data.backdrop_path}` : poster;
  const cast = data.credits?.cast || [];
  const similar = data.similar?.results || [];
  const trailer = data.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const genres = data.genres || [];
  const certification = getCertification(data, type);
  const collection = data.belongs_to_collection;

  const isFavorite = favorites.some((f) => f.data?.id === data.id && f.type === type);

  const handleSave = () => {
    if (isFavorite) { toast('Already in your favorites!', 'info'); return; }
    addFavorite({ type, data });
    setConfetti(true);
    toast(`"${title}" saved to favorites! 🎉`, 'success');
  };

  const handleWatched = () => {
    markWatched(data.id, type);
    toast(`"${title}" marked as watched!`, 'success');
  };

  const handleShare = () => {
    if (type !== 'book') writeHash(type, data.id);
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => toast('Link copied to clipboard!', 'success'));
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2, logging: false });
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-viewing-vortex.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast('Card saved as PNG!', 'success');
    } catch {
      toast('Failed to capture card', 'error');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="max-w-4xl mx-auto rounded-2xl overflow-hidden relative"
      style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-lg)' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Confetti overlay */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <Confetti active={confetti} onDone={() => setConfetti(false)} />
      </div>

      <div className="grid md:grid-cols-[280px_1fr]">
        {/* ── Poster with backdrop blur ── */}
        <div className="relative overflow-hidden" style={{ minHeight: '420px' }}>
          {backdrop && (
            <>
              <div
                className="media-backdrop"
                style={{ backgroundImage: `url(${backdrop})` }}
              />
              <div className="media-backdrop-overlay" />
            </>
          )}
          {poster ? (
            <img
              src={poster}
              alt={`${title} poster`}
              className="relative z-10 w-full h-full object-cover"
              style={{ minHeight: '420px', maxHeight: '500px' }}
            />
          ) : (
            <div className="relative z-10 w-full flex items-center justify-center text-4xl"
              style={{ minHeight: '420px', background: 'rgba(0,0,0,0.4)' }}>
              {type === 'book' ? '📚' : type === 'tv' ? '📺' : '🎬'}
            </div>
          )}
        </div>

        {/* ── Details ── */}
        <div className="p-6 md:p-8 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '500px' }}>
          {/* Title + tagline */}
          <div>
            <div className="flex items-start gap-2 flex-wrap">
              <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              {certification && <Badge color="orange">{certification}</Badge>}
              {collection && (
                <Badge color="purple">
                  <Layers size={10} className="mr-1" />
                  {collection.name}
                </Badge>
              )}
            </div>
            {tagline && <p className="text-sm italic mt-1" style={{ color: 'var(--text-secondary)' }}>"{tagline}"</p>}
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {rating !== 'N/A' && (
              <MetaPill icon={<Star size={13} />} text={`${rating} / 10`} />
            )}
            {year !== 'N/A' && <MetaPill icon={<Calendar size={13} />} text={year} />}
            {type === 'movie' && data.runtime && <MetaPill icon={<Clock size={13} />} text={formatRuntime(data.runtime)} />}
            {type === 'tv' && data.number_of_seasons && <MetaPill icon={<Clock size={13} />} text={formatSeasons(data.number_of_seasons)} />}
            {type === 'book' && data.author && <MetaPill icon={<BookOpen size={13} />} text={data.author} />}
            {genres.slice(0, 3).map((g) => <MetaPill key={g.id} text={g.name} />)}
          </div>

          {/* Overview */}
          <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>{overview}</p>

          {/* Cast */}
          {cast.length > 0 && <CastRow cast={cast} />}

          {/* Streaming providers */}
          {type !== 'book' && <StreamingBadges type={type} id={data.id} />}

          {/* Similar rail */}
          {similar.length > 0 && <SimilarRail items={similar} onSelect={onSelectSimilar} />}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 mt-auto">
            <Button variant="primary" onClick={onPickAnother} aria-label="Pick another (Space or →)">
              <RefreshCw size={15} /> Pick Another
            </Button>
            <Button variant={isFavorite ? 'ghost' : 'accent'} onClick={handleSave} aria-label="Save to favorites (S)">
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={handleWatched} aria-label="Mark as watched (W)">
              <Eye size={15} /> Watched
            </Button>
            {trailer && (
              <Button variant="danger" onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')} aria-label="Watch trailer">
                <PlayCircle size={15} /> Trailer
              </Button>
            )}
            <Button variant="ghost" onClick={handleShare} aria-label="Share (copy link)">
              <Share2 size={15} /> Share
            </Button>
            {type === 'book' && data.url && (
              <Button variant="outline" onClick={() => window.open(data.url, '_blank')} aria-label="Open on Open Library">
                <ExternalLink size={15} /> Open Library
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetaPill({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)' }}>
      {icon}
      {text}
    </div>
  );
}

function getCertification(data, type) {
  if (type === 'movie') {
    const us = data.release_dates?.results?.find((r) => r.iso_3166_1 === 'US');
    return us?.release_dates?.find((r) => r.certification)?.certification || null;
  }
  if (type === 'tv') {
    const us = data.content_ratings?.results?.find((r) => r.iso_3166_1 === 'US');
    return us?.rating || null;
  }
  return null;
}
