import { useState, useEffect, useCallback } from 'react';
import { ClothingItem, ClothingCategory } from '@/types/clothing';

const STORAGE_KEY = 'mira-closet';

export function useCloset() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItems(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        })));
      } catch (e) {
        console.error('Failed to parse closet data:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveItems = useCallback((newItems: ClothingItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
  }, []);

  const addItem = useCallback((imageUrl: string, category: ClothingCategory) => {
    const newItem: ClothingItem = {
      id: crypto.randomUUID(),
      imageUrl,
      category,
      createdAt: new Date(),
    };
    saveItems([...items, newItem]);
    return newItem;
  }, [items, saveItems]);

  const removeItem = useCallback((id: string) => {
    saveItems(items.filter(item => item.id !== id));
  }, [items, saveItems]);

  const getItemsByCategory = useCallback((category: ClothingCategory) => {
    return items.filter(item => item.category === category);
  }, [items]);

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    getItemsByCategory,
  };
}
