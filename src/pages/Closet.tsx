import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { ClothingCategory } from '@/types/clothing';
import closetScene from '@/assets/closet-avatar.png';

// Clickable zones matching the closet image layout precisely
const CATEGORY_ZONES: {
  category: ClothingCategory;
  zone: string;
}[] = [
  // Top left - Üst Giyim (sweater card)
  { category: 'tops', zone: 'top-[4%] left-[6%] w-[38%] h-[22%]' },
  // Top right - Alt Giyim (skirt card)
  { category: 'bottoms', zone: 'top-[4%] left-[56%] w-[38%] h-[22%]' },
  // Middle left - Ceket (trench coat card)
  { category: 'jackets', zone: 'top-[27%] left-[6%] w-[26%] h-[26%]' },
  // Middle right - Elbise (dress card)
  { category: 'dresses', zone: 'top-[27%] left-[68%] w-[26%] h-[26%]' },
  // Bottom left - Ayakkabı (shoes)
  { category: 'shoes', zone: 'top-[54%] left-[6%] w-[22%] h-[22%]' },
  // Bottom center - Çanta (bags)
  { category: 'bags', zone: 'top-[54%] left-[39%] w-[22%] h-[22%]' },
  // Bottom right - Aksesuar (necklace)
  { category: 'accessories', zone: 'top-[54%] left-[72%] w-[22%] h-[22%]' },
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
          className="absolute inset-0 w-full h-full object-contain object-center pt-[72px] pb-20"
          draggable={false}
        />

        {/* Invisible clickable zones */}
        <div className="absolute inset-0 pt-[72px] pb-20">
          <div className="relative w-full h-full">
            {CATEGORY_ZONES.map(({ category, zone }) => {
              const isTapped = tappedZone === category;
              
              return (
                <button
                  key={category}
                  onClick={() => handleZoneTap(category)}
                  className={`absolute ${zone} transition-all duration-75 rounded-xl border-2 border-dashed ${
                    isTapped 
                      ? 'bg-amber-300/30 border-amber-500' 
                      : 'border-transparent hover:border-amber-400 hover:bg-amber-100/20 active:bg-amber-200/30'
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
