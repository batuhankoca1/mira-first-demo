import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, Tag } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { getItemsByCategory, WardrobeItem } from '@/data/wardrobeData';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SellItemModal } from '@/components/SellItemModal';
import { useListedItems } from '@/hooks/useListedItems';
import { toast } from 'sonner';

interface ItemDetails {
  brand: string;
  color: string;
  type: string;
  fabric: string;
  purchaseDate: string;
}

// Local storage key for item details
const getStorageKey = (itemId: string) => `item-details-${itemId}`;

const CategoryDetail = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { isListed, listItem, unlistItem } = useListedItems();
  
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState<ItemDetails>({
    brand: '',
    color: '',
    type: '',
    fabric: '',
    purchaseDate: '',
  });

  // Validate category
  const validCategory = CATEGORIES.find((c) => c.value === category);
  if (!validCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Kategori bulunamadı</p>
      </div>
    );
  }

  const items = getItemsByCategory(category as ClothingCategory);

  // Load item details from localStorage
  const loadItemDetails = (itemId: string): ItemDetails => {
    try {
      const saved = localStorage.getItem(getStorageKey(itemId));
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors
    }
    return {
      brand: '',
      color: '',
      type: '',
      fabric: '',
      purchaseDate: '',
    };
  };

  // Save item details to localStorage
  const saveItemDetails = (itemId: string, details: ItemDetails) => {
    localStorage.setItem(getStorageKey(itemId), JSON.stringify(details));
  };

  // Handle item click
  const handleItemClick = (item: WardrobeItem) => {
    setSelectedItem(item);
    const details = loadItemDetails(item.id);
    setEditedDetails(details);
    setIsEditing(false);
  };

  // Handle save
  const handleSave = () => {
    if (selectedItem) {
      saveItemDetails(selectedItem.id, editedDetails);
      setIsEditing(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setSelectedItem(null);
    setIsEditing(false);
  };

  // Handle sell button click
  const handleSellClick = () => {
    setShowSellModal(true);
  };

  // Handle sell submit
  const handleSellSubmit = (data: { 
    title: string;
    category: ClothingCategory;
    price: number; 
    condition: 'new' | 'like-new' | 'good'; 
    description?: string;
    imageSrc?: string;
  }) => {
    if (selectedItem) {
      listItem(selectedItem.id, data);
      setShowSellModal(false);
      setSelectedItem(null);
      toast.success('Ürün başarıyla satışa çıktı! 🎉');
    }
  };

  // Handle unlist
  const handleUnlist = () => {
    if (selectedItem) {
      unlistItem(selectedItem.id);
      setSelectedItem(null);
      toast.success('Ürün satıştan çekildi.');
    }
  };

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
            <p className="font-medium">Bu kategoride henüz parça yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="relative aspect-square rounded-2xl bg-white/60 border border-amber-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* On Sale Badge */}
                {isListed(item.id) && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Tag className="w-3 h-3" />
                    Satışta
                  </div>
                )}
                <img
                  src={item.src}
                  alt={`${item.category} item`}
                  className="w-full h-full object-contain p-3"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <Dialog open={selectedItem !== null && !showSellModal} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-sm mx-auto bg-[#fdf6ed] border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900 font-serif flex items-center justify-between">
              <span>Parça Detayları</span>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-amber-700" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="p-2 rounded-full bg-amber-600 hover:bg-amber-700 transition-colors"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-square rounded-xl bg-white/60 border border-amber-200/50 overflow-hidden">
                {/* On Sale Badge in Modal */}
                {isListed(selectedItem.id) && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Tag className="w-3.5 h-3.5" />
                    Satışta
                  </div>
                )}
                <img
                  src={selectedItem.src}
                  alt="Kıyafet"
                  className="w-full h-full object-contain p-4"
                  draggable={false}
                />
              </div>

              {/* Details Form */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="brand" className="text-xs text-amber-800">Marka</Label>
                  {isEditing ? (
                    <Input
                      id="brand"
                      value={editedDetails.brand}
                      onChange={(e) => setEditedDetails({ ...editedDetails, brand: e.target.value })}
                      placeholder="Örn: Zara"
                      className="h-9 bg-white border-amber-200 focus:border-amber-400"
                    />
                  ) : (
                    <p className="text-sm text-amber-900 bg-white/50 rounded-md px-3 py-2">
                      {editedDetails.brand || '-'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="color" className="text-xs text-amber-800">Renk</Label>
                    {isEditing ? (
                      <Input
                        id="color"
                        value={editedDetails.color}
                        onChange={(e) => setEditedDetails({ ...editedDetails, color: e.target.value })}
                        placeholder="Örn: Siyah"
                        className="h-9 bg-white border-amber-200 focus:border-amber-400"
                      />
                    ) : (
                      <p className="text-sm text-amber-900 bg-white/50 rounded-md px-3 py-2">
                        {editedDetails.color || '-'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="type" className="text-xs text-amber-800">Tür</Label>
                    {isEditing ? (
                      <Input
                        id="type"
                        value={editedDetails.type}
                        onChange={(e) => setEditedDetails({ ...editedDetails, type: e.target.value })}
                        placeholder="Örn: T-Shirt"
                        className="h-9 bg-white border-amber-200 focus:border-amber-400"
                      />
                    ) : (
                      <p className="text-sm text-amber-900 bg-white/50 rounded-md px-3 py-2">
                        {editedDetails.type || '-'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fabric" className="text-xs text-amber-800">Kumaş</Label>
                    {isEditing ? (
                      <Input
                        id="fabric"
                        value={editedDetails.fabric}
                        onChange={(e) => setEditedDetails({ ...editedDetails, fabric: e.target.value })}
                        placeholder="Örn: Pamuk"
                        className="h-9 bg-white border-amber-200 focus:border-amber-400"
                      />
                    ) : (
                      <p className="text-sm text-amber-900 bg-white/50 rounded-md px-3 py-2">
                        {editedDetails.fabric || '-'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="purchaseDate" className="text-xs text-amber-800">Alınan Tarih</Label>
                    {isEditing ? (
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={editedDetails.purchaseDate}
                        onChange={(e) => setEditedDetails({ ...editedDetails, purchaseDate: e.target.value })}
                        className="h-9 bg-white border-amber-200 focus:border-amber-400"
                      />
                    ) : (
                      <p className="text-sm text-amber-900 bg-white/50 rounded-md px-3 py-2">
                        {editedDetails.purchaseDate || '-'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sell / Unlist Buttons */}
              {!isListed(selectedItem.id) ? (
                <Button
                  onClick={handleSellClick}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Satılığa Çıkar
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-sm text-green-700 font-medium">Bu ürün şu an satışta 🏷️</p>
                  </div>
                  <Button
                    onClick={handleUnlist}
                    variant="outline"
                    className="w-full h-10 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Satıştan Çek
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sell Item Modal */}
      <SellItemModal
        open={showSellModal}
        onOpenChange={setShowSellModal}
        item={selectedItem}
        itemDetails={{
          brand: editedDetails.brand,
          color: editedDetails.color,
          type: editedDetails.type,
        }}
        onSubmit={handleSellSubmit}
      />

      <BottomNav />
    </div>
  );
};

export default CategoryDetail;
