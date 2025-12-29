import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PhotoUpload } from '@/components/PhotoUpload';
import { useCloset } from '@/hooks/useCloset';
import { ClothingCategory } from '@/types/clothing';
import closetScene from '@/assets/closet-scene-full.png';

// Shelf zones mapped precisely to the illustrated wardrobe
// These invisible tap zones overlay the physical shelf areas
const SHELF_ZONES: {
  category: ClothingCategory;
  label: string;
  zone: string;
}[] = [
  { 
    category: 'tops', 
    label: 'Tops',
    zone: 'top-[12%] left-[8%] w-[25%] h-[18%]'
  },
  { 
    category: 'bottoms', 
    label: 'Bottoms',
    zone: 'top-[12%] left-[33%] w-[22%] h-[18%]'
  },
  { 
    category: 'dresses', 
    label: 'Dresses & Skirts',
    zone: 'top-[12%] right-[5%] w-[28%] h-[35%]'
  },
  { 
    category: 'shoes', 
    label: 'Shoes',
    zone: 'top-[55%] left-[3%] w-[30%] h-[25%]'
  },
  { 
    category: 'accessories', 
    label: 'Bags',
    zone: 'top-[55%] right-[3%] w-[25%] h-[18%]'
  },
  { 
    category: 'outerwear', 
    label: 'Accessory',
    zone: 'top-[73%] right-[3%] w-[25%] h-[12%]'
  },
];

const Closet = () => {
  const { items, addItem } = useCloset();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ClothingCategory>('tops');
  const [tappedZone, setTappedZone] = useState<ClothingCategory | null>(null);

  const handleShelfTap = (category: ClothingCategory) => {
    setUploadCategory(category);
    setTappedZone(category);
    
    // Brief visual feedback then open
    setTimeout(() => {
      setTappedZone(null);
      setShowUpload(true);
    }, 120);
  };

  const getItemCount = (category: ClothingCategory) => {
    return items.filter(item => item.category === category).length;
  };

  return (
    <div className="fixed inset-0 bg-[#f5ebe0]">
      {/* Full Scene Container */}
      <div className="relative w-full h-full max-w-md mx-auto overflow-hidden">
        {/* The Complete Illustrated Closet Scene */}
        <img 
          src={closetScene}
          alt="My Closet"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* Invisible Shelf Tap Zones */}
        {SHELF_ZONES.map(({ category, zone }) => {
          const count = getItemCount(category);
          const isTapped = tappedZone === category;
          
          return (
            <button
              key={category}
              onClick={() => handleShelfTap(category)}
              className={`absolute ${zone} transition-all duration-100 rounded-lg ${
                isTapped 
                  ? 'bg-white/25 ring-2 ring-white/40' 
                  : 'bg-transparent active:bg-white/15'
              }`}
              aria-label={`Open ${category}`}
            >
              {/* Item count badge - only shows if user has added items */}
              {count > 0 && (
                <span className="absolute -bottom-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-amber-800 text-white text-[11px] font-semibold flex items-center justify-center shadow-md">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUpload
          onUpload={addItem}
          onClose={() => setShowUpload(false)}
          defaultCategory={uploadCategory}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Closet;
