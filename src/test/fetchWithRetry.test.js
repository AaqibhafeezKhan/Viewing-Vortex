import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithRetry } from '../../utils/fetchWithRetry.js';

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on success', async () => {
    const mockData = { results: [{ id: 1 }] };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await fetchWithRetry('https://api.example.com/test');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on network failure up to 3 times', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchWithRetry('https://api.example.com/test', 2)).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('throws AUTH_ERROR immediately on 401 without retrying', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 401,
      headers: { get: () => null },
    });

    const err = await fetchWithRetry('https://api.example.com/test').catch((e) => e);
    expect(err.type).toBe('AUTH_ERROR');
    expect(err.status).toBe(401);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('throws RATE_LIMIT on 429 without retrying', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 429,
      headers: { get: () => '5' },
    });

    const err = await fetchWithRetry('https://api.example.com/test').catch((e) => e);
    expect(err.type).toBe('RATE_LIMIT');
    expect(err.status).toBe(429);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('throws NOT_FOUND on 404 without retrying', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 404,
      headers: { get: () => null },
    });

    const err = await fetchWithRetry('https://api.example.com/test').catch((e) => e);
    expect(err.type).toBe('NOT_FOUND');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
