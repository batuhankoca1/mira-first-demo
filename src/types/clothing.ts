export type ClothingCategory = 'tops' | 'bottoms' | 'dresses' | 'jackets' | 'shoes' | 'bags' | 'accessories';

export type AnchorType = 'chest' | 'waist' | 'foot' | 'side' | 'head' | 'neck' | 'hand';

// Default anchor configs per category
export const CATEGORY_ANCHORS: Record<ClothingCategory, { anchorType: AnchorType; anchorOffset: { x: number; y: number }; scale: number }> = {
  tops: { anchorType: 'chest', anchorOffset: { x: 0, y: 0 }, scale: 1.0 },
  jackets: { anchorType: 'chest', anchorOffset: { x: 0, y: -2 }, scale: 1.15 },
  bottoms: { anchorType: 'waist', anchorOffset: { x: 0, y: 0 }, scale: 1.0 },
  dresses: { anchorType: 'chest', anchorOffset: { x: 0, y: 0 }, scale: 1.3 },
  shoes: { anchorType: 'foot', anchorOffset: { x: 0, y: 0 }, scale: 0.9 },
  bags: { anchorType: 'side', anchorOffset: { x: 15, y: 10 }, scale: 0.6 },
  accessories: { anchorType: 'neck', anchorOffset: { x: 0, y: -5 }, scale: 0.5 },
};

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  createdAt: Date;
  // Anchor and scale for avatar layering
  anchorType: AnchorType;
  anchorOffset: { x: number; y: number };
  scale: number;
}

export interface Outfit {
  id: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  dress?: ClothingItem;
  jacket?: ClothingItem;
  shoes?: ClothingItem;
  bag?: ClothingItem;
  accessory?: ClothingItem;
}

export const CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'Tops', icon: '👕' },
  { value: 'bottoms', label: 'Bottoms', icon: '👖' },
  { value: 'dresses', label: 'Dresses', icon: '👗' },
  { value: 'jackets', label: 'Jackets', icon: '🧥' },
  { value: 'shoes', label: 'Shoes', icon: '👟' },
  { value: 'bags', label: 'Bags', icon: '👜' },
  { value: 'accessories', label: 'Accessories', icon: '💍' },
];
