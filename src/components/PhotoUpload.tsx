import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Camera, X, Check } from 'lucide-react';

interface PhotoUploadProps {
  onUpload: (imageUrl: string, category: ClothingCategory) => void;
  onClose: () => void;
}

export function PhotoUpload({ onUpload, onClose }: PhotoUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('tops');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (previewUrl) {
      onUpload(previewUrl, selectedCategory);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col h-full max-w-md mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif">Add to Closet</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Photo Area */}
        <div className="flex-1 flex flex-col gap-6">
          <div 
            className={cn(
              "relative aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-300",
              previewUrl 
                ? "bg-card" 
                : "bg-secondary border-2 border-dashed border-border cursor-pointer hover:border-accent"
            )}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover animate-scale-in"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center shadow-soft">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="font-medium">Tap to add photo</p>
                <p className="text-sm text-muted-foreground">or use your camera</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    "category-pill flex items-center gap-2",
                    selectedCategory === cat.value
                      ? "category-pill-active"
                      : "category-pill-inactive"
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          {previewUrl && (
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setPreviewUrl(null)}
            >
              Retake
            </Button>
          )}
          <Button 
            variant="default"
            className="flex-1"
            disabled={!previewUrl}
            onClick={handleConfirm}
          >
            <Check className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
