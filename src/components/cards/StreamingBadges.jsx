import { useState } from 'react';
import { useWatchProviders } from '../../hooks/useMedia.js';
import useStore from '../../store/useStore.js';
import { TMDB_IMAGE_BASE } from '../../api/constants.js';
import Spinner from '../ui/Spinner.jsx';

const TABS = [
  { key: 'flatrate', label: 'Stream' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
];

export default function StreamingBadges({ type, id }) {
  const { filters: { region } } = useStore();
  const { data: providers, isLoading } = useWatchProviders(type, id, region);
  const [activeTab, setActiveTab] = useState('flatrate');

  if (isLoading) return <div className="flex items-center gap-2 mt-4"><Spinner size={16} /><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading providers…</span></div>;
  if (!providers) return <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>No streaming info available for your region.</p>;

  const availableTabs = TABS.filter((t) => providers[t.key]?.length > 0);
  if (!availableTabs.length) return <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>Not available on streaming in {region}.</p>;

  const current = providers[activeTab] || [];

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
        Where to Watch
      </p>
      {/* Tab pills */}
      <div className="flex gap-1 mb-3">
        {availableTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-3 py-1 text-xs rounded-full font-medium transition-all"
            style={{
              background: activeTab === t.key ? 'var(--secondary-color)' : 'rgba(255,255,255,0.08)',
              color: activeTab === t.key ? 'white' : 'var(--text-secondary)',
            }}
            aria-pressed={activeTab === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Provider logos */}
      <div className="flex flex-wrap gap-2">
        {current.map((p) => (
          <a
            key={p.provider_id}
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.provider_name}
            title={p.provider_name}
          >
            <img
              src={`${TMDB_IMAGE_BASE}/original${p.logo_path}`}
              alt={p.provider_name}
              className="w-8 h-8 rounded-lg object-cover ring-1 hover:scale-110 transition-transform"
              style={{ ringColor: 'rgba(255,255,255,0.2)' }}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
