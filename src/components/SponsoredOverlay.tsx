import { Star, ExternalLink } from 'lucide-react';
import { SponsoredInfo } from '@/data/wardrobeData';

interface SponsoredOverlayProps {
  isVisible: boolean;
  sponsoredInfo: SponsoredInfo;
}

export const SponsoredOverlay = ({ isVisible, sponsoredInfo }: SponsoredOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Top-Left Floating Card - Product Details */}
      <div 
        className={`absolute left-[8%] top-[18%] pointer-events-auto transition-all duration-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Connector line to garment */}
        <div className="absolute top-1/2 right-0 w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60 translate-x-full" />
        <div className="absolute top-1/2 right-0 translate-x-[calc(100%+32px)] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
        
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 max-w-[120px] border border-white/50">
          <p className="font-semibold text-sm text-foreground tracking-wide">{sponsoredInfo.brand}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{sponsoredInfo.fabric}</p>
        </div>
      </div>

      {/* Top-Right Floating Card - Price & Rating */}
      <div 
        className={`absolute right-[8%] top-[18%] pointer-events-auto transition-all duration-300 delay-75 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Connector line to garment */}
        <div className="absolute top-1/2 left-0 w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60 -translate-x-full" />
        <div className="absolute top-1/2 left-0 -translate-x-[calc(100%+32px)] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
        
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 text-right border border-white/50">
          <p className="font-bold text-lg text-foreground">{sponsoredInfo.price}</p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-amber-700">{sponsoredInfo.rating}</span>
          </div>
        </div>
      </div>

      {/* Sponsored Badge - Top Center */}
      <div 
        className={`absolute top-[10%] left-1/2 -translate-x-1/2 transition-all duration-300 delay-100 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Sponsored
        </span>
      </div>

      {/* Bottom-Center Action Button */}
      <a
        href={sponsoredInfo.buyLink}
        className={`absolute bottom-[12%] left-1/2 -translate-x-1/2 pointer-events-auto transition-all duration-300 delay-150 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm shadow-xl hover:scale-105 transition-transform active:scale-95">
          <span>SHOP THIS LOOK</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </a>

      {/* Subtle corner accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-amber-400/40 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-amber-400/40 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-amber-400/40 rounded-br-lg" />
    </div>
  );
};
