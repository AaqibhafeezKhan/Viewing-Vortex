/**
 * Fetch with exponential backoff retry logic.
 * Delays: 100ms, 200ms, 400ms
 */
export async function fetchWithRetry(url, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      if (response.status === 401) {
        throw Object.assign(new Error('Invalid API key. Please check your TMDB credentials.'), { type: 'AUTH_ERROR', status: 401 });
      }
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '10', 10);
        throw Object.assign(new Error(`Rate limit exceeded. Retry after ${retryAfter}s.`), { type: 'RATE_LIMIT', retryAfter, status: 429 });
      }
      if (response.status === 404) {
        throw Object.assign(new Error('Resource not found.'), { type: 'NOT_FOUND', status: 404 });
      }
      if (!response.ok) {
        throw Object.assign(new Error(`HTTP error ${response.status}`), { type: 'HTTP_ERROR', status: response.status });
      }

      return await response.json();
    } catch (err) {
      lastError = err;
      // Don't retry auth, rate limit or not-found errors
      if (err.type === 'AUTH_ERROR' || err.type === 'RATE_LIMIT' || err.type === 'NOT_FOUND') {
        throw err;
      }
      if (attempt < retries) {
        const delay = 100 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}
