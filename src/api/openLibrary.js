import { fetchWithRetry } from '../utils/fetchWithRetry.js';
import { OPEN_LIBRARY_BASE } from './constants.js';

export async function searchBooks(query) {
  const url = `${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=20`;
  return fetchWithRetry(url);
}

export async function getRandomBook() {
  const terms = ['adventure', 'mystery', 'science', 'history', 'philosophy', 'fiction', 'romance', 'thriller'];
  const q = terms[Math.floor(Math.random() * terms.length)];
  const url = `${OPEN_LIBRARY_BASE}/search.json?q=${q}&limit=50&page=${Math.floor(Math.random() * 5) + 1}`;
  const data = await fetchWithRetry(url);
  const docs = data.docs?.filter((b) => b.title && b.author_name) || [];
  if (!docs.length) throw new Error('No books found');
  const book = docs[Math.floor(Math.random() * docs.length)];
  return normalizeBook(book);
}

export function normalizeBook(book) {
  return {
    id: book.key,
    title: book.title,
    author: book.author_name?.[0] || 'Unknown',
    year: book.first_publish_year || null,
    description: book.first_sentence?.[0] || book.subject?.[0] || 'No description available',
    cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null,
    coverMedium: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
    pages: book.number_of_pages_median || null,
    subjects: book.subject?.slice(0, 4) || [],
    url: `https://openlibrary.org${book.key}`,
  };
}
