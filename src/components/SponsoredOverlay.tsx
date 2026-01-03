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
      {/* Sponsored Badge - Top Left, below environment buttons */}
      <div 
        className={`absolute top-3 left-3 transition-all duration-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-medium shadow-md">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          Sponsorlu
        </span>
      </div>

      {/* Top-Right Compact Info Card with CTA */}
      <div 
        className={`absolute right-3 top-3 pointer-events-auto transition-all duration-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-2.5 border border-white/50 min-w-[100px]">
          {/* Brand & Fabric */}
          <p className="font-semibold text-xs text-foreground">{sponsoredInfo.brand}</p>
          <p className="text-[10px] text-muted-foreground">{sponsoredInfo.fabric}</p>
          
          {/* Price & Rating Row */}
          <div className="flex items-center justify-between mt-1.5 gap-2">
            <span className="font-bold text-sm text-foreground">{sponsoredInfo.price}</span>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-medium text-amber-700">{sponsoredInfo.rating}</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <a href={sponsoredInfo.buyLink} className="block mt-2">
            <button className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-foreground text-background font-medium text-[10px] shadow hover:scale-105 transition-transform active:scale-95">
              <span>SATIN AL</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
