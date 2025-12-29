import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { processClothingFile } from '@/lib/backgroundRemoval';

interface PhotoUploadProps {
  onSaved: (imageUrl: string, category: ClothingCategory) => void;
  onClose: () => void;
  defaultCategory?: ClothingCategory;
}

export function PhotoUpload({ onSaved, onClose, defaultCategory = 'tops' }: PhotoUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>(defaultCategory);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [assetDataUrl, setAssetDataUrl] = useState<string | null>(null);
  const [debug, setDebug] = useState<{
    originalDataUrl: string;
    maskDataUrl: string;
    composedDataUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setIsReadyToSave(false);
    setAssetDataUrl(null);
    setDebug(null);

    try {
      // Show original immediately for fast feedback
      const originalObjectUrl = URL.createObjectURL(file);
      setPreviewUrl(originalObjectUrl);

      const { assetDataUrl: ready, debug: dbg } = await processClothingFile(file, (status) => {
        setProcessingStatus(status);
      });

      // Clean up object URL
      URL.revokeObjectURL(originalObjectUrl);

      setDebug(dbg);
      setAssetDataUrl(ready);
      setPreviewUrl(ready);
      setIsReadyToSave(true);
      
      console.log("[PhotoUpload] Processing complete, ready to save");
    } catch (err) {
      console.error('[PhotoUpload] Processing error:', err);
      toast.error('Arka plan temizleme başarısız. Lütfen başka bir fotoğraf deneyin.');
      setPreviewUrl(null);
      setAssetDataUrl(null);
      setDebug(null);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleSave = () => {
    if (!assetDataUrl) {
      console.error("[PhotoUpload] No asset to save");
      return;
    }
    
    console.log("[PhotoUpload] Saving item to category:", selectedCategory);
    
    // Call the save callback
    onSaved(assetDataUrl, selectedCategory);
    
    const categoryLabel = CATEGORIES.find(c => c.value === selectedCategory)?.label ?? selectedCategory;
    toast.success(`${categoryLabel} kategorisine kaydedildi`);
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setAssetDataUrl(null);
    setIsReadyToSave(false);
    setProcessingStatus('');
    setDebug(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col h-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-serif font-semibold">Kıyafet Ekle</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} disabled={isProcessing} aria-label="Kapat">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Main preview */}
          <div
            className={cn(
              'relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 mb-4',
              previewUrl
                ? 'bg-secondary/40'
                : 'bg-secondary border-2 border-dashed border-border cursor-pointer hover:border-accent'
            )}
            onClick={() => !previewUrl && !isProcessing && fileInputRef.current?.click()}
            style={
              previewUrl
                ? {
                    backgroundImage:
                      'linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--border)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--border)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--border)) 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                  }
                : undefined
            }
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Wearable preview" className="w-full h-full object-contain" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-accent" />
                    <p className="text-sm font-medium text-foreground">{processingStatus}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center shadow-soft">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="font-medium">Fotoğraf Seç</p>
                <p className="text-sm text-center px-4 text-muted-foreground">
                  Arka plan otomatik temizlenecek
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
          </div>

          {/* Debug view - temporary for testing */}
          {debug && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground text-center">Orijinal</p>
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
                  <img src={debug.originalDataUrl} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground text-center">Maske</p>
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
                  <img src={debug.maskDataUrl} alt="Mask" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground text-center">Sonuç</p>
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
                  <img src={debug.composedDataUrl} alt="Composed" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  disabled={isProcessing}
                  className={cn(
                    'px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
                    selectedCategory === cat.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ready indicator */}
          {isReadyToSave && (
            <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm text-center">
              ✓ Kıyafet hazır! Aşağıdan kaydet.
            </div>
          )}
        </div>

        {/* Fixed bottom actions - ALWAYS visible */}
        <div className="p-4 border-t border-border bg-background pb-safe">
          <div className="flex gap-3">
            {previewUrl && (
              <Button variant="secondary" className="flex-1" onClick={handleRetake} disabled={isProcessing}>
                Yeniden Seç
              </Button>
            )}
            <Button
              variant="default"
              className={cn(
                "flex-1 gap-2",
                isReadyToSave && "bg-green-600 hover:bg-green-700"
              )}
              disabled={!isReadyToSave || isProcessing}
              onClick={handleSave}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {processingStatus || 'İşleniyor...'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
