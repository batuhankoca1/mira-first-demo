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

// Inspiration looks data - 27 items total
export const INSPIRATION_LOOKS: InspirationLook[] = [
  // Casual (16 items)
  { id: 'casual-1', src: '/explore/explore-casual-1.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-2', src: '/explore/explore-casual-2.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-3', src: '/explore/explore-casual-3.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-4', src: '/explore/explore-casual-4.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-5', src: '/explore/explore-casual-5.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-6', src: '/explore/explore-casual-6.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-7', src: '/explore/explore-casual-7.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-8', src: '/explore/explore-casual-8.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-9', src: '/explore/explore-casual-9.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-10', src: '/explore/explore-casual-10.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-11', src: '/explore/explore-casual-11.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-12', src: '/explore/explore-casual-12.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-13', src: '/explore/explore-casual-13.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-14', src: '/explore/explore-casual-14.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-15', src: '/explore/explore-casual-15.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  { id: 'casual-16', src: '/explore/explore-casual-16.png', category: 'casual', matchingItems: CATEGORY_MATCHES.casual },
  
  // Date Night (7 items)
  { id: 'datenight-1', src: '/explore/explore-datenight-1.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-2', src: '/explore/explore-datenight-2.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-3', src: '/explore/explore-datenight-3.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-4', src: '/explore/explore-datenight-4.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-5', src: '/explore/explore-datenight-5.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-6', src: '/explore/explore-datenight-6.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  { id: 'datenight-7', src: '/explore/explore-datenight-7.png', category: 'datenight', matchingItems: CATEGORY_MATCHES.datenight },
  
  // Sports (1 item)
  { id: 'sports-1', src: '/explore/explore-sports-1.png', category: 'sports', matchingItems: CATEGORY_MATCHES.sports },
  
  // Old Money (3 items)
  { id: 'oldmoney-1', src: '/explore/explore-oldmoney-1.jpg', category: 'oldmoney', matchingItems: CATEGORY_MATCHES.oldmoney },
  { id: 'oldmoney-2', src: '/explore/explore-oldmoney-2.jpg', category: 'oldmoney', matchingItems: CATEGORY_MATCHES.oldmoney },
  { id: 'oldmoney-3', src: '/explore/explore-oldmoney-3.png', category: 'oldmoney', matchingItems: CATEGORY_MATCHES.oldmoney },
];

export const CATEGORY_LABELS: Record<InspirationCategory | 'all', string> = {
  all: 'Tümü',
  oldmoney: 'Old Money',
  casual: 'Casual',
  datenight: 'Date Night',
  sports: 'Sports',
};

// Search keywords mapping to categories
const SEARCH_KEYWORDS: Record<string, InspirationCategory> = {
  // Casual
  casual: 'casual',
  günlük: 'casual',
  rahat: 'casual',
  weekend: 'casual',
  hafta: 'casual',
  kahve: 'casual',
  coffee: 'casual',
  // Date Night
  datenight: 'datenight',
  date: 'datenight',
  night: 'datenight',
  gece: 'datenight',
  akşam: 'datenight',
  romantik: 'datenight',
  parti: 'datenight',
  party: 'datenight',
  // Sports
  sports: 'sports',
  spor: 'sports',
  sporty: 'sports',
  athletic: 'sports',
  gym: 'sports',
  // Old Money
  oldmoney: 'oldmoney',
  old: 'oldmoney',
  money: 'oldmoney',
  lüks: 'oldmoney',
  luxury: 'oldmoney',
  elegant: 'oldmoney',
  zarif: 'oldmoney',
  şık: 'oldmoney',
};

export const searchInspiration = (query: string): InspirationLook[] => {
  if (!query.trim()) return INSPIRATION_LOOKS;
  
  const lowerQuery = query.toLowerCase().trim();
  const matchedCategory = SEARCH_KEYWORDS[lowerQuery];
  
  if (matchedCategory) {
    return INSPIRATION_LOOKS.filter(look => look.category === matchedCategory);
  }
  
  // Partial match
  for (const [keyword, category] of Object.entries(SEARCH_KEYWORDS)) {
    if (keyword.includes(lowerQuery) || lowerQuery.includes(keyword)) {
      return INSPIRATION_LOOKS.filter(look => look.category === category);
    }
  }
  
  return INSPIRATION_LOOKS;
};

export const getInspirationByCategory = (category: InspirationCategory | 'all'): InspirationLook[] => {
  if (category === 'all') return INSPIRATION_LOOKS;
  return INSPIRATION_LOOKS.filter(look => look.category === category);
};
