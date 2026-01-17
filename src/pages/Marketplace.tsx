import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { 
  marketplaceProducts, 
  getMarketplaceImagePath,
  type MarketplaceProduct 
} from '@/data/marketplaceData';

interface ProductCardProps {
  product: MarketplaceProduct;
  onFavorite: (id: number) => void;
  isFavorite: boolean;
  onClick: () => void;
}

function ProductCard({ product, onFavorite, isFavorite, onClick }: ProductCardProps) {
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

  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30 cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Image Carousel */}
      <div className="relative aspect-[3/4]">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full touch-pan-x"
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
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Seller Info - Top Left */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full pl-1 pr-2.5 py-1">
          <img
            src={getMarketplaceImagePath(product.seller.sellerpp)}
            alt={product.seller.name}
            className="w-6 h-6 rounded-full object-cover border border-white/30"
          />
          <span className="text-white text-xs font-medium">{product.seller.name}</span>
        </div>

        {/* Favorite Button - Top Right */}
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

        {/* Scroll Indicators */}
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
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground truncate">{product.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-semibold text-accent">₺{product.price}</span>
          <span className="text-xs text-muted-foreground">{product.condition}</span>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Simple Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-foreground text-center">Pazar</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Uniform Grid */}
        <div className="grid grid-cols-2 gap-3">
          {marketplaceProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFavorite={toggleFavorite}
              isFavorite={favorites.has(product.id)}
              onClick={() => navigate(`/marketplace/${product.id}`)}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
