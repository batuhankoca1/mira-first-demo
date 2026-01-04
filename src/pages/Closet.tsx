import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { ClothingCategory } from '@/types/clothing';
import closetScene from '@/assets/closet-avatar.png';

// Clickable zones matching the new closet image layout
const CATEGORY_ZONES: {
  category: ClothingCategory;
  zone: string;
}[] = [
  // Top left - Üst Giyim
  { category: 'tops', zone: 'top-[2%] left-[2%] w-[46%] h-[22%]' },
  // Top right - Alt Giyim
  { category: 'bottoms', zone: 'top-[2%] left-[52%] w-[46%] h-[22%]' },
  // Middle left - Ceket
  { category: 'jackets', zone: 'top-[26%] left-[2%] w-[30%] h-[28%]' },
  // Middle right - Elbise
  { category: 'dresses', zone: 'top-[26%] left-[68%] w-[30%] h-[28%]' },
  // Bottom left - Ayakkabı
  { category: 'shoes', zone: 'top-[56%] left-[2%] w-[30%] h-[22%]' },
  // Bottom center - Çanta
  { category: 'bags', zone: 'top-[56%] left-[35%] w-[30%] h-[22%]' },
  // Bottom right - Aksesuar
  { category: 'accessories', zone: 'top-[56%] left-[68%] w-[30%] h-[22%]' },
];

const Closet = () => {
  const navigate = useNavigate();
  const [tappedZone, setTappedZone] = useState<ClothingCategory | null>(null);

  const handleZoneTap = (category: ClothingCategory) => {
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

        {/* Invisible clickable zones */}
        <div className="absolute inset-0 pt-14 pb-20">
          <div className="relative w-full h-full">
            {CATEGORY_ZONES.map(({ category, zone }) => {
              const isTapped = tappedZone === category;
              
              return (
                <button
                  key={category}
                  onClick={() => handleZoneTap(category)}
                  className={`absolute ${zone} transition-all duration-75 rounded-xl ${
                    isTapped 
                      ? 'bg-amber-300/30' 
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
