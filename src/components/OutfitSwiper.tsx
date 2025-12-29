import { useState, useCallback, useMemo } from 'react';
import { ClothingItem, ClothingCategory } from '@/types/clothing';
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
  shoesIndex: number;
}

export function OutfitSwiper({ items }: OutfitSwiperProps) {
  const [outfit, setOutfit] = useState<OutfitState>({
    topIndex: 0,
    bottomIndex: 0,
    dressIndex: -1,
    shoesIndex: 0,
  });
  const [activeCategory, setActiveCategory] = useState<'tops' | 'bottoms' | 'dresses' | 'shoes'>('tops');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const tops = useMemo(() => items.filter(i => i.category === 'tops'), [items]);
  const bottoms = useMemo(() => items.filter(i => i.category === 'bottoms'), [items]);
  const dresses = useMemo(() => items.filter(i => i.category === 'dresses'), [items]);
  const shoes = useMemo(() => items.filter(i => i.category === 'shoes'), [items]);

  const currentTop = tops[outfit.topIndex];
  const currentBottom = bottoms[outfit.bottomIndex];
  const currentDress = outfit.dressIndex >= 0 ? dresses[outfit.dressIndex] : undefined;
  const currentShoes = shoes[outfit.shoesIndex];

  const swipe = useCallback((direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      setOutfit(prev => {
        const newOutfit = { ...prev };
        const delta = direction === 'right' ? 1 : -1;

        switch (activeCategory) {
          case 'tops':
            if (tops.length > 0) {
              newOutfit.topIndex = (prev.topIndex + delta + tops.length) % tops.length;
              newOutfit.dressIndex = -1;
            }
            break;
          case 'bottoms':
            if (bottoms.length > 0) {
              newOutfit.bottomIndex = (prev.bottomIndex + delta + bottoms.length) % bottoms.length;
              newOutfit.dressIndex = -1;
            }
            break;
          case 'dresses':
            if (dresses.length > 0) {
              if (prev.dressIndex === -1) {
                newOutfit.dressIndex = direction === 'right' ? 0 : dresses.length - 1;
              } else {
                const next = prev.dressIndex + delta;
                if (next < 0 || next >= dresses.length) {
                  newOutfit.dressIndex = -1;
                } else {
                  newOutfit.dressIndex = next;
                }
              }
            }
            break;
          case 'shoes':
            if (shoes.length > 0) {
              newOutfit.shoesIndex = (prev.shoesIndex + delta + shoes.length) % shoes.length;
            }
            break;
        }

        return newOutfit;
      });
      setSwipeDirection(null);
    }, 150);
  }, [activeCategory, tops.length, bottoms.length, dresses.length, shoes.length]);

  const shuffle = useCallback(() => {
    setOutfit({
      topIndex: tops.length > 0 ? Math.floor(Math.random() * tops.length) : 0,
      bottomIndex: bottoms.length > 0 ? Math.floor(Math.random() * bottoms.length) : 0,
      dressIndex: -1,
      shoesIndex: shoes.length > 0 ? Math.floor(Math.random() * shoes.length) : 0,
    });
  }, [tops.length, bottoms.length, shoes.length]);

  const categoryButtons: { key: 'tops' | 'bottoms' | 'dresses' | 'shoes'; label: string; count: number }[] = [
    { key: 'tops', label: '👕', count: tops.length },
    { key: 'bottoms', label: '👖', count: bottoms.length },
    { key: 'dresses', label: '👗', count: dresses.length },
    { key: 'shoes', label: '👟', count: shoes.length },
  ];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-4xl">🪞</span>
        </div>
        <p className="text-lg font-medium text-foreground mb-1">No clothes yet</p>
        <p className="text-sm text-muted-foreground">Add items to your closet first</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar */}
      <div 
        className={cn(
          "relative w-full transition-transform duration-150",
          swipeDirection === 'left' && "translate-x-[-10px]",
          swipeDirection === 'right' && "translate-x-[10px]"
        )}
      >
        <Avatar2D
          top={currentDress ? undefined : currentTop}
          bottom={currentDress ? undefined : currentBottom}
          dress={currentDress}
          shoes={currentShoes}
          className="h-[350px]"
        />
      </div>

      {/* Category Selector */}
      <div className="flex gap-2">
        {categoryButtons.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            disabled={count === 0}
            className={cn(
              "relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200",
              activeCategory === key
                ? "bg-primary text-primary-foreground scale-110 shadow-elevated"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              count === 0 && "opacity-40 cursor-not-allowed"
            )}
          >
            {label}
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Swipe Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="icon"
          size="icon-lg"
          onClick={() => swipe('left')}
          className="rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="accent"
          size="icon-lg"
          onClick={shuffle}
          className="rounded-full"
        >
          <Shuffle className="w-5 h-5" />
        </Button>

        <Button
          variant="icon"
          size="icon-lg"
          onClick={() => swipe('right')}
          className="rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Current item indicator */}
      <p className="text-sm text-muted-foreground">
        Swipe to change{' '}
        <span className="font-medium text-foreground">
          {activeCategory === 'dresses' && outfit.dressIndex === -1 
            ? 'none selected' 
            : activeCategory}
        </span>
      </p>
    </div>
  );
}
