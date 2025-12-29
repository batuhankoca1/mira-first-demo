import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { processClothingImage, loadImageFromFile, blobToBase64 } from '@/lib/backgroundRemoval';

interface PhotoUploadProps {
  onUpload: (imageUrl: string, category: ClothingCategory) => void;
  onClose: () => void;
  defaultCategory?: ClothingCategory;
}

export function PhotoUpload({ onUpload, onClose, defaultCategory = 'tops' }: PhotoUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>(defaultCategory);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setIsReadyToSave(false);
    setProcessedBlob(null);

    try {
      // Load image
      const imageElement = await loadImageFromFile(file);
      
      // Show original first
      setPreviewUrl(URL.createObjectURL(file));
      
      // Process with background removal and avatar preparation
      const blob = await processClothingImage(imageElement, (status) => {
        setProcessingStatus(status);
      });
      
      // Convert to preview URL
      const base64 = await blobToBase64(blob);
      setPreviewUrl(base64);
      setProcessedBlob(blob);
      setIsReadyToSave(true);
      toast.success('Kıyafet hazır!');
    } catch (err) {
      console.error('Processing error:', err);
      toast.error('İşlem başarısız. Lütfen tekrar deneyin.');
      setPreviewUrl(null);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleSave = async () => {
    if (!processedBlob || !previewUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Kaydediliyor...');

    try {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${selectedCategory}.png`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clothing-items')
        .upload(fileName, processedBlob, {
          contentType: 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Fallback to base64
        onUpload(previewUrl, selectedCategory);
        toast.success('Item gardolaba eklendi!');
        onClose();
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('clothing-items')
        .getPublicUrl(uploadData.path);

      onUpload(urlData.publicUrl, selectedCategory);
      toast.success('Item gardolaba eklendi!');
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      // Fallback to base64
      onUpload(previewUrl, selectedCategory);
      toast.success('Item gardolaba eklendi!');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setProcessedBlob(null);
    setIsReadyToSave(false);
    setProcessingStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col h-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-serif font-semibold">Kıyafet Ekle</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} disabled={isProcessing} aria-label="Kapat">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Photo Area */}
          <div 
            className={cn(
              "relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 mb-4",
              previewUrl 
                ? "bg-[#f0f0f0]"
                : "bg-secondary border-2 border-dashed border-border cursor-pointer hover:border-accent"
            )}
            onClick={() => !previewUrl && !isProcessing && fileInputRef.current?.click()}
            style={previewUrl ? {
              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
            } : undefined}
          >
            {previewUrl ? (
              <>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-contain animate-scale-in"
                />
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
                  Arka plan otomatik temizlenir ve avatar için hazırlanır
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
          </div>

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
                    "px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                    selectedCategory === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
              ✓ Kıyafet avatar için hazır! Aşağıdan kaydet.
            </div>
          )}
        </div>

        {/* Fixed Bottom Actions - Always visible */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-3">
            {previewUrl && (
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleRetake}
                disabled={isProcessing}
              >
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
