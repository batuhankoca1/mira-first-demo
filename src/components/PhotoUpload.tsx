import { useRef, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ClothingCategory, CATEGORIES, CATEGORY_ANCHORS } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Camera, X, Check, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { processClothingFile } from '@/lib/backgroundRemoval';

interface PhotoUploadProps {
  onSaved: (imageUrl: string, category: ClothingCategory) => void;
  onClose: () => void;
  defaultCategory?: ClothingCategory;
}

// Layer positions matching Avatar2D (percentage-based)
const LAYER_POSITIONS: Record<ClothingCategory, { top: string; height: string; width: string }> = {
  tops: { top: '22%', height: '28%', width: '50%' },
  jackets: { top: '20%', height: '32%', width: '58%' },
  bottoms: { top: '48%', height: '26%', width: '45%' },
  dresses: { top: '22%', height: '50%', width: '55%' },
  shoes: { top: '88%', height: '12%', width: '35%' },
  bags: { top: '40%', height: '20%', width: '25%' },
  accessories: { top: '5%', height: '15%', width: '30%' },
};

export function PhotoUpload({ onSaved, onClose, defaultCategory = 'tops' }: PhotoUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>(defaultCategory);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [assetDataUrl, setAssetDataUrl] = useState<string | null>(null);
  const [showAvatarPreview, setShowAvatarPreview] = useState(true);
  const [debug, setDebug] = useState<{
    originalDataUrl: string;
    maskDataUrl: string;
    composedDataUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get anchor config for selected category
  const anchorConfig = useMemo(() => CATEGORY_ANCHORS[selectedCategory], [selectedCategory]);
  const layerPosition = useMemo(() => LAYER_POSITIONS[selectedCategory], [selectedCategory]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setIsReadyToSave(false);
    setAssetDataUrl(null);
    setDebug(null);

    try {
      const originalObjectUrl = URL.createObjectURL(file);
      setPreviewUrl(originalObjectUrl);

      const { assetDataUrl: ready, debug: dbg } = await processClothingFile(file, (status) => {
        setProcessingStatus(status);
      });

      URL.revokeObjectURL(originalObjectUrl);

      setDebug(dbg);
      setAssetDataUrl(ready);
      setPreviewUrl(ready);
      setIsReadyToSave(true);
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
    if (!assetDataUrl) return;
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
          {/* Main preview area with avatar overlay option */}
          <div className="relative mb-4">
            {/* Asset preview */}
            <div
              className={cn(
                'relative aspect-square rounded-2xl overflow-hidden transition-all duration-300',
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

            {/* Avatar preview toggle */}
            {isReadyToSave && (
              <button
                onClick={() => setShowAvatarPreview(!showAvatarPreview)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
                title={showAvatarPreview ? 'Avatar önizlemeyi gizle' : 'Avatar önizlemeyi göster'}
              >
                {showAvatarPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Avatar Position Preview */}
          {isReadyToSave && showAvatarPreview && assetDataUrl && (
            <div className="mb-4 p-3 rounded-xl bg-secondary/30 border border-border">
              <p className="text-xs text-muted-foreground text-center mb-2">Avatar Önizleme</p>
              <div className="relative w-full max-w-[200px] mx-auto aspect-[1/2]">
                {/* Mini avatar silhouette */}
                <svg
                  viewBox="0 0 200 400"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Head */}
                  <ellipse cx="100" cy="45" rx="35" ry="40" className="fill-secondary stroke-border" strokeWidth="2" />
                  {/* Hair */}
                  <path
                    d="M65 35 Q65 10 100 10 Q135 10 135 35 Q135 25 125 20 Q100 15 75 20 Q65 25 65 35"
                    className="fill-foreground/60"
                  />
                  {/* Neck */}
                  <rect x="88" y="82" width="24" height="20" className="fill-secondary" />
                  {/* Body */}
                  <path
                    d="M60 100 L60 280 Q60 290 70 290 L130 290 Q140 290 140 280 L140 100 Q140 95 130 95 L70 95 Q60 95 60 100"
                    className="fill-card stroke-border"
                    strokeWidth="2"
                  />
                  {/* Arms */}
                  <path d="M60 105 L35 180 Q32 190 38 195 L45 195 L65 130" className="fill-secondary stroke-border" strokeWidth="2" />
                  <path d="M140 105 L165 180 Q168 190 162 195 L155 195 L135 130" className="fill-secondary stroke-border" strokeWidth="2" />
                  {/* Legs */}
                  <rect x="68" y="285" width="25" height="90" rx="5" className="fill-secondary stroke-border" strokeWidth="2" />
                  <rect x="107" y="285" width="25" height="90" rx="5" className="fill-secondary stroke-border" strokeWidth="2" />
                  {/* Feet */}
                  <ellipse cx="80" cy="380" rx="20" ry="10" className="fill-card stroke-border" strokeWidth="2" />
                  <ellipse cx="120" cy="380" rx="20" ry="10" className="fill-card stroke-border" strokeWidth="2" />
                </svg>

                {/* Clothing item overlay - positioned according to category */}
                <div
                  className="absolute flex items-center justify-center animate-scale-in"
                  style={{
                    top: layerPosition.top,
                    height: layerPosition.height,
                    width: layerPosition.width,
                    left: '50%',
                    transform: `translateX(-50%) translateX(${anchorConfig.anchorOffset.x}px) translateY(${anchorConfig.anchorOffset.y}px) scale(${anchorConfig.scale})`,
                  }}
                >
                  <img
                    src={assetDataUrl}
                    alt="Preview on avatar"
                    className="w-full h-full object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>

                {/* Category indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-2">
                  <span className="text-xs text-muted-foreground">
                    {CATEGORIES.find(c => c.value === selectedCategory)?.icon}{' '}
                    {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                  </span>
                </div>
              </div>

              {/* Anchor info */}
              <div className="mt-4 flex justify-center gap-4 text-[10px] text-muted-foreground">
                <span>Anchor: {anchorConfig.anchorType}</span>
                <span>Scale: {anchorConfig.scale}x</span>
                <span>Offset: ({anchorConfig.anchorOffset.x}, {anchorConfig.anchorOffset.y})</span>
              </div>
            </div>
          )}

          {/* Debug view */}
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

        {/* Fixed bottom actions */}
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
