import { ClothingItem } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ClothingGridProps {
  items: ClothingItem[];
  onRemove: (id: string) => void;
}

export function ClothingGrid({ items, onRemove }: ClothingGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onRemove(id);
      setDeletingId(null);
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-4xl">👗</span>
        </div>
        <p className="text-lg font-medium text-foreground mb-1">Your closet is empty</p>
        <p className="text-sm text-muted-foreground">Add some items to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "group relative aspect-[3/4] rounded-2xl overflow-hidden bg-card shadow-soft transition-all duration-300",
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
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
