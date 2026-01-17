import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export interface ListedItem {
  itemId: string;
  price: number;
  condition: 'new' | 'like-new' | 'good';
  description?: string;
  listedAt: Date;
}

interface ListedItemsContextValue {
  listedItems: Record<string, ListedItem>;
  isListed: (itemId: string) => boolean;
  listItem: (itemId: string, data: Omit<ListedItem, 'itemId' | 'listedAt'>) => void;
  unlistItem: (itemId: string) => void;
  getListingInfo: (itemId: string) => ListedItem | null;
}

const STORAGE_KEY = 'mira-listed-items';

const ListedItemsContext = createContext<ListedItemsContextValue | null>(null);

export function ListedItemsProvider({ children }: { children: ReactNode }) {
  const [listedItems, setListedItems] = useState<Record<string, ListedItem>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const restored: Record<string, ListedItem> = {};
        for (const [key, value] of Object.entries(parsed)) {
          const item = value as any;
          restored[key] = {
            ...item,
            listedAt: new Date(item.listedAt),
          };
        }
        setListedItems(restored);
      }
    } catch (e) {
      console.error('[ListedItems] Failed to parse stored data:', e);
    }
  }, []);

  // Persist to localStorage
  const persist = useCallback((items: Record<string, ListedItem>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[ListedItems] Failed to persist:', e);
    }
  }, []);

  const isListed = useCallback((itemId: string) => {
    return !!listedItems[itemId];
  }, [listedItems]);

  const listItem = useCallback((itemId: string, data: Omit<ListedItem, 'itemId' | 'listedAt'>) => {
    setListedItems((prev) => {
      const next = {
        ...prev,
        [itemId]: {
          itemId,
          ...data,
          listedAt: new Date(),
        },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const unlistItem = useCallback((itemId: string) => {
    setListedItems((prev) => {
      const next = { ...prev };
      delete next[itemId];
      persist(next);
      return next;
    });
  }, [persist]);

  const getListingInfo = useCallback((itemId: string): ListedItem | null => {
    return listedItems[itemId] || null;
  }, [listedItems]);

  const value = useMemo<ListedItemsContextValue>(() => ({
    listedItems,
    isListed,
    listItem,
    unlistItem,
    getListingInfo,
  }), [listedItems, isListed, listItem, unlistItem, getListingInfo]);

  return (
    <ListedItemsContext.Provider value={value}>
      {children}
    </ListedItemsContext.Provider>
  );
}

export function useListedItems() {
  const ctx = useContext(ListedItemsContext);
  if (!ctx) throw new Error('useListedItems must be used within ListedItemsProvider');
  return ctx;
}
