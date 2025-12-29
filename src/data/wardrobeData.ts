import { ClothingCategory } from '@/types/clothing';

export interface WardrobeItem {
  id: string;
  category: ClothingCategory;
  src: string;
}

// Photorealistic wardrobe - Tops, Bottoms, Bags (4 items each)
export const WARDROBE_ITEMS: WardrobeItem[] = [
  // ========== TOPS (4) - Real clothing photos ==========
  { id: 'top-1', category: 'tops', src: '/demo-items/tops/top1-v2.png' },
  { id: 'top-2', category: 'tops', src: '/demo-items/tops/top2-v2.png' },
  { id: 'top-3', category: 'tops', src: '/demo-items/tops/top3-v2.png' },
  { id: 'top-4', category: 'tops', src: '/demo-items/tops/top4-v2.png' },

  // ========== BOTTOMS (4) - Real clothing photos ==========
  { id: 'bottom-1', category: 'bottoms', src: '/demo-items/bottoms/bottom1-v2.png' },
  { id: 'bottom-2', category: 'bottoms', src: '/demo-items/bottoms/bottom2-v2.png' },
  { id: 'bottom-3', category: 'bottoms', src: '/demo-items/bottoms/bottom3-v2.png' },
  { id: 'bottom-4', category: 'bottoms', src: '/demo-items/bottoms/bottom4-v2.png' },

  // ========== BAGS (4) - Real product photos ==========
  { id: 'bag-1', category: 'bags', src: '/demo-items/bags/bag1-v2.png' },
  { id: 'bag-2', category: 'bags', src: '/demo-items/bags/bag2-v2.png' },
  { id: 'bag-3', category: 'bags', src: '/demo-items/bags/bag3-v2.png' },
  { id: 'bag-4', category: 'bags', src: '/demo-items/bags/bag4-v2.png' },
];

// Helper to get items by category
export const getItemsByCategory = (category: ClothingCategory): WardrobeItem[] => {
  return WARDROBE_ITEMS.filter((item) => item.category === category);
};

// Get item by ID
export const getItemById = (id: string): WardrobeItem | undefined => {
  return WARDROBE_ITEMS.find((item) => item.id === id);
};

// Category render order (bottom to top z-index)
export const CATEGORY_ORDER: ClothingCategory[] = ['bottoms', 'tops', 'bags'];
