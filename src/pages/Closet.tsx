import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ClosetShelves } from '@/components/ClosetShelves';
import { useCloset } from '@/hooks/useCloset';
import { ClothingCategory } from '@/types/clothing';
import { Plus, Menu } from 'lucide-react';
import closetBg from '@/assets/closet-background.png';

const Closet = () => {
  const { items, addItem, removeItem } = useCloset();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ClothingCategory>('tops');

  const handleAddClick = (category: ClothingCategory) => {
    setUploadCategory(category);
    setShowUpload(true);
  };

  return (
    <div className="min-h-screen pb-28 overflow-y-auto relative">
      {/* Wooden Closet Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${closetBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-amber-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-amber-50/95 to-amber-50/80 backdrop-blur-lg border-b border-amber-200/50">
          <div className="container max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button className="w-10 h-10 rounded-xl bg-card/80 flex items-center justify-center shadow-soft">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-serif font-bold text-foreground">My Closet</h1>
                <p className="text-xs text-muted-foreground">{items.length} items</p>
              </div>
              
              <Button 
                size="icon" 
                onClick={() => setShowUpload(true)}
                className="shadow-elevated bg-primary hover:bg-primary/90"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Shelves Content */}
        <div className="container max-w-md mx-auto px-4 py-6">
          <div className="bg-amber-50/70 backdrop-blur-md rounded-3xl p-4 shadow-elevated border border-amber-200/50">
            <ClosetShelves 
              items={items} 
              onRemove={removeItem} 
              onAddClick={handleAddClick}
            />
          </div>
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
