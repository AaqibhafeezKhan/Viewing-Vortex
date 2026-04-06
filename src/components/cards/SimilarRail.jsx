import { useEffect, useRef } from 'react';
import { TMDB_IMAGE_BASE } from '../../api/constants.js';
import { formatYear } from '../../utils/formatters.js';

export default function SimilarRail({ items = [], onSelect }) {
  const railRef = useRef(null);

  // IntersectionObserver fade-in
  useEffect(() => {
    const cards = railRef.current?.querySelectorAll('.similar-card');
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('opacity-100'); }),
      { threshold: 0.1 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
        Similar Titles
      </p>
      <div ref={railRef} className="scroll-rail">
        {items.slice(0, 8).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="similar-card flex-shrink-0 opacity-0 transition-opacity duration-500 group rounded-lg overflow-hidden"
            style={{ width: 80 }}
            aria-label={`Load ${item.title || item.name}`}
          >
            {item.poster_path ? (
              <img
                src={`${TMDB_IMAGE_BASE}/w185${item.poster_path}`}
                alt={item.title || item.name}
                loading="lazy"
                className="w-full rounded-lg group-hover:scale-105 transition-transform duration-300"
                style={{ height: 120, objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div className="w-full rounded-lg flex items-center justify-center text-xs text-center p-1"
                style={{ height: 120, background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                No Image
              </div>
            )}
            <p className="text-[9px] text-center mt-1 truncate px-0.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>
              {item.title || item.name}
            </p>
            <p className="text-[8px] text-center" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
              {formatYear(item.release_date || item.first_air_date)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
