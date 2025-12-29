import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ClothingGrid } from '@/components/ClothingGrid';
import { useCloset } from '@/hooks/useCloset';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Closet = () => {
  const { items, addItem, removeItem, getItemsByCategory } = useCloset();
  const [showUpload, setShowUpload] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all');

  const displayedItems = activeCategory === 'all' 
    ? items 
    : getItemsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold">My Closet</h1>
              <p className="text-sm text-muted-foreground">{items.length} items</p>
            </div>
            <Button 
              size="icon" 
              onClick={() => setShowUpload(true)}
              className="shadow-elevated"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "category-pill whitespace-nowrap",
                activeCategory === 'all' ? "category-pill-active" : "category-pill-inactive"
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "category-pill whitespace-nowrap flex items-center gap-1.5",
                  activeCategory === cat.value ? "category-pill-active" : "category-pill-inactive"
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-md mx-auto px-6 py-6">
        <ClothingGrid items={displayedItems} onRemove={removeItem} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUpload
          onUpload={addItem}
          onClose={() => setShowUpload(false)}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Closet;
