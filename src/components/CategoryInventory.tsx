import { ClothingItem, ClothingCategory, CATEGORIES } from '@/types/clothing';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryInventoryProps {
  category: ClothingCategory;
  items: ClothingItem[];
  onClose: () => void;
  onAddNew: () => void;
  onSelectItem?: (item: ClothingItem) => void;
  onDeleteItem?: (id: string) => void;
}

export function CategoryInventory({
  category,
  items,
  onClose,
  onAddNew,
  onSelectItem,
  onDeleteItem,
}: CategoryInventoryProps) {
  const categoryInfo = CATEGORIES.find(c => c.value === category);
  const categoryItems = items.filter(item => item.category === category);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col h-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryInfo?.icon}</span>
            <h2 className="text-xl font-serif font-semibold">{categoryInfo?.label}</h2>
            <span className="text-sm text-muted-foreground">({categoryItems.length})</span>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Kapat">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {categoryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <div className="text-6xl opacity-50">{categoryInfo?.icon}</div>
              <p className="font-medium">Bu kategoride henüz item yok</p>
              <Button onClick={onAddNew} className="gap-2">
                <Plus className="w-4 h-4" />
                İlk itemini ekle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 group"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={`${category} item`}
                    className={cn(
                      "w-full h-full object-contain p-1",
                      onSelectItem && "cursor-pointer hover:scale-105 transition-transform"
                    )}
                    onClick={() => onSelectItem?.(item)}
                  />
                  {onDeleteItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Bottom Action */}
        {categoryItems.length > 0 && (
          <div className="p-4 border-t border-border bg-background">
            <Button onClick={onAddNew} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Yeni Item Ekle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
