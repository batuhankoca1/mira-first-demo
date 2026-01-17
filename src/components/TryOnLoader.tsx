import { Sparkles } from 'lucide-react';

interface TryOnLoaderProps {
  show: boolean;
}

export function TryOnLoader({ show }: TryOnLoaderProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        {/* Spinning ring */}
        <div className="w-24 h-24 border-4 border-accent/20 rounded-full animate-spin border-t-accent" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-accent animate-pulse" />
        </div>
      </div>
      
      <p className="mt-6 text-lg font-semibold text-foreground animate-pulse">
        Sihir Yapılıyor ✨
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Kombinin hazırlanıyor...
      </p>
    </div>
  );
}
