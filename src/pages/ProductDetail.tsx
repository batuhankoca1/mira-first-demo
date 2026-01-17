import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Star, MessageCircle, Sparkles, ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import { 
  getProductById, 
  getMarketplaceImagePath,
  mockQA
} from '@/data/marketplaceData';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = getProductById(Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ürün bulunamadı</p>
      </div>
    );
  }

  // Image order: proof (raw), sellerLook, asset (clean)
  const galleryImages = [
    { src: getMarketplaceImagePath(product.images.proof), label: 'Gerçek Ürün' },
    { src: getMarketplaceImagePath(product.images.sellerLook), label: 'Satıcıda' },
    { src: getMarketplaceImagePath(product.images.asset), label: 'Vitrin' },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / width);
      setCurrentIndex(newIndex);
    }
  };

  const handleTryOn = () => {
    // Save the product asset for try-on
    const tryOnData = {
      type: 'marketplace',
      category: product.category,
      imageUrl: getMarketplaceImagePath(product.images.asset),
      productId: product.id,
      title: product.title,
    };
    localStorage.setItem('tryon-item', JSON.stringify(tryOnData));
    navigate('/dressup');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card/80 text-foreground"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card/80"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
            />
          </button>
        </div>
      </div>

      {/* Image Gallery - 50% of screen */}
      <div className="relative h-[50vh] bg-muted">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full touch-pan-x"
        >
          {galleryImages.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
              <img
                src={img.src}
                alt={`${product.title} - ${img.label}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-xs font-medium">{img.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {galleryImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Product Info Card */}
        <div className="bg-card rounded-2xl p-4 border border-border/30">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{product.title}</h1>
              <p className="text-2xl font-bold text-accent mt-1">₺{product.price}</p>
            </div>
            <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              {product.condition}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1.5 bg-muted rounded-lg text-sm">
              <span className="text-muted-foreground">Beden:</span> <span className="font-medium">{product.size}</span>
            </span>
            <span className="px-3 py-1.5 bg-muted rounded-lg text-sm">
              <span className="text-muted-foreground">Marka:</span> <span className="font-medium">{product.brand}</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Seller Card */}
        <div className="bg-card rounded-2xl p-4 border border-border/30">
          <div className="flex items-center gap-3">
            <img
              src={getMarketplaceImagePath(product.seller.sellerpp)}
              alt={product.seller.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-accent/30"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{product.seller.name}</h3>
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{product.seller.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{product.seller.description}</p>
            </div>
          </div>
          
          <button className="w-full mt-4 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
            Satıcının Diğer Ürünleri
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Q&A Section */}
        <div className="bg-card rounded-2xl p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Soru & Cevap</h3>
          </div>

          <div className="space-y-4">
            {mockQA.map((qa, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                    {qa.askerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{qa.question}</p>
                    <span className="text-xs text-muted-foreground">{qa.askerName}</span>
                  </div>
                </div>
                <div className="ml-9 p-3 bg-accent/5 rounded-xl border-l-2 border-accent">
                  <p className="text-sm text-foreground">{qa.answer}</p>
                  <span className="text-xs text-muted-foreground">Satıcı yanıtı</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2.5 border border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent transition-colors">
            + Satıcıya Soru Sor
          </button>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          {/* Teklif Ver */}
          <button className="flex-shrink-0 px-4 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            Teklif
          </button>

          {/* Satın Al */}
          <button className="flex-1 py-3 bg-foreground text-background rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
            <ShoppingBag className="w-4 h-4" />
            Satın Al
          </button>

          {/* Üzerimde Dene - Most Prominent */}
          <button 
            onClick={handleTryOn}
            className="flex-shrink-0 px-5 py-3 bg-gradient-to-r from-accent to-amber-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Dene
          </button>
        </div>
      </div>
    </div>
  );
}
