import { ClothingCategory } from '@/types/clothing';

export interface DemoItem {
  id: string;
  category: ClothingCategory;
  imageUrl: string;
  width: number;
  anchorX: number;
  anchorY: number;
  offsetX: number;
  offsetY: number;
}

// Container reference: 300x600
// All positions are absolute pixel values within this container

export const DEMO_ITEMS: DemoItem[] = [
  // ========== TOPS (4) ==========
  {
    id: 'top-1',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    width: 180,
    anchorX: 150,
    anchorY: 160,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'top-2',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
    width: 175,
    anchorX: 150,
    anchorY: 165,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'top-3',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
    width: 185,
    anchorX: 150,
    anchorY: 158,
    offsetX: 0,
    offsetY: -2,
  },
  {
    id: 'top-4',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
    width: 178,
    anchorX: 150,
    anchorY: 162,
    offsetX: 0,
    offsetY: 2,
  },

  // ========== BOTTOMS (4) ==========
  {
    id: 'bottom-1',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    width: 160,
    anchorX: 150,
    anchorY: 320,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'bottom-2',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
    width: 155,
    anchorX: 150,
    anchorY: 315,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'bottom-3',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
    width: 165,
    anchorX: 150,
    anchorY: 318,
    offsetX: 0,
    offsetY: 2,
  },
  {
    id: 'bottom-4',
    category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop',
    width: 158,
    anchorX: 150,
    anchorY: 322,
    offsetX: 0,
    offsetY: -2,
  },

  // ========== DRESSES (4) ==========
  {
    id: 'dress-1',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop',
    width: 200,
    anchorX: 150,
    anchorY: 240,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'dress-2',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop',
    width: 195,
    anchorX: 150,
    anchorY: 245,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'dress-3',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
    width: 205,
    anchorX: 150,
    anchorY: 238,
    offsetX: 0,
    offsetY: -2,
  },
  {
    id: 'dress-4',
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
    width: 198,
    anchorX: 150,
    anchorY: 242,
    offsetX: 0,
    offsetY: 2,
  },

  // ========== JACKETS (4) ==========
  {
    id: 'jacket-1',
    category: 'jackets',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    width: 200,
    anchorX: 150,
    anchorY: 165,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'jacket-2',
    category: 'jackets',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    width: 195,
    anchorX: 150,
    anchorY: 168,
    offsetX: 0,
    offsetY: 3,
  },
  {
    id: 'jacket-3',
    category: 'jackets',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop',
    width: 205,
    anchorX: 150,
    anchorY: 162,
    offsetX: 0,
    offsetY: -3,
  },
  {
    id: 'jacket-4',
    category: 'jackets',
    imageUrl: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400&h=400&fit=crop',
    width: 198,
    anchorX: 150,
    anchorY: 166,
    offsetX: 0,
    offsetY: 1,
  },

  // ========== SHOES (4) ==========
  {
    id: 'shoes-1',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    width: 140,
    anchorX: 150,
    anchorY: 540,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'shoes-2',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    width: 135,
    anchorX: 150,
    anchorY: 545,
    offsetX: 0,
    offsetY: 5,
  },
  {
    id: 'shoes-3',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop',
    width: 145,
    anchorX: 150,
    anchorY: 538,
    offsetX: 0,
    offsetY: -2,
  },
  {
    id: 'shoes-4',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop',
    width: 138,
    anchorX: 150,
    anchorY: 542,
    offsetX: 0,
    offsetY: 2,
  },

  // ========== BAGS (4) ==========
  {
    id: 'bag-1',
    category: 'bags',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    width: 80,
    anchorX: 240,
    anchorY: 280,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'bag-2',
    category: 'bags',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    width: 75,
    anchorX: 242,
    anchorY: 285,
    offsetX: 2,
    offsetY: 5,
  },
  {
    id: 'bag-3',
    category: 'bags',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop',
    width: 85,
    anchorX: 238,
    anchorY: 275,
    offsetX: -2,
    offsetY: -5,
  },
  {
    id: 'bag-4',
    category: 'bags',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
    width: 78,
    anchorX: 240,
    anchorY: 282,
    offsetX: 0,
    offsetY: 2,
  },

  // ========== ACCESSORIES (4) ==========
  {
    id: 'accessory-1',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&h=200&fit=crop',
    width: 60,
    anchorX: 150,
    anchorY: 115,
    offsetX: 0,
    offsetY: 0,
  },
  {
    id: 'accessory-2',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop',
    width: 55,
    anchorX: 150,
    anchorY: 118,
    offsetX: 0,
    offsetY: 3,
  },
  {
    id: 'accessory-3',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1631163190830-e8e3a86cb02a?w=200&h=200&fit=crop',
    width: 65,
    anchorX: 150,
    anchorY: 112,
    offsetX: 0,
    offsetY: -3,
  },
  {
    id: 'accessory-4',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&h=200&fit=crop',
    width: 58,
    anchorX: 150,
    anchorY: 116,
    offsetX: 0,
    offsetY: 1,
  },
];

// Helper to get items by category
export const getItemsByCategory = (category: ClothingCategory): DemoItem[] => {
  return DEMO_ITEMS.filter((item) => item.category === category);
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
