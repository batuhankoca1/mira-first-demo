// Simplified to 3 categories only
export type ClothingCategory = 'tops' | 'bottoms' | 'bags';

export type AnchorType = 'chest' | 'waist' | 'side';

// Default anchor configs per category
export const CATEGORY_ANCHORS: Record<ClothingCategory, { anchorType: AnchorType; anchorOffset: { x: number; y: number }; scale: number }> = {
  tops: { anchorType: 'chest', anchorOffset: { x: 0, y: 0 }, scale: 1.0 },
  bottoms: { anchorType: 'waist', anchorOffset: { x: 0, y: 0 }, scale: 1.0 },
  bags: { anchorType: 'side', anchorOffset: { x: 15, y: 10 }, scale: 0.6 },
};

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  createdAt: Date;
  anchorType: AnchorType;
  anchorOffset: { x: number; y: number };
  scale: number;
}

export interface Outfit {
  id: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  bag?: ClothingItem;
}

// Only 3 categories
export const CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'Tops', icon: '👕' },
  { value: 'bottoms', label: 'Bottoms', icon: '👖' },
  { value: 'bags', label: 'Bags', icon: '👜' },
];
