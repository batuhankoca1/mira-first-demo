import { useState, useCallback, useMemo } from 'react';
import { ClothingItem } from '@/types/clothing';
import { Avatar2D } from './Avatar2D';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutfitSwiperProps {
  items: ClothingItem[];
}

interface OutfitState {
  topIndex: number;
  bottomIndex: number;
  dressIndex: number;
  jacketIndex: number;
  shoesIndex: number;
  bagIndex: number;
  accessoryIndex: number;
}

type SwipeCategory = 'tops' | 'bottoms' | 'dresses' | 'jackets' | 'shoes' | 'bags' | 'accessories';

export function OutfitSwiper({ items }: OutfitSwiperProps) {
  const [outfit, setOutfit] = useState<OutfitState>({
    topIndex: 0,
    bottomIndex: 0,
    dressIndex: -1,
    jacketIndex: -1,
    shoesIndex: 0,
    bagIndex: -1,
    accessoryIndex: -1,
  });
  const [activeCategory, setActiveCategory] = useState<SwipeCategory>('tops');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const tops = useMemo(() => items.filter(i => i.category === 'tops'), [items]);
  const bottoms = useMemo(() => items.filter(i => i.category === 'bottoms'), [items]);
  const dresses = useMemo(() => items.filter(i => i.category === 'dresses'), [items]);
  const jackets = useMemo(() => items.filter(i => i.category === 'jackets'), [items]);
  const shoes = useMemo(() => items.filter(i => i.category === 'shoes'), [items]);
  const bags = useMemo(() => items.filter(i => i.category === 'bags'), [items]);
  const accessories = useMemo(() => items.filter(i => i.category === 'accessories'), [items]);

  const currentTop = tops[outfit.topIndex];
  const currentBottom = bottoms[outfit.bottomIndex];
  const currentDress = outfit.dressIndex >= 0 ? dresses[outfit.dressIndex] : undefined;
  const currentJacket = outfit.jacketIndex >= 0 ? jackets[outfit.jacketIndex] : undefined;
  const currentShoes = shoes[outfit.shoesIndex];
  const currentBag = outfit.bagIndex >= 0 ? bags[outfit.bagIndex] : undefined;
  const currentAccessory = outfit.accessoryIndex >= 0 ? accessories[outfit.accessoryIndex] : undefined;

  const getCategoryItems = useCallback((cat: SwipeCategory) => {
    switch (cat) {
      case 'tops': return tops;
      case 'bottoms': return bottoms;
      case 'dresses': return dresses;
      case 'jackets': return jackets;
      case 'shoes': return shoes;
      case 'bags': return bags;
      case 'accessories': return accessories;
    }
  }, [tops, bottoms, dresses, jackets, shoes, bags, accessories]);

  const getIndexKey = (cat: SwipeCategory): keyof OutfitState => {
    switch (cat) {
      case 'tops': return 'topIndex';
      case 'bottoms': return 'bottomIndex';
      case 'dresses': return 'dressIndex';
      case 'jackets': return 'jacketIndex';
      case 'shoes': return 'shoesIndex';
      case 'bags': return 'bagIndex';
      case 'accessories': return 'accessoryIndex';
    }
  };

  const swipe = useCallback((direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      setOutfit(prev => {
        const newOutfit = { ...prev };
        const delta = direction === 'right' ? 1 : -1;
        const catItems = getCategoryItems(activeCategory);
        const indexKey = getIndexKey(activeCategory);
        const currentIndex = prev[indexKey];

        if (catItems.length === 0) return prev;

        // For optional categories (dress, jacket, bag, accessory), -1 means "none"
        const isOptional = ['dresses', 'jackets', 'bags', 'accessories'].includes(activeCategory);
        
        if (isOptional) {
          const newIndex = currentIndex + delta;
          if (newIndex < -1) {
            (newOutfit as any)[indexKey] = catItems.length - 1;
          } else if (newIndex >= catItems.length) {
            (newOutfit as any)[indexKey] = -1;
          } else {
            (newOutfit as any)[indexKey] = newIndex;
          }
          
          // If selecting a dress, clear top/bottom indices
          if (activeCategory === 'dresses' && newOutfit.dressIndex >= 0) {
            // Keep dress, dress replaces top+bottom visually
          }
        } else {
          // Required categories cycle through available items
          (newOutfit as any)[indexKey] = (currentIndex + delta + catItems.length) % catItems.length;
        }

        return newOutfit;
      });
      setSwipeDirection(null);
    }, 120);
  }, [activeCategory, getCategoryItems]);

  const shuffle = useCallback(() => {
    setOutfit({
      topIndex: tops.length > 0 ? Math.floor(Math.random() * tops.length) : 0,
      bottomIndex: bottoms.length > 0 ? Math.floor(Math.random() * bottoms.length) : 0,
      dressIndex: -1,
      jacketIndex: jackets.length > 0 && Math.random() > 0.5 ? Math.floor(Math.random() * jackets.length) : -1,
      shoesIndex: shoes.length > 0 ? Math.floor(Math.random() * shoes.length) : 0,
      bagIndex: bags.length > 0 && Math.random() > 0.7 ? Math.floor(Math.random() * bags.length) : -1,
      accessoryIndex: accessories.length > 0 && Math.random() > 0.7 ? Math.floor(Math.random() * accessories.length) : -1,
    });
  }, [tops.length, bottoms.length, jackets.length, shoes.length, bags.length, accessories.length]);

  const categoryButtons: { key: SwipeCategory; label: string; count: number }[] = [
    { key: 'tops', label: '👕', count: tops.length },
    { key: 'bottoms', label: '👖', count: bottoms.length },
    { key: 'dresses', label: '👗', count: dresses.length },
    { key: 'jackets', label: '🧥', count: jackets.length },
    { key: 'shoes', label: '👟', count: shoes.length },
    { key: 'bags', label: '👜', count: bags.length },
    { key: 'accessories', label: '💍', count: accessories.length },
  ];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-4xl">🪞</span>
        </div>
        <p className="text-lg font-medium text-foreground mb-1">Henüz kıyafet yok</p>
        <p className="text-sm text-muted-foreground">Önce gardıroba item ekle</p>
      </div>
    );
  }

  const currentCatIndex = outfit[getIndexKey(activeCategory)];
  const currentCatItems = getCategoryItems(activeCategory);
  const isOptional = ['dresses', 'jackets', 'bags', 'accessories'].includes(activeCategory);
  const displayIndex = isOptional && currentCatIndex === -1 ? 'yok' : `${currentCatIndex + 1}/${currentCatItems.length}`;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar */}
      <div 
        className={cn(
          "relative w-full transition-transform duration-120",
          swipeDirection === 'left' && "-translate-x-2",
          swipeDirection === 'right' && "translate-x-2"
        )}
      >
        <Avatar2D
          top={currentDress ? undefined : currentTop}
          bottom={currentDress ? undefined : currentBottom}
          dress={currentDress}
          jacket={currentJacket}
          shoes={currentShoes}
          bag={currentBag}
          accessory={currentAccessory}
          className="h-[350px]"
        />
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {categoryButtons.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            disabled={count === 0}
            className={cn(
              "relative w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-200",
              activeCategory === key
                ? "bg-primary text-primary-foreground scale-110 shadow-elevated"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              count === 0 && "opacity-40 cursor-not-allowed"
            )}
          >
            {label}
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Swipe Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => swipe('left')}
          className="rounded-full w-12 h-12"
          disabled={currentCatItems.length === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={shuffle}
          className="rounded-full w-14 h-14"
        >
          <Shuffle className="w-5 h-5" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={() => swipe('right')}
          className="rounded-full w-12 h-12"
          disabled={currentCatItems.length === 0}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Current item indicator */}
      <p className="text-sm text-muted-foreground">
        {activeCategory}: <span className="font-medium text-foreground">{displayIndex}</span>
      </p>
    </div>
  );
}
