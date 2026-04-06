import { describe, it, expect } from 'vitest';
import { MOODS, getMoodById } from '../../utils/moodMap.js';

describe('moodMap', () => {
  it('has exactly 8 moods', () => {
    expect(MOODS).toHaveLength(8);
  });

  it('each mood has required fields', () => {
    MOODS.forEach((mood) => {
      expect(mood).toHaveProperty('id');
      expect(mood).toHaveProperty('emoji');
      expect(mood).toHaveProperty('label');
      expect(mood).toHaveProperty('genres');
      expect(mood).toHaveProperty('minRating');
      expect(Array.isArray(mood.genres)).toBe(true);
      expect(mood.genres.length).toBeGreaterThan(0);
      expect(typeof mood.minRating).toBe('number');
    });
  });

  it('getMoodById returns correct mood', () => {
    const mood = getMoodById('drama');
    expect(mood).toBeDefined();
    expect(mood.label).toBe('Drama');
    expect(mood.genres).toContain(18);
    expect(mood.minRating).toBe(7.0);
  });

  it('getMoodById returns undefined for unknown id', () => {
    expect(getMoodById('nonexistent')).toBeUndefined();
  });

  it('all minRatings are between 0 and 10', () => {
    MOODS.forEach((mood) => {
      expect(mood.minRating).toBeGreaterThanOrEqual(0);
      expect(mood.minRating).toBeLessThanOrEqual(10);
    });
  });
});
