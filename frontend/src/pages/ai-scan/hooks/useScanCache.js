import { useCallback } from 'react';
import { useAuth } from '../../../middleware/AuthContext'; // adjust path if different

const CACHE_PREFIX = 'poultryscan_cache_';

function getCacheKey(userId, farmId) {
  return `${CACHE_PREFIX}${userId}_${farmId}`;
}

// Standalone (not a hook) so it can be called inside a useState initializer.
// Needs userId explicitly since it can't call useAuth() itself.
export function getCachedScan(userId, farmId) {
  if (!userId || !farmId) return null;

  try {
    const raw = localStorage.getItem(getCacheKey(userId, farmId));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to read scan cache:', err);
    return null;
  }
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useScanCache(farmId) {
  const { user } = useAuth();
  const userId = user?.id;

  const saveCache = useCallback((data) => {
    if (!userId || !farmId) return;

    try {
      localStorage.setItem(getCacheKey(userId, farmId), JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save scan cache:', err);
    }
  }, [userId, farmId]);

  const clearCache = useCallback(() => {
    if (!userId || !farmId) return;

    try {
      localStorage.removeItem(getCacheKey(userId, farmId));
    } catch (err) {
      console.error('Failed to clear scan cache:', err);
    }
  }, [userId, farmId]);

  return { saveCache, clearCache };
}