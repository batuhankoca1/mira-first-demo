export type InspirationCategory = 'casual' | 'datenight' | 'sports' | 'oldmoney';

export interface InspirationLook {
  id: string;
  src: string;
  category: InspirationCategory;
  matchingItems: {
    topId: string;
    bottomId: string;
  };
}

// Category to matching wardrobe items mapping
const CATEGORY_MATCHES: Record<InspirationCategory, { topId: string; bottomId: string }> = {
  casual: { topId: 'top-11', bottomId: 'bottom-1' }, // White T-shirt + Cargo pants
  datenight: { topId: 'top-8', bottomId: 'bottom-2' }, // Red satin blouse + Black pleated skirt
  sports: { topId: 'top-9', bottomId: 'bottom-3' }, // Charcoal hoodie + Black leggings
  oldmoney: { topId: 'top-3', bottomId: 'bottom-4' }, // Black blazer + Beige wide skirt
};

// Inspiration looks data - add more as images are uploaded
export const INSPIRATION_LOOKS: InspirationLook[] = [
  // Casual
  { id: 'casual-6', src: '/explore/explore-casual-6.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-10', src: '/explore/explore-casual-10.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-11', src: '/explore/explore-casual-11.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-13', src: '/explore/explore-casual-13.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-14', src: '/explore/explore-casual-14.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-15', src: '/explore/explore-casual-15.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-16', src: '/explore/explore-casual-16.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  
  // Date Night
  { id: 'datenight-6', src: '/explore/explore-datenight-6.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-7', src: '/explore/explore-datenight-7.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  
  // Sports
  { id: 'sports-1', src: '/explore/explore-sports-1.png', category: 'sports', matchingItems: CATEGORY_MATCHES.sports },
];

export const CATEGORY_LABELS: Record<InspirationCategory | 'all', string> = {
  all: 'Tümü',
  oldmoney: 'Old Money',
  casual: 'Casual',
  datenight: 'Date Night',
  sports: 'Sports',
};

export const getInspirationByCategory = (category: InspirationCategory | 'all'): InspirationLook[] => {
  if (category === 'all') return INSPIRATION_LOOKS;
  return INSPIRATION_LOOKS.filter(look => look.category === category);
};
