import { useState } from 'react';
import { useSpecificMedia } from './useMedia.js';

export function useShareHash() {
  const [shareTarget, setShareTarget] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (!hash) return null;
    const match = hash.match(/^#(movie|tv)-(\d+)$/);
    return match ? { type: match[1], id: match[2] } : null;
  });

  const writeHash = (type, id) => {
    window.history.replaceState(null, '', `#${type}-${id}`);
  };

  const clearHash = () => {
    window.history.replaceState(null, '', window.location.pathname);
    setShareTarget(null);
  };

  return { shareTarget, writeHash, clearHash };
}

export function useShareHashLoader() {
  const { shareTarget, clearHash } = useShareHash();
  const query = useSpecificMedia(shareTarget?.type, shareTarget?.id);
  return { shareTarget, query, clearHash };
}
