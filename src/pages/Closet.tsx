import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { WARDROBE_ITEMS } from '@/data/wardrobeData';
import { useDemoWardrobeItems } from '@/hooks/useDemoWardrobeItems';
import { ClothingCategory } from '@/types/clothing';
import { Menu, User } from 'lucide-react';
import closetScene from '@/assets/closet-layout-new.png';

// Active shelf zones - positioned over folded clothes in illustration
const SHELF_ZONES: {
  category: ClothingCategory;
  zone: string;
  label: string;
}[] = [
  { category: 'tops', zone: 'top-[8%] left-[5%] w-[32%] h-[12%]', label: 'Tops' },
  { category: 'bottoms', zone: 'top-[8%] right-[5%] w-[32%] h-[12%]', label: 'Bottoms' },
  { category: 'bags', zone: 'top-[58%] right-[5%] w-[28%] h-[12%]', label: 'Bags' },
];

// Visual-only labels (not clickable, just for illustration context)
const VISUAL_LABELS = [
  { label: 'Shoes', position: 'bottom-[22%] left-[8%]' },
  { label: 'Accessories', position: 'top-[42%] right-[8%]' },
];

const Closet = () => {
  const navigate = useNavigate();
  const [tappedZone, setTappedZone] = useState<ClothingCategory | null>(null);

  const { getItemsByCategory } = useDemoWardrobeItems(WARDROBE_ITEMS);

  const handleShelfTap = (category: ClothingCategory) => {
    setTappedZone(category);
    setTimeout(() => {
      setTappedZone(null);
      navigate(`/closet/${category}`);
    }, 100);
  };

  const getItemCount = (category: ClothingCategory) => {
    return getItemsByCategory(category).length;
  };

  return (
    <div className="fixed inset-0 bg-[#fdf6ed]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#fdf6ed] via-[#fdf6ed]/90 to-transparent">
        <div className="max-w-md mx-auto px-4 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <button className="w-10 h-10 flex items-center justify-center text-amber-900/70 hover:text-amber-900 transition-colors">
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-serif font-bold text-amber-800 tracking-wider">MIRA</h1>
              <p className="text-sm font-medium text-amber-900">My Closet</p>
            </div>
            
            <button className="w-10 h-10 rounded-full border-2 border-amber-800/30 flex items-center justify-center text-amber-800 hover:bg-amber-100/50 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Scene */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <img 
          src={closetScene}
          alt="My Closet"
          className="absolute inset-0 w-full h-full object-contain object-center pt-14 pb-20"
          draggable={false}
        />

        {/* Interactive shelf zones with inline labels */}
        <div className="absolute inset-0 pt-14 pb-20">
          <div className="relative w-full h-full">
            {/* Active category buttons */}
            {SHELF_ZONES.map(({ category, zone, label }) => {
              const count = getItemCount(category);
              const isTapped = tappedZone === category;
              
              return (
                <button
                  key={category}
                  onClick={() => handleShelfTap(category)}
                  className={`absolute ${zone} transition-all duration-75 rounded-xl flex items-center justify-center ${
                    isTapped 
                      ? 'bg-amber-200/40 ring-2 ring-amber-500/60' 
                      : 'bg-amber-900/5 hover:bg-amber-100/30 active:bg-amber-200/40'
                  }`}
                  aria-label={`Open ${category}`}
                >
                  <span className="px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm text-amber-900 font-medium text-sm">
                    {label} <span className="text-amber-600/80 font-normal">({count})</span>
                  </span>
                </button>
              );
            })}

            {/* Visual-only labels for out-of-scope categories */}
            {VISUAL_LABELS.map(({ label, position }) => (
              <div
                key={label}
                className={`absolute ${position} pointer-events-none`}
              >
                <span className="px-2.5 py-1 rounded-md bg-white/60 backdrop-blur-sm text-amber-800/60 font-medium text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Closet;
