import { ClothingItem, ClothingCategory, CATEGORIES } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface ClosetShelvesProps {
  items: ClothingItem[];
  onRemove: (id: string) => void;
  onAddClick: (category: ClothingCategory) => void;
}

export function ClosetShelves({ items, onRemove, onAddClick }: ClosetShelvesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onRemove(id);
      setDeletingId(null);
    }, 300);
  };

  const getItemsByCategory = (category: ClothingCategory) => {
    return items.filter(item => item.category === category);
  };

  return (
    <div className="space-y-6">
      {CATEGORIES.map((category) => {
        const categoryItems = getItemsByCategory(category.value);
        return (
          <div key={category.value} className="relative">
            {/* Shelf Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{category.icon}</span>
              <h3 className="text-sm font-semibold text-foreground/90">{category.label}</h3>
              <span className="text-xs text-muted-foreground">({categoryItems.length})</span>
            </div>

            {/* Wooden Shelf */}
            <div className="relative">
              {/* Shelf surface */}
              <div className="relative bg-gradient-to-b from-amber-100/40 to-amber-200/30 rounded-xl p-3 border border-amber-200/50 backdrop-blur-sm min-h-[120px]">
                {/* Shelf wood grain effect */}
                <div className="absolute inset-0 rounded-xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0id29vZCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0iI2Q0YTU3NCIvPjxwYXRoIGQ9Ik0wIDEwaDEwME0wIDMwaDEwME0wIDUwaDEwME0wIDcwaDEwME0wIDkwaDEwMCIgc3Ryb2tlPSIjYzQ5NTY0IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjd29vZCkiLz48L3N2Zz4=')]" />
                
                {/* Items on shelf */}
                <div className="relative flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {categoryItems.length === 0 ? (
                    <button
                      onClick={() => onAddClick(category.value)}
                      className="flex-shrink-0 w-20 h-24 rounded-xl border-2 border-dashed border-amber-300/50 bg-amber-50/30 flex flex-col items-center justify-center gap-1 text-amber-600/60 hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px] font-medium">Add</span>
                    </button>
                  ) : (
                    <>
                      {categoryItems.map((item, index) => (
                        <div
                          key={item.id}
                          className={cn(
                            "group relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-card shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-elevated",
                            deletingId === item.id && "opacity-0 scale-95"
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <img
                            src={item.imageUrl}
                            alt="Clothing item"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => onAddClick(category.value)}
                        className="flex-shrink-0 w-20 h-24 rounded-xl border-2 border-dashed border-amber-300/40 bg-amber-50/20 flex flex-col items-center justify-center gap-1 text-amber-600/50 hover:border-amber-400 hover:bg-amber-50/40 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Shelf bottom edge (3D effect) */}
              <div className="h-2 bg-gradient-to-b from-amber-300/40 to-amber-400/30 rounded-b-lg mx-1 shadow-sm" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
