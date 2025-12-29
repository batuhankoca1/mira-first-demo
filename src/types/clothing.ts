export type ClothingCategory = 'tops' | 'bottoms' | 'dresses' | 'jackets' | 'shoes' | 'bags' | 'accessories';

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  createdAt: Date;
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
