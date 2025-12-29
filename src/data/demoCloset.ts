import { ClothingCategory } from '@/types/clothing';

export interface DemoItem {
  id: string;
  category: ClothingCategory;
  src: string;
  width: number;
  anchorX: number;
  anchorY: number;
  offsetX: number;
  offsetY: number;
}

// Container reference: 300x600
// All positions are absolute pixel values within this container
// Anchors per category (center point):
// - Tops:      x=150, y=170, width=220
// - Jackets:   x=150, y=170, width=240
// - Dresses:   x=150, y=180, width=240
// - Bottoms:   x=150, y=310, width=220
// - Shoes:     x=150, y=480, width=200
// - Bags:      x=230, y=250, width=120
// - Accessories: default width=80, position varies

export const DEMO_ITEMS: DemoItem[] = [
  // ========== TOPS (4) ==========
  {
    id: 'top-1',
    category: 'tops',
    src: '/demo-items/tops/top1.png',
    width: 180,
    anchorX: 150,
    anchorY: 170,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'top-2',
    category: 'tops',
    src: '/demo-items/tops/top2.png',
    width: 175,
    anchorX: 150,
    anchorY: 165,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'top-3',
    category: 'tops',
    src: '/demo-items/tops/top3.png',
    width: 185,
    anchorX: 150,
    anchorY: 172,
    offsetX: 0,
    offsetY: -2,
  },
  {
    id: 'top-4',
    category: 'tops',
    src: '/demo-items/tops/top4.png',
    width: 160,
    anchorX: 150,
    anchorY: 168,
    offsetX: 0,
    offsetY: 2,
  },

  // ========== BOTTOMS (4) ==========
  {
    id: 'bottom-1',
    category: 'bottoms',
    src: '/demo-items/bottoms/bottom1.png',
    width: 160,
    anchorX: 150,
    anchorY: 310,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'bottom-2',
    category: 'bottoms',
    src: '/demo-items/bottoms/bottom2.png',
    width: 140,
    anchorX: 150,
    anchorY: 295,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'bottom-3',
    category: 'bottoms',
    src: '/demo-items/bottoms/bottom3.png',
    width: 155,
    anchorX: 150,
    anchorY: 315,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'bottom-4',
    category: 'bottoms',
    src: '/demo-items/bottoms/bottom4.png',
    width: 150,
    anchorX: 150,
    anchorY: 300,
    offsetX: 0,
    offsetY: 0,
  },

  // ========== DRESSES (4) ==========
  {
    id: 'dress-1',
    category: 'dresses',
    src: '/demo-items/dresses/dress1.png',
    width: 200,
    anchorX: 150,
    anchorY: 240,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'dress-2',
    category: 'dresses',
    src: '/demo-items/dresses/dress2.png',
    width: 180,
    anchorX: 150,
    anchorY: 235,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'dress-3',
    category: 'dresses',
    src: '/demo-items/dresses/dress3.png',
    width: 190,
    anchorX: 150,
    anchorY: 245,
    offsetX: 0,
    offsetY: -5,
  },
  {
    id: 'dress-4',
    category: 'dresses',
    src: '/demo-items/dresses/dress4.png',
    width: 180,
    anchorX: 150,
    anchorY: 260,
    offsetX: 0,
    offsetY: 0,
  },

  // ========== JACKETS (4) ==========
  {
    id: 'jacket-1',
    category: 'jackets',
    src: '/demo-items/jackets/jacket1.png',
    width: 200,
    anchorX: 150,
    anchorY: 170,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'jacket-2',
    category: 'jackets',
    src: '/demo-items/jackets/jacket2.png',
    width: 195,
    anchorX: 150,
    anchorY: 168,
    offsetX: 0,
    offsetY: 3,
  },
  {
    id: 'jacket-3',
    category: 'jackets',
    src: '/demo-items/jackets/jacket3.png',
    width: 180,
    anchorX: 150,
    anchorY: 175,
    offsetX: 0,
    offsetY: -3,
  },
  {
    id: 'jacket-4',
    category: 'jackets',
    src: '/demo-items/jackets/jacket4.png',
    width: 210,
    anchorX: 150,
    anchorY: 165,
    offsetX: 0,
    offsetY: 0,
  },

  // ========== SHOES (4) ==========
  {
    id: 'shoes-1',
    category: 'shoes',
    src: '/demo-items/shoes/shoe1.png',
    width: 140,
    anchorX: 150,
    anchorY: 520,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'shoes-2',
    category: 'shoes',
    src: '/demo-items/shoes/shoe2.png',
    width: 120,
    anchorX: 150,
    anchorY: 510,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'shoes-3',
    category: 'shoes',
    src: '/demo-items/shoes/shoe3.png',
    width: 130,
    anchorX: 150,
    anchorY: 505,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'shoes-4',
    category: 'shoes',
    src: '/demo-items/shoes/shoe4.png',
    width: 120,
    anchorX: 150,
    anchorY: 525,
    offsetX: 0,
    offsetY: 0,
  },

  // ========== BAGS (4) ==========
  {
    id: 'bag-1',
    category: 'bags',
    src: '/demo-items/bags/bag1.png',
    width: 100,
    anchorX: 240,
    anchorY: 280,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'bag-2',
    category: 'bags',
    src: '/demo-items/bags/bag2.png',
    width: 90,
    anchorX: 235,
    anchorY: 285,
    offsetX: 5,
    offsetY: 5,
  },
  {
    id: 'bag-3',
    category: 'bags',
    src: '/demo-items/bags/bag3.png',
    width: 95,
    anchorX: 242,
    anchorY: 270,
    offsetX: -2,
    offsetY: -5,
  },
  {
    id: 'bag-4',
    category: 'bags',
    src: '/demo-items/bags/bag4.png',
    width: 90,
    anchorX: 238,
    anchorY: 275,
    offsetX: 0,
    offsetY: 0,
  },

  // ========== ACCESSORIES (4) ==========
  {
    id: 'accessory-1',
    category: 'accessories',
    src: '/demo-items/accessories/acc1.png',
    width: 80,
    anchorX: 150,
    anchorY: 130,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'accessory-2',
    category: 'accessories',
    src: '/demo-items/accessories/acc2.png',
    width: 90,
    anchorX: 150,
    anchorY: 55,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'accessory-3',
    category: 'accessories',
    src: '/demo-items/accessories/acc3.png',
    width: 100,
    anchorX: 150,
    anchorY: 130,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'accessory-4',
    category: 'accessories',
    src: '/demo-items/accessories/acc4.png',
    width: 120,
    anchorX: 150,
    anchorY: 40,
    offsetX: 0,
    offsetY: 0,
  },
];

// Helper to get items by category
export const getItemsByCategory = (category: ClothingCategory): DemoItem[] => {
  return DEMO_ITEMS.filter((item) => item.category === category);
};

// Get item by ID
export const getItemById = (id: string): DemoItem | undefined => {
  return DEMO_ITEMS.find((item) => item.id === id);
};

// All categories in render order (bottom to top z-index)
export const CATEGORY_ORDER: ClothingCategory[] = [
  'shoes',
  'bottoms',
  'tops',
  'dresses',
  'jackets',
  'bags',
  'accessories',
];
