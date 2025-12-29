import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PhotoUpload } from '@/components/PhotoUpload';
import { useCloset } from '@/hooks/useCloset';
import { ClothingCategory } from '@/types/clothing';
import { Menu, User } from 'lucide-react';
import wardrobeBg from '@/assets/wardrobe-scene.png';
import avatarImg from '@/assets/avatar-transparent.png';

// Shelf zones mapped to the wardrobe image - these are tap targets
const SHELF_ZONES: {
  category: ClothingCategory;
  label: string;
  zone: string; // positioning classes for the invisible tap zone
}[] = [
  { 
    category: 'tops', 
    label: 'Tops',
    zone: 'top-[2%] left-[10%] right-[18%] h-[12%]' // Top shelf with folded clothes
  },
  { 
    category: 'outerwear', 
    label: 'Outerwear',
    zone: 'top-[14%] left-[10%] right-[18%] h-[22%]' // Hanging rail with jackets
  },
  { 
    category: 'shoes', 
    label: 'Shoes',
    zone: 'top-[36%] left-[0%] w-[18%] h-[28%]' // Left shoe shelves
  },
  { 
    category: 'accessories', 
    label: 'Bags & Accessories',
    zone: 'top-[14%] right-[0%] w-[16%] h-[52%]' // Right side shelves with bags
  },
];

const Closet = () => {
  const { items, addItem } = useCloset();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ClothingCategory>('tops');
  const [activeZone, setActiveZone] = useState<ClothingCategory | null>(null);

  const handleShelfTap = (category: ClothingCategory) => {
    setUploadCategory(category);
    setActiveZone(category);
    
    // Brief highlight then open upload
    setTimeout(() => {
      setActiveZone(null);
      setShowUpload(true);
    }, 150);
  };

  const getItemCount = (category: ClothingCategory) => {
    return items.filter(item => item.category === category).length;
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Header - floating over scene */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="container max-w-md mx-auto px-4 pt-3">
          <div className="flex items-center justify-between pointer-events-auto">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900/70 hover:text-amber-900 hover:bg-amber-100/50 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-serif font-bold text-amber-900 tracking-wide drop-shadow-sm">MIRA</h1>
              <p className="text-xs font-medium text-amber-800/80">My Closet</p>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-amber-100/60 backdrop-blur-sm flex items-center justify-center text-amber-800 hover:bg-amber-100 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe Scene */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Background - the wardrobe */}
        <img 
          src={wardrobeBg}
          alt="Wardrobe"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Invisible shelf tap zones */}
        {SHELF_ZONES.map(({ category, label, zone }) => {
          const count = getItemCount(category);
          const isActive = activeZone === category;
          
          return (
            <button
              key={category}
              onClick={() => handleShelfTap(category)}
              className={`absolute ${zone} transition-all duration-150 ${
                isActive 
                  ? 'bg-white/30 backdrop-blur-[1px]' 
                  : 'bg-transparent hover:bg-white/10'
              }`}
              aria-label={`${label} - ${count} items`}
            >
              {/* Small item count badge - subtle, only shows if items exist */}
              {count > 0 && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-amber-900/80 text-white text-[10px] font-medium shadow-sm">
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* Avatar - positioned in the center empty space of wardrobe */}
        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[50%] max-w-[200px] pointer-events-none">
          <img 
            src={avatarImg} 
            alt="Your avatar" 
            className="w-full h-auto"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
            }}
          />
        </div>
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
