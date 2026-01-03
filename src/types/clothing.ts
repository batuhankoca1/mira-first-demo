// Active clothing categories
export type ClothingCategory = 'tops' | 'bottoms';

// Anchor types for avatar positioning
export type AnchorType = 'chest' | 'waist';

// Default anchor configs per category
export const CATEGORY_ANCHORS: Record<ClothingCategory, { 
  anchorType: AnchorType; 
  anchorOffset: { x: number; y: number }; 
  scale: number 
}> = {
  tops: { anchorType: 'chest', anchorOffset: { x: 0, y: 0 }, scale: 1.0 },
  bottoms: { anchorType: 'waist', anchorOffset: { x: 0, y: 0 }, scale: 1.0 },
};

// Clothing item structure (for user uploads)
export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  createdAt: Date;
  anchorType: AnchorType;
  anchorOffset: { x: number; y: number };
  scale: number;
}

// Outfit combination
export interface Outfit {
  id: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
}

// Category display config
export const CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'Üstler', icon: '👕' },
  { value: 'bottoms', label: 'Altlar', icon: '👖' },
];
