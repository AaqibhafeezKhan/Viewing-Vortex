import { useEffect, useState } from 'react';
import { useSpecificMedia } from './useMedia.js';

/**
 * Reads #type-{id} hash on mount and returns (type, id).
 * Also provides a function to write the hash on share.
 */
export function useShareHash() {
  const [shareTarget, setShareTarget] = useState(null); // { type, id }

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    // Expect format: #movie-12345 or #tv-67890
    const match = hash.match(/^#(movie|tv)-(\d+)$/);
    if (match) setShareTarget({ type: match[1], id: match[2] });
  }, []);

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
