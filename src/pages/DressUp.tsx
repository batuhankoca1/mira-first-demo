import { useState, useEffect, useCallback } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { AvatarContainer } from '@/components/AvatarContainer';
import { DemoItem, getItemsByCategory, CATEGORY_ORDER } from '@/data/demoCloset';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

const STORAGE_KEY = 'dressup-outfit';

// Category display config - map from CATEGORIES which uses 'value' to our format
const CATEGORY_CONFIG = CATEGORIES.map((c) => ({
  category: c.value,
  label: c.label,
  icon: c.icon,
}));

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

  // Navigate within category
  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      const items = getItemsByCategory(activeCategory);
      const maxIndex = items.length; // +1 for "none" state (null)

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
  const getSelectedItems = (): Partial<Record<ClothingCategory, DemoItem | null>> => {
    const result: Partial<Record<ClothingCategory, DemoItem | null>> = {};
    
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
  const displayText = currentItem ? `${currentIndex! + 1} / ${categoryItems.length}` : 'None';

  return (
    <div className="min-h-screen bg-background pb-28 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-md mx-auto px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-center">Dress Up</h1>
          <p className="text-sm text-muted-foreground text-center">Mix and match your outfits</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-md mx-auto px-4 py-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <AvatarContainer selectedItems={getSelectedItems()} />
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORY_CONFIG.map(({ category, label, icon }) => {
            const isActive = activeCategory === category;
            const hasItem = outfit[category] !== null;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : hasItem
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Swipe Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => navigate('prev')}
            className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="min-w-[100px] text-center">
            <p className="text-lg font-medium">{displayText}</p>
          </div>

          <button
            onClick={() => navigate('next')}
            className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Shuffle Button */}
        <div className="flex justify-center">
          <button
            onClick={shuffle}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
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
