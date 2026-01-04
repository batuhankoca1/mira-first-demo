import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { ClothingCategory } from '@/types/clothing';
import closetScene from '@/assets/closet-layout-new.png';

// Clickable zones covering shelf areas + labels in the illustration
// Measured from the closet-layout-new.png image (precise alignment)
const CATEGORY_ZONES: {
  category: ClothingCategory;
  zone: string;
}[] = [
  // Top row - TOPS (left side with folded clothes + hanging rail)
  { category: 'tops', zone: 'top-[11%] left-[4%] w-[44%] h-[20%]' },
  // Top row - BOTTOMS (right side with jeans)
  { category: 'bottoms', zone: 'top-[11%] left-[52%] w-[44%] h-[20%]' },
  // Second row left - JACKETS
  { category: 'jackets', zone: 'top-[31%] left-[4%] w-[44%] h-[15%]' },
  // Second row right - DRESSES
  { category: 'dresses', zone: 'top-[31%] left-[52%] w-[44%] h-[15%]' },
  // Third row left - SHOES (upper)
  { category: 'shoes', zone: 'top-[46%] left-[4%] w-[44%] h-[26%]' },
  // Third row right - BAGS + BELTS ACCESSORIES
  { category: 'bags', zone: 'top-[46%] left-[52%] w-[44%] h-[15%]' },
  // Bottom right - ACCESSORY
  { category: 'accessories', zone: 'top-[61%] left-[52%] w-[44%] h-[15%]' },
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

  return (
    <div className="fixed inset-0 bg-[#fdf6ed]">
      <AppHeader />

      {/* Full Scene */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <img 
          src={closetScene}
          alt="Dolabım"
          className="absolute inset-0 w-full h-full object-contain object-center pt-14 pb-20"
          draggable={false}
        />

        {/* Invisible clickable zones over the shelves */}
        <div className="absolute inset-0 pt-14 pb-20">
          <div className="relative w-full h-full">
            {CATEGORY_ZONES.map(({ category, zone }) => {
              const isTapped = tappedZone === category;
              
              return (
                <button
                  key={category}
                  onClick={() => handleShelfTap(category)}
                  className={`absolute ${zone} transition-all duration-75 rounded-lg ${
                    isTapped 
                      ? 'bg-amber-300/40' 
                      : 'hover:bg-amber-100/20 active:bg-amber-200/30'
                  }`}
                  aria-label={`${category} kategorisini aç`}
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
