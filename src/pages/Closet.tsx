import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PhotoUpload } from '@/components/PhotoUpload';
import { CategoryInventory } from '@/components/CategoryInventory';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ClothingCategory } from '@/types/clothing';
import { Menu, User } from 'lucide-react';
import closetScene from '@/assets/closet-layout-new.png';

// Shelf zones mapped to the new layout
const SHELF_ZONES: {
  category: ClothingCategory;
  zone: string;
}[] = [
  { category: 'tops', zone: 'top-[5%] left-[3%] w-[35%] h-[14%]' },
  { category: 'bottoms', zone: 'top-[5%] right-[3%] w-[35%] h-[14%]' },
  { category: 'jackets', zone: 'top-[19%] left-[3%] w-[32%] h-[18%]' },
  { category: 'dresses', zone: 'top-[19%] right-[3%] w-[32%] h-[18%]' },
  { category: 'shoes', zone: 'top-[38%] left-[3%] w-[28%] h-[28%]' },
  { category: 'bags', zone: 'top-[38%] right-[3%] w-[25%] h-[14%]' },
  { category: 'accessories', zone: 'top-[52%] right-[3%] w-[25%] h-[14%]' },
];

const Closet = () => {
  const { wardrobe, addItem, removeItem } = useWardrobe();
  const [showUpload, setShowUpload] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('tops');
  const [tappedZone, setTappedZone] = useState<ClothingCategory | null>(null);

  const handleShelfTap = (category: ClothingCategory) => {
    setSelectedCategory(category);
    setTappedZone(category);

    setTimeout(() => {
      setTappedZone(null);
      setShowInventory(true);
    }, 100);
  };

  const handleAddNew = () => {
    setShowInventory(false);
    setShowUpload(true);
  };

  const handleSaved = (
    imageUrl: string,
    category: ClothingCategory,
    overrides?: { scale?: number; anchorOffset?: { x: number; y: number } }
  ) => {
    addItem(imageUrl, category, overrides);
    setShowUpload(false);
    setSelectedCategory(category);
    setShowInventory(true);
  };

  const handleDeleteItem = (id: string) => {
    removeItem(id);
  };

  const getItemCount = (category: ClothingCategory) => {
    return wardrobe[category]?.length ?? 0;
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

        {/* Invisible shelf tap zones */}
        <div className="absolute inset-0 pt-14 pb-20">
          <div className="relative w-full h-full">
            {SHELF_ZONES.map(({ category, zone }) => {
              const count = getItemCount(category);
              const isTapped = tappedZone === category;
              
              return (
                <button
                  key={category}
                  onClick={() => handleShelfTap(category)}
                  className={`absolute ${zone} transition-all duration-75 rounded-xl ${
                    isTapped 
                      ? 'bg-white/25 ring-2 ring-amber-400/60' 
                      : 'bg-transparent active:bg-white/15'
                  }`}
                  aria-label={`Open ${category}`}
                >
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Inventory Modal */}
      {showInventory && (
        <CategoryInventory
          category={selectedCategory}
          wardrobe={wardrobe}
          onClose={() => setShowInventory(false)}
          onAddNew={handleAddNew}
          onDeleteItem={handleDeleteItem}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUpload
          onSaved={handleSaved}
          onClose={() => setShowUpload(false)}
          defaultCategory={selectedCategory}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Closet;
