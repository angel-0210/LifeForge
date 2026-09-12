/**
 * LifeForge Multi-Layer Client Cache & Request Deduplication Engine
 *
 * Provides:
 * 1. In-flight Request Deduplication (prevents duplicate concurrent API calls)
 * 2. In-Memory & LocalStorage Multi-Layer Caching with Data Classification
 * 3. Stale-while-revalidate & targeted cache invalidation
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export const TTL = {
  STATIC: 24 * 60 * 60 * 1000, // 24 hours (e.g. attribute definitions)
  SEMI_STATIC: 15 * 60 * 1000, // 15 minutes (e.g. reward catalog)
  USER_DATA: 30 * 1000,       // 30 seconds (e.g. profile, tasks, inventory, metrics)
};

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

const STORAGE_PREFIX = 'lifeforge_cache_';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Reads from memory cache or localStorage fallback
 */
export function getCachedData<T>(key: string): T | null {
  const now = Date.now();

  // 1. Check Memory Cache first
  const memEntry = memoryCache.get(key);
  if (memEntry) {
    if (now - memEntry.timestamp < memEntry.ttlMs) {
      return memEntry.data as T;
    } else {
      memoryCache.delete(key);
    }
  }

  // 2. Fallback to LocalStorage for persistence across page loads
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw) {
        try {
          const entry: CacheEntry<T> = JSON.parse(raw);
          if (entry && typeof entry === 'object' && 'timestamp' in entry && 'data' in entry) {
            if (now - entry.timestamp < entry.ttlMs) {
              memoryCache.set(key, entry);
              return entry.data;
            } else {
              localStorage.removeItem(STORAGE_PREFIX + key);
            }
          }
        } catch (_jsonErr) {
          localStorage.removeItem(STORAGE_PREFIX + key);
        }
      }
    } catch (_e) {
      // Ignore storage errors
    }
  }

  return null;
}

/**
 * Writes data to memory cache and optionally localStorage for persistence
 */
export function setCachedData<T>(key: string, data: T, ttlMs: number, persistInStorage = true): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttlMs,
  };

  memoryCache.set(key, entry);

  if (persistInStorage && isBrowser()) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch (_e) {
      // Ignore storage quota errors
    }
  }
}

/**
 * Deduplicates in-flight promises and uses caching strategy
 */
export async function deduplicateRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = TTL.USER_DATA,
  persistInStorage = true
): Promise<T> {
  // Check valid cache first
  const cached = getCachedData<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Check if identical request is currently in-flight
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  // Execute request & store promise
  const requestPromise = (async () => {
    try {
      const result = await fetcher();
      setCachedData<T>(key, result, ttlMs, persistInStorage);
      return result;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
}

/**
 * Invalidates specific cache key or matching pattern
 */
export function invalidateCache(keyOrPattern: string | RegExp): void {
  if (typeof keyOrPattern === 'string') {
    memoryCache.delete(keyOrPattern);
    if (isBrowser()) {
      try {
        localStorage.removeItem(STORAGE_PREFIX + keyOrPattern);
      } catch (_e) {}
    }
  } else {
    for (const k of memoryCache.keys()) {
      if (keyOrPattern.test(k)) {
        memoryCache.delete(k);
      }
    }
    if (isBrowser()) {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const storageKey = localStorage.key(i);
          if (storageKey && storageKey.startsWith(STORAGE_PREFIX)) {
            const rawKey = storageKey.slice(STORAGE_PREFIX.length);
            if (keyOrPattern.test(rawKey)) {
              localStorage.removeItem(storageKey);
            }
          }
        }
      } catch (_e) {}
    }
  }
}

/**
 * Clears ALL memory and localStorage cache entries across auth changes
 */
export function clearAllCache(): void {
  memoryCache.clear();
  inFlightRequests.clear();
  if (isBrowser()) {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const storageKey = localStorage.key(i);
        if (storageKey && storageKey.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (_e) {}
  }
}
