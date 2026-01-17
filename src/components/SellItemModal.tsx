import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WardrobeItem } from '@/data/wardrobeData';
import { CATEGORIES, ClothingCategory } from '@/types/clothing';
import { Tag } from 'lucide-react';

interface SellItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: WardrobeItem | null;
  itemDetails?: { brand?: string; color?: string; type?: string };
  onSubmit: (data: { 
    title: string;
    category: ClothingCategory;
    price: number; 
    condition: 'new' | 'like-new' | 'good'; 
    description?: string;
    imageSrc?: string;
  }) => void;
}

// 6 main closet categories
const SELL_CATEGORIES: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'Üst Giyim', icon: '👕' },
  { value: 'bottoms', label: 'Alt Giyim', icon: '👖' },
  { value: 'jackets', label: 'Ceketler', icon: '🧥' },
  { value: 'dresses', label: 'Elbiseler', icon: '👗' },
  { value: 'shoes', label: 'Ayakkabılar', icon: '👟' },
  { value: 'bags', label: 'Çantalar', icon: '👜' },
];

export function SellItemModal({ open, onOpenChange, item, itemDetails, onSubmit }: SellItemModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good'>('like-new');
  const [description, setDescription] = useState('');

  // Generate a random price suggestion - range is ~25% of minimum
  const priceSuggestion = useMemo(() => {
    const baseMin = Math.floor(Math.random() * 600) + 300; // 300-900
    const range = Math.floor(baseMin * 0.25); // 25% of min
    const baseMax = baseMin + range;
    return { min: baseMin, max: baseMax };
  }, [item?.id]);

  // Generate auto title
  const autoTitle = useMemo(() => {
    if (!item) return '';
    const parts: string[] = [];
    if (itemDetails?.color) parts.push(itemDetails.color);
    if (itemDetails?.type) parts.push(itemDetails.type);
    if (itemDetails?.brand) parts.push(`(${itemDetails.brand})`);
    if (parts.length > 0) return parts.join(' ');
    
    // Fallback based on category
    const categoryLabel = CATEGORIES.find(c => c.value === item.category)?.label || 'Parça';
    return categoryLabel;
  }, [item, itemDetails]);

  // Initialize form when item changes
  useEffect(() => {
    if (item && open) {
      setTitle(autoTitle);
      setCategory(item.category);
      setPrice('');
      setCondition('like-new');
      setDescription('');
    }
  }, [item, open, autoTitle]);

  const handleSubmit = () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0 || !title.trim()) {
      return;
    }
    onSubmit({
      title: title.trim(),
      category,
      price: parsedPrice,
      condition,
      description: description.trim() || undefined,
      imageSrc: item?.src,
    });
  };

  const isValid = title.trim() && price && parseFloat(price) > 0;

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto bg-[#fdf6ed] border-amber-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-900 font-serif flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Ürünü Listele
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Image */}
          <div className="aspect-square rounded-xl bg-gray-100 border border-amber-200/50 overflow-hidden max-h-40 mx-auto">
            <img
              src={item.src}
              alt="Ürün"
              className="w-full h-full object-contain p-3"
              draggable={false}
            />
          </div>

          {/* Editable Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs text-amber-800">Başlık</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ürün başlığı girin"
              className="h-10 bg-white border-amber-200 focus:border-amber-400"
            />
          </div>

          {/* Editable Category Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs text-amber-800">Kategori</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as ClothingCategory)}>
              <SelectTrigger className="h-10 bg-white border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SELL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Input */}
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-xs text-amber-800">Fiyat (TL)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Örn: 750"
              className="h-10 bg-white border-amber-200 focus:border-amber-400"
            />
            <p className="text-xs text-amber-600">
              💡 MIRA Önerisi: {priceSuggestion.min} TL - {priceSuggestion.max} TL arası
            </p>
          </div>

          {/* Condition Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs text-amber-800">Kondisyon</Label>
            <Select value={condition} onValueChange={(val) => setCondition(val as typeof condition)}>
              <SelectTrigger className="h-10 bg-white border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Yeni Etiketli</SelectItem>
                <SelectItem value="like-new">Az Kullanılmış</SelectItem>
                <SelectItem value="good">İyi Durumda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs text-amber-800">
              Açıklama <span className="text-amber-500">(opsiyonel)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ürün hakkında kısa bir not..."
              className="min-h-[60px] bg-white border-amber-200 focus:border-amber-400 resize-none"
              maxLength={200}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-medium"
          >
            Yayınla
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
