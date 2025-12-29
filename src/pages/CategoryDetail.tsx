import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { WARDROBE_ITEMS } from '@/data/wardrobeData';
import { useDemoWardrobeItems } from '@/hooks/useDemoWardrobeItems';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';

const CategoryDetail = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // Validate category
  const validCategory = CATEGORIES.find((c) => c.value === category);
  if (!validCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  const { getItemsByCategory } = useDemoWardrobeItems(WARDROBE_ITEMS);
  const items = getItemsByCategory(category as ClothingCategory);

  return (
    <div className="min-h-screen bg-[#fdf6ed] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#fdf6ed]/95 backdrop-blur-sm border-b border-amber-200/50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/closet')}
              className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-amber-900" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{validCategory.icon}</span>
              <h1 className="text-xl font-serif font-bold text-amber-900">
                {validCategory.label}
              </h1>
              <span className="text-sm text-amber-700/70">({items.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-md mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-700/50">
            <span className="text-6xl mb-4">{validCategory.icon}</span>
            <p className="font-medium">No items in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-2xl bg-white/80 border border-amber-200/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              >
                <img
                  src={item.src}
                  alt={`${item.category} item`}
                  className="w-full h-full object-contain p-3"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CategoryDetail;
