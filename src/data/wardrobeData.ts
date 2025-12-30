import { ClothingCategory } from '@/types/clothing';

export interface WardrobeItem {
  id: string;
  category: ClothingCategory;
  src: string;
}

// Demo wardrobe with transparent PNG images
// Using standardized 500x500 canvas approach
export const WARDROBE_ITEMS: WardrobeItem[] = [
  // ========== TOPS ==========
  { id: 'top-1', category: 'tops', src: '/demo-items/tops/black-tshirt.png' },
  { id: 'top-2', category: 'tops', src: '/demo-items/tops/white-crop-top.png' },
  { id: 'top-3', category: 'tops', src: '/demo-items/tops/black-blazer.png' },
  { id: 'top-4', category: 'tops', src: '/demo-items/tops/beige-sweater.webp' },
  { id: 'top-5', category: 'tops', src: '/demo-items/tops/blue-sweater.png' },
  { id: 'top-6', category: 'tops', src: '/demo-items/tops/denim-jacket.png' },
  { id: 'top-7', category: 'tops', src: '/demo-items/tops/black-tank-top.png' },
  { id: 'top-8', category: 'tops', src: '/demo-items/tops/red-satin-blouse.png' },
  { id: 'top-9', category: 'tops', src: '/demo-items/tops/charcoal-hoodie.png' },
  { id: 'top-10', category: 'tops', src: '/demo-items/tops/cream-bralette.webp' },
  { id: 'top-11', category: 'tops', src: '/demo-items/tops/white-tshirt.png' },

  // ========== BOTTOMS ==========
  { id: 'bottom-1', category: 'bottoms', src: '/demo-items/bottoms/cargo-pants.png' },
  { id: 'bottom-2', category: 'bottoms', src: '/demo-items/bottoms/black-pleated-skirt.png' },
  { id: 'bottom-3', category: 'bottoms', src: '/demo-items/bottoms/black-leggings.png' },
  { id: 'bottom-4', category: 'bottoms', src: '/demo-items/bottoms/beige-wide-skirt.png' },
  { id: 'bottom-5', category: 'bottoms', src: '/demo-items/bottoms/red-midi-skirt.png' },
  { id: 'bottom-6', category: 'bottoms', src: '/demo-items/bottoms/red-mini-skirt.webp' },
  { id: 'bottom-7', category: 'bottoms', src: '/demo-items/bottoms/denim-skirt.png' },
  { id: 'bottom-8', category: 'bottoms', src: '/demo-items/bottoms/leather-skirt.webp' },
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
