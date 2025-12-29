import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClothingCategory, CATEGORIES } from '@/types/clothing';
import { cn } from '@/lib/utils';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show original preview first
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setPreviewUrl(base64Image);
      
      // Process with background removal
      await processImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64Image: string) => {
    setIsProcessing(true);
    setProcessingStatus('Removing background...');

    try {
      const { data, error } = await supabase.functions.invoke('remove-background', {
        body: { imageBase64: base64Image }
      });

      if (error) {
        console.error('Background removal error:', error);
        toast.error('Could not process image, using original');
        return;
      }

      if (data?.processedImage) {
        setPreviewUrl(data.processedImage);
        setProcessingStatus('Background removed!');
        toast.success('Background removed successfully!');
      }
    } catch (err) {
      console.error('Processing error:', err);
      toast.error('Processing failed, using original image');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingStatus(''), 2000);
    }
  };

  const handleConfirm = async () => {
    if (!previewUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Saving to closet...');

    try {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${selectedCategory}.png`;
      
      // Convert base64 to blob
      const base64Data = previewUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clothing-items')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Fallback to local storage
        onUpload(previewUrl, selectedCategory);
        toast.success('Item added to closet!');
        onClose();
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('clothing-items')
        .getPublicUrl(uploadData.path);

      onUpload(urlData.publicUrl, selectedCategory);
      toast.success('Item added to closet!');
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      // Fallback to base64
      onUpload(previewUrl, selectedCategory);
      toast.success('Item added to closet!');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col h-full max-w-md mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif">Add to Closet</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} disabled={isProcessing}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Photo Area */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
          <div 
            className={cn(
              "relative aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-300",
              previewUrl 
                ? "bg-[#f0f0f0]" // Checkered bg to show transparency
                : "bg-secondary border-2 border-dashed border-border cursor-pointer hover:border-accent"
            )}
            onClick={() => !previewUrl && !isProcessing && fileInputRef.current?.click()}
            style={previewUrl ? {
              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
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
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <p className="text-sm font-medium text-foreground">{processingStatus}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center shadow-soft">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="font-medium">Tap to add photo</p>
                <p className="text-sm text-muted-foreground">Background will be removed automatically</p>
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
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  disabled={isProcessing}
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
              onClick={() => {
                setPreviewUrl(null);
                setProcessingStatus('');
              }}
              disabled={isProcessing}
            >
              Retake
            </Button>
          )}
          <Button 
            variant="default"
            className="flex-1"
            disabled={!previewUrl || isProcessing}
            onClick={handleConfirm}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Add Item
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
