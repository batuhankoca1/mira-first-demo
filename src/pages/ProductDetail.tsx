import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Star, MessageCircle, Sparkles, ShoppingBag, Tag, ChevronRight, Send, Wallet, Check, X, Percent, MapPin } from 'lucide-react';
import { 
  getProductById, 
  getMarketplaceImagePath,
  mockQA,
  type ProductQA
} from '@/data/marketplaceData';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';

// Confetti component
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-[confetti_3s_ease-out_forwards]"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Offer Sheet
  const [offerSheetOpen, setOfferSheetOpen] = useState(false);
  const [customOfferOpen, setCustomOfferOpen] = useState(false);
  const [customOfferAmount, setCustomOfferAmount] = useState('');
  
  // Payment Dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  
  // Q&A
  const [userQuestions, setUserQuestions] = useState<{ question: string }[]>([]);
  const [questionInput, setQuestionInput] = useState('');

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

  const handleOfferSelect = (discountLabel: string, isCustom?: boolean) => {
    if (isCustom) {
      setOfferSheetOpen(false);
      setCustomOfferOpen(true);
      return;
    }
    setOfferSheetOpen(false);
    toast({
      title: "Teklif Gönderildi! 🎉",
      description: `${discountLabel} indirim teklifiniz satıcıya iletildi.`,
    });
  };

  const handleCustomOfferSubmit = () => {
    if (!customOfferAmount.trim()) return;
    setCustomOfferOpen(false);
    toast({
      title: "Teklif Gönderildi! 🎉",
      description: `₺${customOfferAmount} teklifiniz satıcıya iletildi.`,
    });
    setCustomOfferAmount('');
  };

  // Get Turkish product type name
  const getProductTypeName = () => {
    const category = product.category.toLowerCase();
    if (category.includes('jacket') || category.includes('ceket')) return 'ceket';
    if (category.includes('pants') || category.includes('pantolon') || category.includes('jeans')) return 'pantolon';
    if (category.includes('skirt') || category.includes('etek')) return 'etek';
    if (category.includes('tshirt') || category.includes('tişört') || category.includes('top') || category.includes('blouse')) return 'tişört';
    return 'parça';
  };

  const handlePurchase = () => {
    if (!addressConfirmed) {
      toast({
        title: "Adres Onayı Gerekli",
        description: "Lütfen teslimat adresinizi onaylayın.",
        variant: "destructive",
      });
      return;
    }
    setPaymentDialogOpen(false);
    setPurchaseComplete(true);
    setShowConfetti(true);
    setAddressConfirmed(false);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleContinueShopping = () => {
    setPurchaseComplete(false);
    navigate('/marketplace');
  };

  const handleCreateOutfit = () => {
    // Save the purchased item for try-on
    const tryOnData = {
      type: 'marketplace',
      category: product.category,
      imageUrl: getMarketplaceImagePath(product.images.asset),
      productId: product.id,
      title: product.title,
    };
    localStorage.setItem('tryon-item', JSON.stringify(tryOnData));
    setPurchaseComplete(false);
    navigate('/dressup');
  };

  const handleSendQuestion = () => {
    if (questionInput.trim()) {
      setUserQuestions([...userQuestions, { question: questionInput.trim() }]);
      setQuestionInput('');
      toast({
        title: "Soru Gönderildi",
        description: "Satıcı en kısa sürede yanıtlayacak.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Confetti show={showConfetti} />
      
      {/* Purchase Success Overlay */}
      {purchaseComplete && (
        <div className="fixed inset-0 z-[90] bg-background/95 flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-4 p-8 max-w-sm">
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Bu {getProductTypeName()} sana çok yakışacak! 🎉
            </h2>
            <p className="text-muted-foreground">Siparişiniz onaylandı ve satıcıya bildirildi.</p>
            
            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={handleCreateOutfit}
                className="w-full px-6 py-3 bg-gradient-to-r from-accent to-amber-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Yeni {getProductTypeName()}ünü kombinleyelim
              </button>
              <button 
                onClick={handleContinueShopping}
                className="w-full px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted/50 transition-colors"
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header - Solid white bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-medium text-foreground">Ürün Detayı</span>
          <button
            onClick={() => product && toggleFavorite(product.id)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${product && isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
            />
          </button>
        </div>
      </div>

      {/* Image Gallery - below header */}
      <div className="relative h-[50vh] bg-gray-100">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full touch-pan-x"
        >
          {galleryImages.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative bg-gray-100 flex items-center justify-center">
              <img
                src={img.src}
                alt={`${product.title} - ${img.label}`}
                className="w-full h-full object-contain"
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
                idx === currentIndex ? 'bg-foreground w-6' : 'bg-foreground/30 w-2'
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
            
            {/* User's Questions */}
            {userQuestions.map((uq, idx) => (
              <div key={`user-${idx}`} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent flex-shrink-0">
                    S
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{uq.question}</p>
                    <span className="text-xs text-muted-foreground">Sen</span>
                  </div>
                </div>
                <div className="ml-9 p-3 bg-muted/50 rounded-xl border-l-2 border-muted-foreground/30">
                  <p className="text-sm text-muted-foreground italic">Satıcı yanıtı bekleniyor...</p>
                </div>
              </div>
            ))}
          </div>

          {/* Question Input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
              placeholder="Satıcıya soru sor..."
              className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button
              onClick={handleSendQuestion}
              disabled={!questionInput.trim()}
              className="w-11 h-11 flex items-center justify-center bg-accent text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          {/* Teklif Ver */}
          <button 
            onClick={() => setOfferSheetOpen(true)}
            className="flex-shrink-0 px-4 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
          >
            <Tag className="w-4 h-4" />
            Teklif
          </button>

          {/* Satın Al */}
          <button 
            onClick={() => setPaymentDialogOpen(true)}
            className="flex-1 py-3 bg-foreground text-background rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
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

      {/* Offer Action Sheet */}
      <Sheet open={offerSheetOpen} onOpenChange={setOfferSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-center">Teklif Ver</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 pb-8">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Satıcıya indirim teklifi gönderin
            </p>
            
            <button
              onClick={() => handleOfferSelect('%10')}
              className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Percent className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">%10 İndirim</p>
                <p className="text-sm text-muted-foreground">₺{Math.round(product.price * 0.9)}</p>
              </div>
            </button>
            
            <button
              onClick={() => handleOfferSelect('%20')}
              className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Percent className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">%20 İndirim</p>
                <p className="text-sm text-muted-foreground">₺{Math.round(product.price * 0.8)}</p>
              </div>
            </button>
            
            <button
              onClick={() => handleOfferSelect('Özel tutar', true)}
              className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Özel Tutar</p>
                <p className="text-sm text-muted-foreground">Kendi fiyatınızı belirleyin</p>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Custom Offer Dialog */}
      <Dialog open={customOfferOpen} onOpenChange={setCustomOfferOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Özel Teklif</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Ürün fiyatı: <span className="font-semibold text-foreground">₺{product.price}</span>
            </p>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₺</span>
              <input
                type="number"
                value={customOfferAmount}
                onChange={(e) => setCustomOfferAmount(e.target.value)}
                placeholder="Teklifinizi girin"
                className="w-full pl-8 pr-4 py-4 bg-muted rounded-xl text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            
            <button
              onClick={handleCustomOfferSubmit}
              disabled={!customOfferAmount.trim()}
              className="w-full py-4 bg-gradient-to-r from-accent to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Tag className="w-5 h-5" />
              Teklif Gönder
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={(open) => {
        setPaymentDialogOpen(open);
        if (!open) setAddressConfirmed(false);
      }}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Ödeme Özeti</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <img
                src={getMarketplaceImagePath(product.images.asset)}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{product.title}</p>
                <p className="text-xs text-muted-foreground">{product.brand} · {product.size}</p>
              </div>
              <p className="font-bold text-accent">₺{product.price}</p>
            </div>

            {/* Address Confirmation */}
            <div 
              onClick={() => setAddressConfirmed(!addressConfirmed)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                addressConfirmed 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-border bg-muted hover:border-accent/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                  addressConfirmed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-muted-foreground'
                }`}>
                  {addressConfirmed && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Teslimat Adresi</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Etiler mh. Bıyıklı Mehmet Paşa sk. Keskin apt. 12/3 Beşiktaş/İstanbul
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-4 border border-accent rounded-xl bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">MIRA Cüzdan</p>
                  <p className="text-sm text-muted-foreground">Bakiye: ₺2,500</p>
                </div>
                <Check className="w-5 h-5 text-accent" />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ürün Fiyatı</span>
                <span>₺{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kargo</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>Toplam</span>
                <span className="text-accent">₺{product.price}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handlePurchase}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                addressConfirmed 
                  ? 'bg-gradient-to-r from-accent to-amber-600 text-white' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Ödemeyi Onayla
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confetti Animation Style */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
