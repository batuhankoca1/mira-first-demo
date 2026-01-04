import { ClothingCategory } from '@/types/clothing';

// Sponsored item info for monetization
export interface SponsoredInfo {
  brand: string;
  price: string;
  fabric: string;
  rating: number;
  buyLink: string;
}

// Per-item style adjustments for precise positioning
export interface StyleAdjustments {
  top?: string;
  left?: string;
  width?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
}

// Core wardrobe item structure
export interface WardrobeItem {
  id: string;
  category: ClothingCategory;
  src: string;
  isSponsored?: boolean;
  sponsoredInfo?: SponsoredInfo;
  styleAdjustments?: StyleAdjustments;
}

// Demo wardrobe items - Tops & Bottoms only
export const WARDROBE_ITEMS: WardrobeItem[] = [
  // ═══════════ TOPS (11 items) ═══════════
  { id: 'top-1', category: 'tops', src: '/demo-items/tops/black-tshirt.png', styleAdjustments: { top: '13%', left: '18%', width: '65%', zIndex: 2 } },
  { id: 'top-2', category: 'tops', src: '/demo-items/tops/white-crop-top.png', styleAdjustments: { top: '15%', left: '11%', width: '79%', zIndex: 2 } },
  { id: 'top-3', category: 'tops', src: '/demo-items/tops/black-blazer.png', styleAdjustments: { top: '13%', left: '18%', width: '72%', zIndex: 2 } },
  { id: 'top-4', category: 'tops', src: '/demo-items/tops/beige-sweater.webp', styleAdjustments: { top: '13.8%', left: '18%', width: '63%', zIndex: 2 } },
  { id: 'top-5', category: 'tops', src: '/demo-items/tops/blue-sweater.png', styleAdjustments: { top: '16.8%', left: '27%', width: '50%', zIndex: 2 } },
  { id: 'top-6', category: 'tops', src: '/demo-items/tops/denim-jacket.png', styleAdjustments: { top: '14%', left: '19%', width: '63%', zIndex: 2 } },
  { id: 'top-7', category: 'tops', src: '/demo-items/tops/black-tank-top.png', styleAdjustments: { top: '16.5%', left: '23%', width: '55%', zIndex: 2 } },
  { id: 'top-8', category: 'tops', src: '/demo-items/tops/red-satin-blouse.png', styleAdjustments: { top: '14%', left: '16%', width: '68%', zIndex: 2 } },
  { id: 'top-9', category: 'tops', src: '/demo-items/tops/charcoal-hoodie.png', styleAdjustments: { top: '15%', left: '24%', width: '54%', zIndex: 2 } },
  { id: 'top-10', category: 'tops', src: '/demo-items/tops/cream-bralette.webp', styleAdjustments: { top: '14%', left: '34%', width: '34%', zIndex: 2 } },
  { id: 'top-11', category: 'tops', src: '/demo-items/tops/white-tshirt.png', styleAdjustments: { top: '14.7%', left: '24%', width: '54%', zIndex: 2 } },
  // Sponsored: Zara
  { 
    id: 'sponsored-top-zara', 
    category: 'tops', 
    src: '/demo-items/sponsored/zara-top.webp',
    isSponsored: true,
    sponsoredInfo: {
      brand: 'Zara',
      price: '₺1.450',
      fabric: '100% Silk',
      rating: 4.9,
      buyLink: '#'
    },
    styleAdjustments: { top: '12.5%', left: '25%', width: '51%', zIndex: 2 }
  },

  // ═══════════ BOTTOMS (8 items) ═══════════
  { id: 'bottom-1', category: 'bottoms', src: '/demo-items/bottoms/cargo-pants.png', styleAdjustments: { top: '38%', left: '6%', width: '60%', scaleX: 1.5, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-2', category: 'bottoms', src: '/demo-items/bottoms/black-pleated-skirt.png', styleAdjustments: { top: '36%', left: '13.5%', width: '50%', scaleX: 1.5, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-3', category: 'bottoms', src: '/demo-items/bottoms/black-leggings.png', styleAdjustments: { top: '33%', left: '8%', width: '43%', scaleX: 2, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-4', category: 'bottoms', src: '/demo-items/bottoms/beige-wide-skirt.png', styleAdjustments: { top: '37%', left: '4%', width: '55%', scaleX: 1.7, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-5', category: 'bottoms', src: '/demo-items/bottoms/red-midi-skirt.png', styleAdjustments: { top: '38%', left: '4%', width: '50%', scaleX: 1.89, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-6', category: 'bottoms', src: '/demo-items/bottoms/red-mini-skirt.webp', styleAdjustments: { top: '34%', left: '17%', width: '45%', scaleX: 1.5, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-7', category: 'bottoms', src: '/demo-items/bottoms/denim-skirt.png', styleAdjustments: { top: '35%', left: '15.5%', width: '39%', scaleX: 1.8, scaleY: 1.84, zIndex: 1 } },
  { id: 'bottom-8', category: 'bottoms', src: '/demo-items/bottoms/leather-skirt.webp', styleAdjustments: { top: '39%', left: '6.8%', width: '46%', scaleX: 1.9, scaleY: 1.84, zIndex: 1 } },
  // Sponsored: Levi's
  { 
    id: 'sponsored-bottom-levis', 
    category: 'bottoms', 
    src: '/demo-items/sponsored/levis-jean.webp',
    isSponsored: true,
    sponsoredInfo: {
      brand: "Levi's",
      price: '₺2.200',
      fabric: 'Premium Denim',
      rating: 4.7,
      buyLink: '#'
    },
    styleAdjustments: { top: '39%', left: '-4.8%', width: '50%', scaleX: 2.3, scaleY: 2, zIndex: 1 }
  },
];

// Helper: Get items by category
export const getItemsByCategory = (category: ClothingCategory): WardrobeItem[] => 
  WARDROBE_ITEMS.filter((item) => item.category === category);

// Helper: Get single item by ID
export const getItemById = (id: string): WardrobeItem | undefined => 
  WARDROBE_ITEMS.find((item) => item.id === id);

// Category render order (z-index: bottom to top)
export const CATEGORY_ORDER: ClothingCategory[] = ['bottoms', 'tops'];
