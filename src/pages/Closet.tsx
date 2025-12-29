import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PhotoUpload } from '@/components/PhotoUpload';
import { useCloset } from '@/hooks/useCloset';
import { ClothingCategory } from '@/types/clothing';
import { Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import closetBg from '@/assets/closet-interior.png';
import avatarImg from '@/assets/avatar-default.png';

const CATEGORY_POSITIONS: { 
  category: ClothingCategory; 
  label: string; 
  position: string;
  labelPosition: string;
}[] = [
  { category: 'tops', label: 'Tops', position: 'top-[12%] left-[8%]', labelPosition: 'top-[10%] left-[12%]' },
  { category: 'bottoms', label: 'Bottoms', position: 'top-[12%] left-[35%]', labelPosition: 'top-[10%] left-[38%]' },
  { category: 'dresses', label: 'Dresses & Skirts', position: 'top-[12%] right-[8%]', labelPosition: 'top-[10%] right-[5%]' },
  { category: 'shoes', label: 'Shoes', position: 'bottom-[28%] left-[5%]', labelPosition: 'bottom-[42%] left-[8%]' },
  { category: 'accessories', label: 'Bags', position: 'bottom-[35%] right-[5%]', labelPosition: 'bottom-[48%] right-[10%]' },
  { category: 'outerwear', label: 'Accessory', position: 'bottom-[25%] right-[5%]', labelPosition: 'bottom-[32%] right-[8%]' },
];

const Closet = () => {
  const { items, addItem, removeItem } = useCloset();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ClothingCategory>('tops');

  const handleCategoryClick = (category: ClothingCategory) => {
    setUploadCategory(category);
    setShowUpload(true);
  };

  const getItemsByCategory = (category: ClothingCategory) => {
    return items.filter(item => item.category === category);
  };

  return (
    <div className="min-h-screen pb-24 overflow-hidden relative bg-warm-cream">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-amber-100/95 to-transparent pt-2 pb-8">
        <div className="container max-w-md mx-auto px-4">
          <div className="flex items-center justify-between">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-serif font-bold text-amber-900 tracking-wide">MIRA</h1>
              <p className="text-sm font-medium text-foreground">My Closet</p>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-800 hover:bg-amber-200 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Closet View */}
      <div className="relative w-full h-screen max-w-md mx-auto">
        {/* Closet Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${closetBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Category Labels */}
        {CATEGORY_POSITIONS.map(({ category, label, labelPosition }) => {
          const categoryItems = getItemsByCategory(category);
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "absolute z-20 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                "bg-white/90 text-amber-900 shadow-md hover:bg-white hover:scale-105",
                "backdrop-blur-sm border border-amber-200/50",
                labelPosition
              )}
            >
              {label}
              {categoryItems.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px]">
                  {categoryItems.length}
                </span>
              )}
            </button>
          );
        })}

        {/* Avatar */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 w-[55%] max-w-[220px]">
          <img 
            src={avatarImg} 
            alt="Your avatar" 
            className="w-full h-auto drop-shadow-lg"
          />
        </div>

        {/* User's clothing items floating preview */}
        {items.slice(0, 6).map((item, index) => {
          const positions = [
            'top-[18%] left-[5%] w-12 h-12',
            'top-[25%] right-[8%] w-10 h-10',
            'top-[40%] left-[3%] w-11 h-11',
            'bottom-[45%] right-[5%] w-10 h-10',
            'bottom-[35%] left-[8%] w-9 h-9',
            'top-[35%] right-[3%] w-11 h-11',
          ];
          return (
            <div
              key={item.id}
              className={cn(
                "absolute z-15 rounded-lg overflow-hidden shadow-lg border-2 border-white/80 hover:scale-110 transition-transform cursor-pointer",
                positions[index]
              )}
              onClick={() => removeItem(item.id)}
            >
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
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
