import { ExternalLink } from 'lucide-react';
import { TMDB_IMAGE_BASE } from '../../api/constants.js';

export default function CastRow({ cast = [] }) {
  const top = cast.slice(0, 5);
  if (!top.length) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
        Top Cast
      </p>
      <div className="scroll-rail">
        {top.map((person) => (
          <a
            key={person.id}
            href={`https://www.themoviedb.org/person/${person.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 min-w-[60px] group"
            aria-label={`${person.name} as ${person.character}`}
          >
            <div className="relative">
              {person.profile_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE}/w185${person.profile_path}`}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  👤
                </div>
              )}
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                <ExternalLink size={12} className="text-white" />
              </div>
            </div>
            <span className="text-[10px] text-center leading-tight w-14 truncate font-medium" style={{ color: 'var(--text-primary)' }}>
              {person.name}
            </span>
            <span className="text-[9px] text-center w-14 truncate" style={{ color: 'var(--text-secondary)' }}>
              {person.character}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
