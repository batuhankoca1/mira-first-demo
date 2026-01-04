import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { ClothingCategory } from '@/types/clothing';
import closetAvatar from '@/assets/closet-avatar.png';

const CATEGORY_CARDS: {
  category: ClothingCategory;
  label: string;
  position: 'top-left' | 'top-right' | 'mid-left' | 'mid-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}[] = [
  { category: 'tops', label: 'Üst Giyim', position: 'top-left' },
  { category: 'bottoms', label: 'Alt Giyim', position: 'top-right' },
  { category: 'jackets', label: 'Ceket', position: 'mid-left' },
  { category: 'dresses', label: 'Elbise', position: 'mid-right' },
  { category: 'shoes', label: 'Ayakkabı', position: 'bottom-left' },
  { category: 'bags', label: 'Çanta', position: 'bottom-center' },
  { category: 'accessories', label: 'Aksesuar', position: 'bottom-right' },
];

const Closet = () => {
  const navigate = useNavigate();
  const [tappedCard, setTappedCard] = useState<ClothingCategory | null>(null);

  const handleCardTap = (category: ClothingCategory) => {
    setTappedCard(category);
    setTimeout(() => {
      setTappedCard(null);
      navigate(`/closet/${category}`);
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-[#fdf6ed] flex flex-col">
      <AppHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-14 pb-20 px-4">
        <div className="max-w-md mx-auto py-4">
          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-3">
            {/* Top Row */}
            {CATEGORY_CARDS.filter(c => c.position === 'top-left' || c.position === 'top-right').map(({ category, label }) => (
              <button
                key={category}
                onClick={() => handleCardTap(category)}
                className={`bg-white rounded-2xl p-4 shadow-sm transition-all duration-150 aspect-[4/3] flex flex-col items-center justify-center ${
                  tappedCard === category ? 'scale-95 bg-amber-50' : 'hover:shadow-md active:scale-95'
                }`}
              >
                <span className="text-base font-medium text-gray-800 mb-2">{label}</span>
                <div className="w-16 h-16 bg-gray-100 rounded-xl" />
              </button>
            ))}

            {/* Middle Row - with Avatar */}
            <div className="col-span-2 grid grid-cols-3 gap-3 items-center">
              {/* Ceket */}
              <button
                onClick={() => handleCardTap('jackets')}
                className={`bg-white rounded-2xl p-3 shadow-sm transition-all duration-150 aspect-[3/4] flex flex-col items-center justify-center ${
                  tappedCard === 'jackets' ? 'scale-95 bg-amber-50' : 'hover:shadow-md active:scale-95'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 mb-2">Ceket</span>
                <div className="w-12 h-16 bg-gray-100 rounded-lg" />
              </button>

              {/* Avatar - Center */}
              <div className="flex items-center justify-center py-2">
                <img
                  src={closetAvatar}
                  alt="Avatar"
                  className="w-full max-w-[140px] h-auto object-contain"
                  draggable={false}
                />
              </div>

              {/* Elbise */}
              <button
                onClick={() => handleCardTap('dresses')}
                className={`bg-white rounded-2xl p-3 shadow-sm transition-all duration-150 aspect-[3/4] flex flex-col items-center justify-center ${
                  tappedCard === 'dresses' ? 'scale-95 bg-amber-50' : 'hover:shadow-md active:scale-95'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 mb-2">Elbise</span>
                <div className="w-12 h-16 bg-gray-100 rounded-lg" />
              </button>
            </div>

            {/* Bottom Row */}
            <div className="col-span-2 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleCardTap('shoes')}
                className={`bg-white rounded-2xl p-3 shadow-sm transition-all duration-150 aspect-square flex flex-col items-center justify-center ${
                  tappedCard === 'shoes' ? 'scale-95 bg-amber-50' : 'hover:shadow-md active:scale-95'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 mb-2">Ayakkabı</span>
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
              </button>

              <button
                onClick={() => handleCardTap('bags')}
                className={`bg-white rounded-2xl p-3 shadow-sm transition-all duration-150 aspect-square flex flex-col items-center justify-center ${
                  tappedCard === 'bags' ? 'scale-95 bg-amber-50' : 'hover:shadow-md active:scale-95'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 mb-2">Çanta</span>
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
              </button>

              <button
                onClick={() => handleCardTap('accessories')}
                className={`bg-white rounded-2xl p-3 shadow-sm transition-all duration-150 aspect-square flex flex-col items-center justify-center ${
                  tappedCard === 'accessories' ? 'scale-95 bg-amber-50' : 'hover:shadow-md active:scale-95'
                }`}
              >
                <span className="text-sm font-medium text-gray-800 mb-2">Aksesuar</span>
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Closet;
