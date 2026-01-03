import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { getItemsByCategory } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import closetScene from '@/assets/closet-layout-new.png';

// Clickable zones positioned over the text labels in the illustration
// These are positioned relative to the image container
const CATEGORY_ZONES: {
  category: ClothingCategory;
  zone: string;
}[] = [
  // Top shelf labels
  { category: 'tops', zone: 'top-[12%] left-[18%] w-[14%] h-[5%]' },
  { category: 'bottoms', zone: 'top-[12%] left-[54%] w-[18%] h-[5%]' },
  // Second row (hanging area labels)
  { category: 'jackets', zone: 'top-[26%] left-[18%] w-[16%] h-[5%]' },
  { category: 'dresses', zone: 'top-[26%] left-[54%] w-[16%] h-[5%]' },
  // Lower sections
  { category: 'shoes', zone: 'top-[64%] left-[18%] w-[14%] h-[5%]' },
  { category: 'bags', zone: 'top-[64%] left-[56%] w-[12%] h-[5%]' },
  // Accessories section (right side)
  { category: 'accessories', zone: 'top-[72%] left-[54%] w-[20%] h-[5%]' },
];

const Closet = () => {
  const navigate = useNavigate();
  const [tappedZone, setTappedZone] = useState<ClothingCategory | null>(null);

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
      <AppHeader />

      {/* Full Scene */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <img 
          src={closetScene}
          alt="My Closet"
          className="absolute inset-0 w-full h-full object-contain object-center pt-14 pb-20"
          draggable={false}
        />

        {/* Invisible clickable zones over the text labels in illustration */}
        <div className="absolute inset-0 pt-14 pb-20">
          <div className="relative w-full h-full">
            {CATEGORY_ZONES.map(({ category, zone }) => {
              const isTapped = tappedZone === category;
              
              return (
                <button
                  key={category}
                  onClick={() => handleShelfTap(category)}
                  className={`absolute ${zone} transition-all duration-75 rounded-md ${
                    isTapped 
                      ? 'bg-amber-200/50' 
                      : 'hover:bg-amber-100/30 active:bg-amber-200/40'
                  }`}
                  aria-label={`Open ${category}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Closet;
