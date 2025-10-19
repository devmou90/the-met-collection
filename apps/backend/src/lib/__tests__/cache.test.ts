import { describe, expect, it, vi } from 'vitest';
import { TTLCache } from '../cache';

describe('TTLCache', () => {
  it('returns undefined for missing values', () => {
    const cache = new TTLCache<string, number>(1000);

    expect(cache.get('missing')).toBeUndefined();
  });

  it('returns cached value before expiry', () => {
    const cache = new TTLCache<string, number>(1000);

    cache.set('answer', 42);

    expect(cache.get('answer')).toBe(42);
  });

  it('expires values after ttl', () => {
    const cache = new TTLCache<string, number>(1000);
    vi.useFakeTimers();

    cache.set('expiring', 123);

    vi.advanceTimersByTime(1001);

    expect(cache.get('expiring')).toBeUndefined();

    vi.useRealTimers();
  });

  it('deletes entries explicitly', () => {
    const cache = new TTLCache<string, number>(1000);

    cache.set('temp', 1);
    cache.delete('temp');

    expect(cache.get('temp')).toBeUndefined();
  });

  it('clears all entries', () => {
    const cache = new TTLCache<string, number>(1000);

    cache.set('a', 1);
    cache.set('b', 2);

    cache.clear();

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
