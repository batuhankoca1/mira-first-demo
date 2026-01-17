import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, ShoppingBag } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  marketplaceProducts, 
  getMarketplaceImagePath,
  type MarketplaceProduct 
} from '@/data/marketplaceData';

export default function Favorites() {
  const navigate = useNavigate();
  const { getFavoriteIds, toggleFavorite, isFavorite } = useFavorites();
  
  const favoriteIds = getFavoriteIds();
  const favoriteProducts = marketplaceProducts.filter(p => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card/80 text-foreground"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground flex-1">Favorilerim</h1>
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
      </div>

      <div className="px-4 pt-4">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Henüz favori yok</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Beğendiğin ürünleri kalp ikonuna tıklayarak favorilere ekle
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-accent text-white rounded-xl font-medium flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Pazarı Keşfet
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {favoriteProducts.length} ürün favorilerde
            </p>
            <div className="grid grid-cols-2 gap-3">
              {favoriteProducts.map((product) => (
                <FavoriteCard 
                  key={product.id} 
                  product={product} 
                  onRemove={() => toggleFavorite(product.id)}
                  onClick={() => navigate(`/marketplace/${product.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

interface FavoriteCardProps {
  product: MarketplaceProduct;
  onRemove: () => void;
  onClick: () => void;
}

function FavoriteCard({ product, onRemove, onClick }: FavoriteCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-[3/4]">
        <img
          src={getMarketplaceImagePath(product.images.asset)}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        
        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full transition-all active:scale-90"
        >
          <Heart className="w-4.5 h-4.5 fill-red-500 text-red-500" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground truncate">{product.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-semibold text-accent">₺{product.price}</span>
          <span className="text-xs text-muted-foreground">{product.brand}</span>
        </div>
      </div>
    </div>
  );
}
