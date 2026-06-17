/**
 * cacheService.js
 * Simple localStorage-backed caching for API responses.
 */

const CACHE_PREFIX = 'dss_cache_';

const safeParse = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const stableStringify = (value) => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
};

export const createCacheKey = (namespace, payload) => {
  const suffix = payload === undefined || payload === null ? '' : `_${stableStringify(payload)}`;
  return `${CACHE_PREFIX}${namespace}${suffix}`;
};

export const getCachedData = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const stored = safeParse(raw);
    if (!stored || typeof stored !== 'object') {
      localStorage.removeItem(key);
      return null;
    }
    if (stored.expires && Date.now() > stored.expires) {
      localStorage.removeItem(key);
      return null;
    }
    return stored.value;
  } catch {
    return null;
  }
};

export const setCachedData = (key, value, ttlSeconds = 300) => {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // localStorage quota exceeded or disabled
  }
};

export const clearCacheByPrefix = (namespace) => {
  if (typeof window === 'undefined') return;
  try {
    const prefix = `${CACHE_PREFIX}${namespace}`;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // ignore localStorage errors
  }
};

export const clearAllCache = () => {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // ignore localStorage errors
  }
};
