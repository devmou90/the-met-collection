interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TTLCache<TKey, TValue> {
  private store = new Map<TKey, CacheEntry<TValue>>();

  constructor(private readonly ttlMs: number) {}

  get(key: TKey): TValue | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: TKey, value: TValue) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  delete(key: TKey) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}
