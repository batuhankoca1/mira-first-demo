import { useState, useEffect, useCallback } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { AvatarContainer } from '@/components/AvatarContainer';
import { WardrobeItem, getItemsByCategory, CATEGORY_ORDER } from '@/data/wardrobeData';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

const STORAGE_KEY = 'dressup-outfit';

interface OutfitState {
  tops: number | null;
  bottoms: number | null;
  dresses: number | null;
  jackets: number | null;
  shoes: number | null;
  bags: number | null;
  accessories: number | null;
}

const DressUp = () => {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>('tops');
  const [outfit, setOutfit] = useState<OutfitState>({
    tops: null,
    bottoms: null,
    dresses: null,
    jackets: null,
    shoes: null,
    bags: null,
    accessories: null,
  });

  // Load outfit from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setOutfit(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save outfit to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outfit));
  }, [outfit]);

  // Get items for active category
  const categoryItems = getItemsByCategory(activeCategory);
  const currentIndex = outfit[activeCategory];

  // Select item by index
  const selectItem = (index: number | null) => {
    setOutfit((prev) => ({ ...prev, [activeCategory]: index }));
  };

  // Navigate within category
  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      const items = getItemsByCategory(activeCategory);

      setOutfit((prev) => {
        const current = prev[activeCategory];
        let newIndex: number | null;

        if (direction === 'next') {
          if (current === null) {
            newIndex = 0;
          } else if (current >= items.length - 1) {
            newIndex = null; // Back to "none"
          } else {
            newIndex = current + 1;
          }
        } else {
          if (current === null) {
            newIndex = items.length - 1;
          } else if (current <= 0) {
            newIndex = null;
          } else {
            newIndex = current - 1;
          }
        }

        return { ...prev, [activeCategory]: newIndex };
      });
    },
    [activeCategory]
  );

  // Shuffle all categories
  const shuffle = useCallback(() => {
    const newOutfit: OutfitState = {
      tops: null,
      bottoms: null,
      dresses: null,
      jackets: null,
      shoes: null,
      bags: null,
      accessories: null,
    };

    CATEGORY_ORDER.forEach((cat) => {
      const items = getItemsByCategory(cat);
      if (items.length > 0) {
        // 30% chance of "none" for optional categories
        const isOptional = ['dresses', 'jackets', 'bags', 'accessories'].includes(cat);
        if (isOptional && Math.random() < 0.3) {
          newOutfit[cat] = null;
        } else {
          newOutfit[cat] = Math.floor(Math.random() * items.length);
        }
      }
    });

    // If dress selected, clear tops/bottoms
    if (newOutfit.dresses !== null) {
      newOutfit.tops = null;
      newOutfit.bottoms = null;
    }

    setOutfit(newOutfit);
  }, []);

  // Build selected items map for AvatarContainer
  const getSelectedItems = (): Partial<Record<ClothingCategory, WardrobeItem | null>> => {
    const result: Partial<Record<ClothingCategory, WardrobeItem | null>> = {};
    
    (Object.keys(outfit) as ClothingCategory[]).forEach((cat) => {
      const idx = outfit[cat];
      if (idx !== null) {
        const items = getItemsByCategory(cat);
        result[cat] = items[idx] ?? null;
      } else {
        result[cat] = null;
      }
    });

    return result;
  };

  // Current item display
  const currentItem = currentIndex !== null ? categoryItems[currentIndex] : null;
  const categoryInfo = CATEGORIES.find((c) => c.value === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-md mx-auto px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-center">Builder</h1>
          <p className="text-sm text-muted-foreground text-center">Mix and match your outfits</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-md mx-auto px-4 py-4">
        {/* Avatar - Centered */}
        <div className="flex justify-center mb-4">
          <div className="transform scale-[0.85] origin-top">
            <AvatarContainer selectedItems={getSelectedItems()} />
          </div>
        </div>

        {/* Category Selector - Horizontal Scroll */}
        <div className="mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(({ value, label, icon }) => {
              const isActive = activeCategory === value;
              const hasItem = outfit[value] !== null;
              
              return (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : hasItem
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="mr-1.5">{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Item Carousel */}
        <div className="bg-secondary/30 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            {/* Prev Button */}
            <button
              onClick={() => navigate('prev')}
              className="w-10 h-10 flex-shrink-0 rounded-full bg-background shadow flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Items Row - Horizontal Scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2">
                {/* None option */}
                <button
                  onClick={() => selectItem(null)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all flex items-center justify-center ${
                    currentIndex === null
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-muted-foreground'
                  }`}
                >
                  <span className="text-xs text-muted-foreground">None</span>
                </button>

                {/* Category items */}
                {categoryItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => selectItem(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all overflow-hidden ${
                      currentIndex === idx
                        ? 'border-primary shadow-md'
                        : 'border-border bg-background hover:border-muted-foreground'
                    }`}
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.category}
                      className="w-full h-full object-contain p-1"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => navigate('next')}
              className="w-10 h-10 flex-shrink-0 rounded-full bg-background shadow flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Selection Label */}
          <div className="mt-3 text-center text-sm text-muted-foreground">
            {categoryInfo?.icon} {categoryInfo?.label}:{' '}
            <span className="font-medium text-foreground">
              {currentIndex !== null ? `Item ${currentIndex + 1}` : 'None'}
            </span>
          </div>
        </div>

        {/* Shuffle Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={shuffle}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle Outfit
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DressUp;
