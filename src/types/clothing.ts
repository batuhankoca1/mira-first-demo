// Active clothing categories
export type ClothingCategory = 'tops' | 'bottoms' | 'jackets' | 'dresses' | 'shoes' | 'bags' | 'accessories';

// Anchor types for avatar positioning
export type AnchorType = 'chest' | 'waist';

// Default anchor configs per category
export const CATEGORY_ANCHORS: Record<'tops' | 'bottoms', { 
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
  { value: 'tops', label: 'Üst Giyim', icon: '👕' },
  { value: 'bottoms', label: 'Alt Giyim', icon: '👖' },
  { value: 'jackets', label: 'Ceketler', icon: '🧥' },
  { value: 'dresses', label: 'Elbiseler', icon: '👗' },
  { value: 'shoes', label: 'Ayakkabılar', icon: '👟' },
  { value: 'bags', label: 'Çantalar', icon: '👜' },
  { value: 'accessories', label: 'Aksesuarlar', icon: '💍' },
];
