import { fetchWithRetry } from '../utils/fetchWithRetry.js';
import { TMDB_API_KEY, TMDB_BASE_URL } from './constants.js';

const api = (path, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  return fetchWithRetry(url.toString());
};

export const getGenres = (type) => api(`/genre/${type}/list`, { language: 'en-US' });

export const discoverMedia = (type, filters = {}) => {
  const { genre, yearRange, minRating, language, runtime, sortBy } = filters;
  const params = {
    language: language || 'en-US',
    sort_by: sortBy || 'popularity.desc',
    include_adult: false,
    page: Math.floor(Math.random() * 100) + 1,
    'vote_average.gte': minRating || 0,
  };
  if (genre) params.with_genres = genre;
  if (yearRange) {
    if (type === 'movie') {
      params['primary_release_date.gte'] = `${yearRange[0]}-01-01`;
      params['primary_release_date.lte'] = `${yearRange[1]}-12-31`;
    } else {
      params['first_air_date.gte'] = `${yearRange[0]}-01-01`;
      params['first_air_date.lte'] = `${yearRange[1]}-12-31`;
    }
  }
  if (runtime === 'short') params['with_runtime.lte'] = 60;
  if (runtime === 'standard') { params['with_runtime.gte'] = 60; params['with_runtime.lte'] = 120; }
  if (runtime === 'epic') params['with_runtime.gte'] = 150;
  return api(`/discover/${type}`, params);
};

export const getMediaDetails = (type, id, language = 'en-US') =>
  api(`/${type}/${id}`, { language, append_to_response: 'credits,videos,release_dates,content_ratings,similar,external_ids' });

export const getWatchProviders = (type, id, region = 'IN') =>
  api(`/${type}/${id}/watch/providers`).then((d) => d.results?.[region] || null);

export const searchMulti = (query, language = 'en-US') =>
  api('/search/multi', { query, language, include_adult: false });

export const getMovieById = (id, language = 'en-US') =>
  api(`/movie/${id}`, { language, append_to_response: 'credits,videos,release_dates,similar' });

export const getTVById = (id, language = 'en-US') =>
  api(`/tv/${id}`, { language, append_to_response: 'credits,videos,content_ratings,similar' });

export const getCollection = (id) => api(`/collection/${id}`);

export const getVideos = (type, id) => api(`/${type}/${id}/videos`);
