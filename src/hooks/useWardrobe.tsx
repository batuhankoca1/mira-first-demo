import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import type { ClothingCategory, ClothingItem, AnchorType } from "@/types/clothing";
import { CATEGORY_ANCHORS } from "@/types/clothing";

export type Wardrobe = Record<ClothingCategory, ClothingItem[]>;

const STORAGE_KEY = "mira-wardrobe-v2";

const CATEGORIES: ClothingCategory[] = [
  "tops",
  "bottoms",
  "dresses",
  "jackets",
  "shoes",
  "bags",
  "accessories",
];

function createEmptyWardrobe(): Wardrobe {
  return {
    tops: [],
    bottoms: [],
    dresses: [],
    jackets: [],
    shoes: [],
    bags: [],
    accessories: [],
  };
}

function normalizeWardrobe(input: any): Wardrobe {
  const base = createEmptyWardrobe();
  if (!input || typeof input !== "object") return base;

  for (const cat of CATEGORIES) {
    const arr = Array.isArray(input[cat]) ? input[cat] : [];
    const defaults = CATEGORY_ANCHORS[cat];
    
    base[cat] = arr
      .filter(Boolean)
      .map((item: any) => ({
        id: String(item.id ?? crypto.randomUUID()),
        imageUrl: String(item.imageUrl ?? item.imageUri ?? ""),
        category: cat,
        createdAt: new Date(item.createdAt ?? Date.now()),
        anchorType: (item.anchorType as AnchorType) ?? defaults.anchorType,
        anchorOffset: item.anchorOffset ?? { ...defaults.anchorOffset },
        scale: typeof item.scale === "number" ? item.scale : defaults.scale,
      }))
      .filter((i: ClothingItem) => !!i.imageUrl);
  }

  return base;
}

type WardrobeContextValue = {
  wardrobe: Wardrobe;
  items: ClothingItem[];
  isLoading: boolean;
  addItem: (
    imageUrl: string,
    category: ClothingCategory,
    overrides?: { scale?: number; anchorOffset?: { x: number; y: number } }
  ) => ClothingItem;
  removeItem: (id: string) => void;
  getItemsByCategory: (category: ClothingCategory) => ClothingItem[];
};

const WardrobeContext = createContext<WardrobeContextValue | null>(null);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [wardrobe, setWardrobe] = useState<Wardrobe>(() => createEmptyWardrobe());
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("[Wardrobe] Loading from storage, found:", !!stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = normalizeWardrobe(parsed);
        console.log("[Wardrobe] Loaded items:", CATEGORIES.map(c => `${c}: ${normalized[c].length}`).join(", "));
        setWardrobe(normalized);
      }
    } catch (e) {
      console.error("[Wardrobe] Failed to parse stored data:", e);
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: Wardrobe) => {
    try {
      const serializable: Record<string, any[]> = {};
      for (const cat of CATEGORIES) {
        serializable[cat] = next[cat].map(item => ({
          ...item,
          createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        }));
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
      console.log("[Wardrobe] Persisted to storage");
    } catch (e) {
      console.error("[Wardrobe] Failed to persist:", e);
    }
  }, []);

  const addItem = useCallback(
    (
      imageUrl: string,
      category: ClothingCategory,
      overrides?: { scale?: number; anchorOffset?: { x: number; y: number } }
    ): ClothingItem => {
      const defaults = CATEGORY_ANCHORS[category];

      const newItem: ClothingItem = {
        id: crypto.randomUUID(),
        imageUrl,
        category,
        createdAt: new Date(),
        anchorType: defaults.anchorType,
        anchorOffset: overrides?.anchorOffset ? { ...overrides.anchorOffset } : { ...defaults.anchorOffset },
        scale: typeof overrides?.scale === "number" ? overrides.scale : defaults.scale,
      };

      console.log("[Wardrobe] Adding item:", newItem.id, "to", category);

      setWardrobe((prev) => {
        const next: Wardrobe = {
          ...prev,
          [category]: [newItem, ...(prev[category] ?? [])],
        };
        persist(next);
        return next;
      });

      return newItem;
    },
    [persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      console.log("[Wardrobe] Removing item:", id);
      setWardrobe((prev) => {
        const next: Wardrobe = createEmptyWardrobe();
        for (const cat of CATEGORIES) {
          next[cat] = (prev[cat] ?? []).filter((i) => i.id !== id);
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const getItemsByCategory = useCallback(
    (category: ClothingCategory) => wardrobe[category] ?? [],
    [wardrobe]
  );

  const items = useMemo(
    () => CATEGORIES.flatMap((cat) => wardrobe[cat] ?? []),
    [wardrobe]
  );

  const value = useMemo<WardrobeContextValue>(
    () => ({
      wardrobe,
      items,
      isLoading,
      addItem,
      removeItem,
      getItemsByCategory,
    }),
    [wardrobe, items, isLoading, addItem, removeItem, getItemsByCategory]
  );

  return <WardrobeContext.Provider value={value}>{children}</WardrobeContext.Provider>;
}

export function useWardrobe() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error("useWardrobe must be used within WardrobeProvider");
  return ctx;
}
