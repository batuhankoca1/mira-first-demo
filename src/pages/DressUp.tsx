import { useState, useEffect, useCallback, useMemo } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { AvatarContainer } from '@/components/AvatarContainer';
import { SponsoredOverlay } from '@/components/SponsoredOverlay';
import { WardrobeItem, getItemsByCategory, CATEGORY_ORDER, SponsoredInfo } from '@/data/wardrobeData';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { ChevronLeft, ChevronRight, Shuffle, Briefcase, Coffee, Umbrella, Lock, LockOpen, Sparkles, Layers, Wand2 } from 'lucide-react';
import bgOffice from '@/assets/bg-office.jpg';
import bgCoffee from '@/assets/bg-coffee.jpg';
import bgBeach from '@/assets/bg-beach.jpg';

const STORAGE_KEY = 'dressup-outfit';

interface OutfitState {
  tops: number | null;
  bottoms: number | null;
}

interface LockedState {
  tops: boolean;
  bottoms: boolean;
}

type Environment = 'office' | 'coffee' | 'beach';

const ENVIRONMENTS: { id: Environment; label: string; icon: React.ReactNode; bg: string }[] = [
  { id: 'office', label: 'Ofis', icon: <Briefcase className="w-4 h-4" />, bg: bgOffice },
  { id: 'coffee', label: 'Kahve', icon: <Coffee className="w-4 h-4" />, bg: bgCoffee },
  { id: 'beach', label: 'Plaj', icon: <Umbrella className="w-4 h-4" />, bg: bgBeach },
];

