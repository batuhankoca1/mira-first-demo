import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { ClothingCategory } from '@/types/clothing';
import { Shirt, Footprints, ShoppingBag, Gem, Sparkles } from 'lucide-react';

interface CategoryCard {
  category: ClothingCategory;
  label: string;
  icon: React.ReactNode;
  position: string;
  delay: string;
}

const CATEGORY_CARDS: CategoryCard[] = [
  { 
    category: 'tops', 
    label: 'Üstler',
    icon: <Shirt className="w-5 h-5" />,
    position: 'top-[18%] left-[8%]',
    delay: '0ms'
  },
  { 
    category: 'bottoms', 
    label: 'Altlar',
    icon: <span className="text-lg">👖</span>,
    position: 'top-[18%] right-[8%]',
    delay: '50ms'
  },
  { 
    category: 'jackets', 
    label: 'Ceketler',
    icon: <span className="text-lg">🧥</span>,
    position: 'top-[38%] left-[5%]',
    delay: '100ms'
  },
  { 
    category: 'dresses', 
    label: 'Elbiseler',
    icon: <span className="text-lg">👗</span>,
    position: 'top-[38%] right-[5%]',
    delay: '150ms'
  },
  { 
    category: 'shoes', 
    label: 'Ayakkabılar',
    icon: <Footprints className="w-5 h-5" />,
    position: 'top-[58%] left-[8%]',
    delay: '200ms'
  },
  { 
    category: 'bags', 
    label: 'Çantalar',
    icon: <ShoppingBag className="w-5 h-5" />,
    position: 'top-[58%] right-[8%]',
    delay: '250ms'
  },
  { 
    category: 'accessories', 
    label: 'Aksesuarlar',
    icon: <Gem className="w-5 h-5" />,
    position: 'top-[78%] left-1/2 -translate-x-1/2',
    delay: '300ms'
  },
];

const Closet = () => {
  const navigate = useNavigate();
  const [tappedCategory, setTappedCategory] = useState<ClothingCategory | null>(null);

  const handleCategoryTap = (category: ClothingCategory) => {
    setTappedCategory(category);
    setTimeout(() => {
      setTappedCategory(null);
      navigate(`/closet/${category}`);
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50/80 via-background to-amber-50/60 overflow-hidden">
      {/* Blurred ambient background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-amber-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] left-[30%] w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      <AppHeader />

      {/* Main Content Area */}
      <div className="relative w-full h-full max-w-md mx-auto pt-16 pb-24">
        
        {/* Center Title */}
        <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-light tracking-[0.3em] uppercase text-muted-foreground">
              Koleksiyonum
            </span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-foreground tracking-wide">
            Dolabım
          </h1>
        </div>

        {/* Floating Category Cards */}
        {CATEGORY_CARDS.map(({ category, label, icon, position, delay }) => {
          const isActive = tappedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryTap(category)}
              style={{ animationDelay: delay }}
              className={`absolute ${position} animate-fade-in group`}
            >
              <div 
                className={`
                  relative flex flex-col items-center justify-center
                  w-[100px] h-[90px] 
                  bg-white/50 backdrop-blur-xl 
                  border border-white/60
                  rounded-2xl
                  shadow-lg shadow-black/5
                  transition-all duration-200 ease-out
                  ${isActive 
                    ? 'scale-95 bg-white/70 shadow-md' 
                    : 'hover:scale-105 hover:bg-white/60 hover:shadow-xl hover:shadow-black/10'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  flex items-center justify-center
                  w-10 h-10 mb-1.5
                  rounded-xl
                  bg-gradient-to-br from-accent/10 to-accent/5
                  text-foreground
                  transition-transform duration-200
                  group-hover:scale-110
                `}>
                  {icon}
                </div>
                
                {/* Label */}
                <span className="text-[11px] font-medium tracking-wide text-foreground/80">
                  {label}
                </span>

                {/* Subtle shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </button>
          );
        })}

        {/* Center decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-32 h-32 rounded-full border border-border/30 bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-border/20 bg-white/30 flex items-center justify-center">
              <span className="text-3xl">👗</span>
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default Closet;
