export function exportWatchlist(favorites, watched) {
  const data = { version: 1, exportedAt: new Date().toISOString(), favorites, watched };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `viewing-vortex-watchlist-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWatchlist(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.favorites || !data.watched) throw new Error('Invalid file format');
        resolve({ favorites: data.favorites, watched: data.watched });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function mergeWatchlists(existing, imported) {
  const dedup = (arr, newArr) => {
    const keys = new Set(arr.map((i) => `${i.type}-${i.data?.id}`));
    const extra = newArr.filter((i) => !keys.has(`${i.type}-${i.data?.id}`));
    return [...arr, ...extra];
  };
  return {
    favorites: dedup(existing.favorites, imported.favorites),
    watched: dedup(existing.watched, imported.watched),
  };
}
