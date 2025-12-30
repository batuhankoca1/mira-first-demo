import { ClothingCategory } from '@/types/clothing';

export interface WardrobeItem {
  id: string;
  category: ClothingCategory;
  src: string;
}

// Demo wardrobe with transparent PNG images
export const WARDROBE_ITEMS: WardrobeItem[] = [
  // ========== TOPS (1) ==========
  { id: 'top-1', category: 'tops', src: '/demo-items/tops/black-tshirt.png' },

  // ========== BOTTOMS (1) ==========
  { id: 'bottom-1', category: 'bottoms', src: '/demo-items/bottoms/cargo-pants.png' },
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
