export type ClothingCategory = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';

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
  outerwear?: ClothingItem;
  shoes?: ClothingItem;
  accessory?: ClothingItem;
}

export const CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'Tops', icon: '👕' },
  { value: 'bottoms', label: 'Bottoms', icon: '👖' },
  { value: 'dresses', label: 'Dresses', icon: '👗' },
  { value: 'outerwear', label: 'Outerwear', icon: '🧥' },
  { value: 'shoes', label: 'Shoes', icon: '👟' },
  { value: 'accessories', label: 'Accessories', icon: '👜' },
];
