import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'mira-favorites';

export interface FavoriteItem {
  id: number;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const parsed: FavoriteItem[] = JSON.parse(saved);
        setFavorites(new Set(parsed.map(item => item.id)));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: Set<number>) => {
    const items: FavoriteItem[] = Array.from(newFavorites).map(id => ({
      id,
      addedAt: Date.now(),
    }));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      saveFavorites(newSet);
      return newSet;
    });
  }, [saveFavorites]);

  const addFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      if (prev.has(id)) return prev;
      const newSet = new Set(prev);
      newSet.add(id);
      saveFavorites(newSet);
      return newSet;
    });
  }, [saveFavorites]);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      if (!prev.has(id)) return prev;
      const newSet = new Set(prev);
      newSet.delete(id);
      saveFavorites(newSet);
      return newSet;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((id: number) => {
    return favorites.has(id);
  }, [favorites]);

  const getFavoriteIds = useCallback(() => {
    return Array.from(favorites);
  }, [favorites]);

  const getFavoriteCount = useCallback(() => {
    return favorites.size;
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteIds,
    getFavoriteCount,
  };
}