const DressUp = () => {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>('tops');
  const [environment, setEnvironment] = useState<Environment>('office');
  const [outfit, setOutfit] = useState<OutfitState>({
    tops: 0,
    bottoms: 0,
  });
  const [locked, setLocked] = useState<LockedState>({
    tops: false,
    bottoms: false,
  });
  const [isTuckedIn, setIsTuckedIn] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Load outfit from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOutfit({
          tops: parsed.tops ?? null,
          bottoms: parsed.bottoms ?? null,
        });
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

  // Toggle lock for active category
  const toggleLock = () => {
    setLocked((prev) => ({ ...prev, [activeCategory]: !prev[activeCategory] }));
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
            newIndex = null;
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

  // Shuffle only unlocked categories
  const shuffle = useCallback(() => {
    setIsShuffling(true);
    
    setTimeout(() => {
      setOutfit((prev) => {
        const newOutfit: OutfitState = { ...prev };

        CATEGORY_ORDER.forEach((cat) => {
          if (locked[cat]) return;

          const items = getItemsByCategory(cat);
          if (items.length > 0) {
            newOutfit[cat] = Math.floor(Math.random() * items.length);
          }
        });

        return newOutfit;
      });
      setIsShuffling(false);
    }, 500);
  }, [locked]);

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

  // Check if any currently selected item is sponsored
  const activeSponsoredInfo = useMemo((): SponsoredInfo | null => {
    const selectedItems = getSelectedItems();
    for (const cat of CATEGORY_ORDER) {
      const item = selectedItems[cat];
      if (item?.isSponsored && item.sponsoredInfo) {
        return item.sponsoredInfo;
      }
    }
    return null;
  }, [outfit]);

  // Current item display
  const categoryInfo = CATEGORIES.find((c) => c.value === activeCategory);
  const currentEnv = ENVIRONMENTS.find((e) => e.id === environment);

  return (
    <div className="fixed inset-0 bg-[#fdf6ed] flex flex-col">
      <AppHeader />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-28">
        <div className="max-w-md mx-auto px-4 py-4 flex flex-col h-full">
          {/* Environment Buttons */}
          <div className="flex justify-center gap-3 mb-4">
            {ENVIRONMENTS.map((env) => (
              <button
                key={env.id}
                onClick={() => setEnvironment(env.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  environment === env.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md ${
                    environment === env.id ? 'ring-2 ring-amber-600 ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundImage: `url(${env.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <span className="text-white drop-shadow-lg">{env.icon}</span>
                </div>
                <span className="text-xs font-medium text-amber-800">{env.label}</span>
              </button>
            ))}
          </div>

          {/* Avatar with environment background */}
          <div
            className="flex-1 min-h-[380px] mb-2 rounded-2xl overflow-hidden transition-all duration-500 relative"
            style={{
              backgroundImage: `url(${currentEnv?.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <AvatarContainer selectedItems={getSelectedItems()} isTuckedIn={isTuckedIn} />
            
            {/* Sponsored Overlay */}
            <SponsoredOverlay 
              isVisible={activeSponsoredInfo !== null}
              sponsoredInfo={activeSponsoredInfo || { brand: '', price: '', fabric: '', rating: 0, buyLink: '#' }}
            />
          </div>

          {/* Category Selector with Lock */}
          <div className="mb-2">
            <div className="flex gap-1.5 justify-center items-center">
              {CATEGORIES.map(({ value, label, icon }) => {
                const isActive = activeCategory === value;
                const hasItem = outfit[value] !== null;
                const isLocked = locked[value];

                return (
                  <button
                    key={value}
                    onClick={() => setActiveCategory(value)}
                    className={`relative px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-md'
                        : hasItem
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    <span className="mr-1">{icon}</span>
                    {label}
                    {isLocked && (
                      <Lock className="absolute -top-1 -right-1 w-3 h-3 text-amber-600 bg-white rounded-full p-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Carousel */}
          <div className="bg-white/50 rounded-xl p-3 border border-amber-200/50">
            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                onClick={() => navigate('prev')}
                className="w-8 h-8 flex-shrink-0 rounded-full bg-white shadow flex items-center justify-center hover:bg-amber-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-amber-800" />
              </button>

              {/* Items Row - Horizontal scroll */}
              <div className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory touch-pan-x">
                <div className="flex gap-2 w-max px-1">
                  {/* None option */}
                  <button
                    onClick={() => selectItem(null)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 transition-all flex items-center justify-center snap-center ${
                      currentIndex === null
                        ? 'border-amber-600 bg-amber-100'
                        : 'border-amber-200 bg-white hover:border-amber-400'
                    }`}
                  >
                    <span className="text-xs text-amber-700">Yok</span>
                  </button>

                  {/* Category items */}
                  {categoryItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => selectItem(idx)}
                      className={`relative flex-shrink-0 w-14 h-14 rounded-lg border-2 transition-all overflow-hidden snap-center ${
                        currentIndex === idx
                          ? item.isSponsored
                            ? 'border-amber-500 shadow-md ring-2 ring-amber-400/50'
                            : 'border-amber-600 shadow-md'
                          : 'border-amber-200 bg-white hover:border-amber-400'
                      }`}
                      style={{
                        backgroundImage:
                          'linear-gradient(45deg, #f0ebe3 25%, transparent 25%), linear-gradient(-45deg, #f0ebe3 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0ebe3 75%), linear-gradient(-45deg, transparent 75%, #f0ebe3 75%)',
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
                      {/* Sponsored indicator */}
                      {item.isSponsored && (
                        <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                          <Sparkles className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => navigate('next')}
                className="w-8 h-8 flex-shrink-0 rounded-full bg-white shadow flex items-center justify-center hover:bg-amber-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-amber-800" />
              </button>
            </div>

            {/* Current Selection Label + Lock Button */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="text-xs text-amber-800/70">
                {categoryInfo?.icon} {categoryInfo?.label}:{' '}
                <span className="font-medium text-amber-900">
                  {currentIndex !== null ? `Parça ${currentIndex + 1}` : 'Yok'}
                </span>
              </div>
              <button
                onClick={toggleLock}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                  locked[activeCategory]
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {locked[activeCategory] ? (
                  <>
                    <Lock className="w-2.5 h-2.5" />
                    Kilitli
                  </>
                ) : (
                  <>
                    <LockOpen className="w-2.5 h-2.5" />
                    Kilitle
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mt-2">
            {/* Tuck Toggle - Single Button */}
            <button
              onClick={() => setIsTuckedIn((prev) => !prev)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm ${
                isTuckedIn
                  ? 'bg-amber-700 text-white border-amber-700'
                  : 'bg-transparent text-amber-700 border-amber-400 hover:bg-amber-50'
              }`}
            >
              <Layers className={`w-4 h-4 transition-transform duration-200 ${isTuckedIn ? 'rotate-180' : ''}`} />
              {isTuckedIn ? 'İçeride' : 'Dışarıda'}
            </button>

            {/* Shuffle Button */}
            <button
              onClick={shuffle}
              disabled={isShuffling}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-700 text-white text-sm font-medium hover:bg-amber-800 transition-colors shadow-lg disabled:opacity-70"
            >
              <Wand2 className={`w-4 h-4 transition-transform duration-500 ${isShuffling ? 'animate-spin' : ''}`} />
              Bana Kombin Yap
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DressUp;
