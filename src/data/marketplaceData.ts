// Marketplace Product Types
export interface MarketplaceSeller {
  name: string;
  sellerpp: string;
  rating: number;
  description: string;
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
  size: string;
  brand: string;
  seller: MarketplaceSeller;
  images: MarketplaceImages;
  condition: ProductCondition;
  category: ProductCategory;
  description: string;
}

// Mock Q&A Data
export interface ProductQA {
  question: string;
  answer: string;
  askerName: string;
}

export const mockQA: ProductQA[] = [
  {
    question: 'Son fiyat ne olur?',
    answer: 'Maalesef son fiyattır.',
    askerName: 'Deniz Y.',
  },
  {
    question: 'Kalıbı dar mı?',
    answer: 'Hayır tam kalıp.',
    askerName: 'Melis K.',
  },
];

// Mock Data
export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: 1,
    title: 'Siyah Deri Ceket',
    price: 1350,
    size: 'S',
    brand: 'Zara',
    seller: {
      name: 'Selin K.',
      sellerpp: 'mp-pp-1.png',
      rating: 4.8,
      description: 'Sadece 2 kez giyildi, tertemiz durumda. Orijinal etiketleri mevcut.',
    },
    images: {
      asset: 'mp-leather-jacket-clean.png',
      proof: 'mp-leather-jacket-raw.png',
      sellerLook: 'mp-leather-jacket-avatar.png',
    },
    condition: 'Az Kullanılmış',
    category: 'upper',
    description: 'Gerçek deri, fermuar detaylı biker ceket. İç astarı saten.',
  },
  {
    id: 2,
    title: 'Oversize Beyaz Tişört',
    price: 420,
    size: 'M',
    brand: 'H&M',
    seller: {
      name: 'Elif D.',
      sellerpp: 'mp-pp-2.webp',
      rating: 4.5,
      description: 'Yeni etiketli, hiç giyilmedi. Hediye geldi ama bana olmadı.',
    },
    images: {
      asset: 'mp-white-tshirt-clean.png',
      proof: 'mp-white-tshirt-raw.png',
      sellerLook: 'mp-white-tshirt-avatar.png',
    },
    condition: 'Yeni Etiketli',
    category: 'upper',
    description: '%100 pamuk, oversize kesim. Yüz baskılı sanatsal tasarım.',
  },
  {
    id: 3,
    title: 'Yeşil Crop Top',
    price: 580,
    size: 'S',
    brand: 'Pull&Bear',
    seller: {
      name: 'Zeynep A.',
      sellerpp: 'mp-pp-3.png',
      rating: 4.9,
      description: 'Birkaç kez giyildi, leke veya deformasyon yok.',
    },
    images: {
      asset: 'mp-green-croptop-clean.png',
      proof: 'mp-green-croptop-raw.png',
      sellerLook: 'mp-green-croptop-avatar.png',
    },
    condition: 'Az Kullanılmış',
    category: 'upper',
    description: 'Fitilli triko kumaş, bağlamalı model. Yazlık ve şık.',
  },
  {
    id: 4,
    title: 'Çizgili Midi Etek',
    price: 750,
    size: 'M',
    brand: 'Mango',
    seller: {
      name: 'Ayşe M.',
      sellerpp: 'mp-pp-4.png',
      rating: 4.7,
      description: 'Etiketi üzerinde, deneme dışında giyilmedi.',
    },
    images: {
      asset: 'mp-colored-skirt-clean.png',
      proof: 'mp-colored-skirt-raw.png',
      sellerLook: 'mp-colored-skirt-avatar.png',
    },
    condition: 'Yeni Etiketli',
    category: 'lower',
    description: 'A kesim, yüksek bel. Canlı çizgili pamuklu kumaş.',
  },
  {
    id: 5,
    title: 'Vintage Mom Jean',
    price: 890,
    size: '38',
    brand: "Levi's",
    seller: {
      name: 'Ceren T.',
      sellerpp: 'mp-pp-5.png',
      rating: 4.6,
      description: 'Vintage parça, orijinal 90\'lar modeli. Hafif yıpranma var.',
    },
    images: {
      asset: 'mp-blue-jeans-clean.png',
      proof: 'mp-blue-jeans-raw.png',
      sellerLook: 'mp-blue-jeans-avatar.png',
    },
    condition: 'Az Kullanılmış',
    category: 'lower',
    description: 'Yüksek bel mom jean, açık mavi yıkamalı. %100 pamuk denim.',
  },
  {
    id: 6,
    title: 'Gothic Wide-Leg Pantolon',
    price: 1120,
    size: 'L',
    brand: 'Bershka',
    seller: {
      name: 'Merve B.',
      sellerpp: 'mp-pp-6.png',
      rating: 5.0,
      description: 'Sıfır ürün, etiketli. Online alındı, beden uymadı.',
    },
    images: {
      asset: 'mp-black-pants-clean.webp',
      proof: 'mp-black-pants-raw.png',
      sellerLook: 'mp-black-pants-avatar.png',
    },
    condition: 'Yeni Etiketli',
    category: 'lower',
    description: 'Geniş paça, gotik baskılı. Elastik bel, rahat kesim.',
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
