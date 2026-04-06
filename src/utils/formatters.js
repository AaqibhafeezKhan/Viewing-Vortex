export function formatRuntime(minutes) {
  if (typeof minutes !== 'number' || minutes < 1) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${minutes}m`;
}

export function formatSeasons(seasons) {
  if (!seasons || seasons < 1) return 'N/A';
  return `${seasons} ${seasons === 1 ? 'season' : 'seasons'}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatYear(dateStr) {
  if (!dateStr) return 'N/A';
  return dateStr.substring(0, 4);
}

export function formatRating(rating) {
  if (typeof rating !== 'number') return 'N/A';
  return rating.toFixed(1);
}

export function formatTotalRuntime(minutesTotal) {
  if (!minutesTotal) return '0h';
  const h = Math.floor(minutesTotal / 60);
  return `${h}h`;
}

export function getDecade(dateStr) {
  if (!dateStr) return 'Unknown';
  const year = parseInt(dateStr.substring(0, 4), 10);
  return `${Math.floor(year / 10) * 10}s`;
}
