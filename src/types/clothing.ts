// All wardrobe categories
export type ClothingCategory = 'tops' | 'bottoms' | 'bags' | 'shoes' | 'jackets' | 'dresses' | 'accessories';

export type AnchorType = 'chest' | 'waist' | 'side';

// Default anchor configs per category (only for avatar-wearable items)
export const CATEGORY_ANCHORS: Partial<Record<ClothingCategory, { anchorType: AnchorType; anchorOffset: { x: number; y: number }; scale: number }>> = {
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

// All categories with labels and icons
export const CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'Üstler', icon: '👕' },
  { value: 'bottoms', label: 'Altlar', icon: '👖' },
  { value: 'bags', label: 'Çantalar', icon: '👜' },
  { value: 'shoes', label: 'Ayakkabılar', icon: '👟' },
  { value: 'jackets', label: 'Ceketler', icon: '🧥' },
  { value: 'dresses', label: 'Elbiseler', icon: '👗' },
  { value: 'accessories', label: 'Aksesuarlar', icon: '💍' },
];
