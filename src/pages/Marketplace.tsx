import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, X } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  marketplaceProducts, 
  getMarketplaceImagePath,
  type MarketplaceProduct,
  type ProductCategory
} from '@/data/marketplaceData';

type FilterCategory = 'all' | ProductCategory;

const CATEGORY_FILTERS: { value: FilterCategory; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'upper', label: 'Üst Giyim' },
  { value: 'lower', label: 'Alt Giyim' },
];

interface ProductCardProps {
  product: MarketplaceProduct;
  onFavorite: (id: number) => void;
  isFavorite: boolean;
  onClick: () => void;
  isFeatured?: boolean;
}

function ProductCard({ product, onFavorite, isFavorite, onClick, isFeatured = false }: ProductCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    getMarketplaceImagePath(product.images.asset),
    getMarketplaceImagePath(product.images.proof),
    getMarketplaceImagePath(product.images.sellerLook),
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / width);
      setCurrentIndex(newIndex);
    }
  };

  const isSold = product.sold;

  return (
    <div 
      onClick={isSold ? undefined : onClick}
      className={`bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30 transition-transform ${
        isSold ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
      } ${isFeatured ? 'col-span-2' : ''}`}
    >
      {/* Image Carousel */}
      <div className={`relative ${isFeatured ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full touch-pan-x ${isSold ? 'pointer-events-none' : ''}`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full h-full snap-center"
            >
              <img
                src={img}
                alt={`${product.title} - ${idx + 1}`}
                className={`w-full h-full object-cover ${isSold ? 'opacity-50' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Featured Badge */}
        {isFeatured && !isSold && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/40 backdrop-blur-xl rounded-full shadow-lg">
            <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">
              ✨ Editörün Seçimi
            </span>
          </div>
        )}

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-6 py-2 bg-white/90 text-foreground font-bold text-lg rounded-full shadow-lg">
              SATILDI
            </span>
          </div>
        )}

        {/* Seller Info - Top Left */}
        <div className={`absolute ${isFeatured ? 'bottom-2.5' : 'top-2.5'} left-2.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full pl-1 pr-2.5 py-1`}>
          <img
            src={getMarketplaceImagePath(product.seller.sellerpp)}
            alt={product.seller.name}
            className="w-6 h-6 rounded-full object-cover border border-white/30"
          />
          <span className="text-white text-xs font-medium">{product.seller.name}</span>
        </div>

        {/* Favorite Button - Top Right */}
        {!isSold && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product.id);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full transition-all active:scale-90"
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
        )}

        {/* Scroll Indicators */}
        {!isSold && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className={`font-bold text-sm truncate ${isSold ? 'text-muted-foreground' : 'text-foreground'}`}>
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-base font-semibold ${isSold ? 'text-muted-foreground line-through' : 'text-accent'}`}>
            ₺{product.price}
          </span>
          <span className="text-xs text-muted-foreground">{product.condition}</span>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  // Filtered products
  const filteredProducts = useMemo(() => {
    return marketplaceProducts.filter(product => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          product.title.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Search */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-md mx-auto px-4 py-3 space-y-3">
          <h1 className="text-xl font-bold text-foreground text-center">Pazar</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün, marka ara..."
              className="w-full pl-10 pr-10 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-muted-foreground/20"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveCategory(filter.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === filter.value
                    ? 'bg-accent text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Results count */}
        {(searchQuery || activeCategory !== 'all') && (
          <p className="text-sm text-muted-foreground mb-3">
            {filteredProducts.length} ürün bulundu
          </p>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Ürün bulunamadı</h2>
            <p className="text-sm text-muted-foreground">
              Farklı anahtar kelimeler veya filtreler dene
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavorite={toggleFavorite}
                isFavorite={isFavorite(product.id)}
                onClick={() => navigate(`/marketplace/${product.id}`)}
                isFeatured={index === 0 && activeCategory === 'all' && !searchQuery}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
