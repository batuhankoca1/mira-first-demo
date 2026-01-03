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
  { id: 'top-1', category: 'tops', src: '/demo-items/tops/black-tshirt.png', styleAdjustments: { top: '15%', width: '65%' } },
  { id: 'top-2', category: 'tops', src: '/demo-items/tops/white-crop-top.png', styleAdjustments: { top: '16%', width: '58%', left: '20%' } },
  { id: 'top-3', category: 'tops', src: '/demo-items/tops/black-blazer.png', styleAdjustments: { top: '13%', width: '72%', left: '14%' } },
  { id: 'top-4', category: 'tops', src: '/demo-items/tops/beige-sweater.webp', styleAdjustments: { top: '14%', width: '70%', left: '15%' } },
  { id: 'top-5', category: 'tops', src: '/demo-items/tops/blue-sweater.png', styleAdjustments: { top: '14%', width: '68%' } },
  { id: 'top-6', category: 'tops', src: '/demo-items/tops/denim-jacket.png', styleAdjustments: { top: '13%', width: '72%', left: '14%' } },
  { id: 'top-7', category: 'tops', src: '/demo-items/tops/black-tank-top.png', styleAdjustments: { top: '16%', width: '55%', left: '22%' } },
  { id: 'top-8', category: 'tops', src: '/demo-items/tops/red-satin-blouse.png', styleAdjustments: { top: '14%', width: '68%' } },
  { id: 'top-9', category: 'tops', src: '/demo-items/tops/charcoal-hoodie.png', styleAdjustments: { top: '12%', width: '75%', left: '12%' } },
  { id: 'top-10', category: 'tops', src: '/demo-items/tops/cream-bralette.webp', styleAdjustments: { top: '18%', width: '50%', left: '25%' } },
  { id: 'top-11', category: 'tops', src: '/demo-items/tops/white-tshirt.png', styleAdjustments: { top: '15%', width: '65%' } },
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
    styleAdjustments: { top: '15%', width: '62%', left: '19%' }
  },

  // ═══════════ BOTTOMS (8 items) ═══════════
  { id: 'bottom-1', category: 'bottoms', src: '/demo-items/bottoms/cargo-pants.png', styleAdjustments: { top: '40%', width: '52%', left: '12%' } },
  { id: 'bottom-2', category: 'bottoms', src: '/demo-items/bottoms/black-pleated-skirt.png', styleAdjustments: { top: '38%', width: '48%', left: '15%' } },
  { id: 'bottom-3', category: 'bottoms', src: '/demo-items/bottoms/black-leggings.png', styleAdjustments: { top: '38%', width: '45%', left: '18%' } },
  { id: 'bottom-4', category: 'bottoms', src: '/demo-items/bottoms/beige-wide-skirt.png', styleAdjustments: { top: '37%', width: '55%', left: '12%' } },
  { id: 'bottom-5', category: 'bottoms', src: '/demo-items/bottoms/red-midi-skirt.png', styleAdjustments: { top: '38%', width: '50%', left: '14%' } },
  { id: 'bottom-6', category: 'bottoms', src: '/demo-items/bottoms/red-mini-skirt.webp', styleAdjustments: { top: '38%', width: '45%', left: '17%' } },
  { id: 'bottom-7', category: 'bottoms', src: '/demo-items/bottoms/denim-skirt.png', styleAdjustments: { top: '38%', width: '48%', left: '16%' } },
  { id: 'bottom-8', category: 'bottoms', src: '/demo-items/bottoms/leather-skirt.webp', styleAdjustments: { top: '38%', width: '46%', left: '17%' } },
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
    styleAdjustments: { top: '39%', width: '50%', left: '14%' }
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
