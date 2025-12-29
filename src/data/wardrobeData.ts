import { ClothingCategory } from '@/types/clothing';

export interface WardrobeItem {
  id: string;
  category: ClothingCategory;
  src: string;
}

// Photorealistic wardrobe (background removed) - Tops, Bottoms, Bags (4 items each)
export const WARDROBE_ITEMS: WardrobeItem[] = [
  // ========== TOPS (4) - Transparent cutouts ==========
  { id: 'top-1', category: 'tops', src: '/demo-items/tops/top1-cut.png' },
  { id: 'top-2', category: 'tops', src: '/demo-items/tops/top2-cut.png' },
  { id: 'top-3', category: 'tops', src: '/demo-items/tops/top3-cut.png' },
  { id: 'top-4', category: 'tops', src: '/demo-items/tops/top4-cut.png' },

  // ========== BOTTOMS (4) - Transparent cutouts ==========
  { id: 'bottom-1', category: 'bottoms', src: '/demo-items/bottoms/bottom1-cut.png' },
  { id: 'bottom-2', category: 'bottoms', src: '/demo-items/bottoms/bottom2-cut.png' },
  { id: 'bottom-3', category: 'bottoms', src: '/demo-items/bottoms/bottom3-cut.png' },
  { id: 'bottom-4', category: 'bottoms', src: '/demo-items/bottoms/bottom4-cut.png' },

  // ========== BAGS (4) - Transparent cutouts ==========
  { id: 'bag-1', category: 'bags', src: '/demo-items/bags/bag1-cut.png' },
  { id: 'bag-2', category: 'bags', src: '/demo-items/bags/bag2-cut.png' },
  { id: 'bag-3', category: 'bags', src: '/demo-items/bags/bag3-cut.png' },
  { id: 'bag-4', category: 'bags', src: '/demo-items/bags/bag4-cut.png' },
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
