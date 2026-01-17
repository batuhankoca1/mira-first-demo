// Marketplace Product Types
export interface MarketplaceSeller {
  name: string;
  sellerpp: string;
}

export interface MarketplaceImages {
  asset: string;      // Transparan, vitrin ve try-on için görsel
  proof: string;      // Gerçek ürün kanıt fotosu
  sellerLook: string; // Satıcının üzerindeki duruşu
}

export type ProductCondition = 'Az Kullanılmış' | 'Yeni Etiketli';
export type ProductCategory = 'upper' | 'lower';

export interface MarketplaceProduct {
  id: number;
  title: string;
  price: number;
  seller: MarketplaceSeller;
  images: MarketplaceImages;
  condition: ProductCondition;
  category: ProductCategory;
}

// Mock Data
export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: 1,
    title: 'Siyah Deri Ceket',
    price: 1350,
    seller: {
      name: 'Selin K.',
      sellerpp: 'mp-pp-1.png',
    },
    images: {
      asset: 'mp-leather-jacket-clean.png',
      proof: 'mp-leather-jacket-raw.png',
      sellerLook: 'mp-leather-jacket-avatar.png',
    },
    condition: 'Az Kullanılmış',
    category: 'upper',
  },
  {
    id: 2,
    title: 'Oversize Beyaz Tişört',
    price: 420,
    seller: {
      name: 'Elif D.',
      sellerpp: 'mp-pp-2.webp',
    },
    images: {
      asset: 'mp-white-tshirt-clean.png',
      proof: 'mp-white-tshirt-raw.png',
      sellerLook: 'mp-white-tshirt-avatar.png',
    },
    condition: 'Yeni Etiketli',
    category: 'upper',
  },
  {
    id: 3,
    title: 'Yeşil Crop Top',
    price: 580,
    seller: {
      name: 'Zeynep A.',
      sellerpp: 'mp-pp-3.png',
    },
    images: {
      asset: 'mp-green-croptop-clean.png',
      proof: 'mp-green-croptop-raw.png',
      sellerLook: 'mp-green-croptop-avatar.png',
    },
    condition: 'Az Kullanılmış',
    category: 'upper',
  },
  {
    id: 4,
    title: 'Çizgili Midi Etek',
    price: 750,
    seller: {
      name: 'Ayşe M.',
      sellerpp: 'mp-pp-4.png',
    },
    images: {
      asset: 'mp-colored-skirt-clean.png',
      proof: 'mp-colored-skirt-raw.png',
      sellerLook: 'mp-colored-skirt-avatar.png',
    },
    condition: 'Yeni Etiketli',
    category: 'lower',
  },
  {
    id: 5,
    title: 'Vintage Mom Jean',
    price: 890,
    seller: {
      name: 'Ceren T.',
      sellerpp: 'mp-pp-5.png',
    },
    images: {
      asset: 'mp-blue-jeans-clean.png',
      proof: 'mp-blue-jeans-raw.png',
      sellerLook: 'mp-blue-jeans-avatar.png',
    },
    condition: 'Az Kullanılmış',
    category: 'lower',
  },
  {
    id: 6,
    title: 'Gothic Wide-Leg Pantolon',
    price: 1120,
    seller: {
      name: 'Merve B.',
      sellerpp: 'mp-pp-6.png',
    },
    images: {
      asset: 'mp-black-pants-clean.webp',
      proof: 'mp-black-pants-raw.png',
      sellerLook: 'mp-black-pants-avatar.png',
    },
    condition: 'Yeni Etiketli',
    category: 'lower',
  },
];

// Helper functions
export const getMarketplaceImagePath = (filename: string): string => {
  return `/marketplace/${filename}`;
};

export const getProductsByCategory = (category: ProductCategory): MarketplaceProduct[] => {
  return marketplaceProducts.filter((product) => product.category === category);
};

export const getProductById = (id: number): MarketplaceProduct | undefined => {
  return marketplaceProducts.find((product) => product.id === id);
};
