import { ClothingItem } from '@/types/clothing';
import { cn } from '@/lib/utils';

interface Avatar2DProps {
  top?: ClothingItem;
  bottom?: ClothingItem;
  dress?: ClothingItem;
  shoes?: ClothingItem;
  className?: string;
}

export function Avatar2D({ top, bottom, dress, shoes, className }: Avatar2DProps) {
  return (
    <div className={cn("relative w-full max-w-[280px] mx-auto", className)}>
      {/* Avatar silhouette */}
      <svg
        viewBox="0 0 200 400"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <ellipse cx="100" cy="45" rx="35" ry="40" className="fill-secondary stroke-border" strokeWidth="2" />
        
        {/* Hair */}
        <path
          d="M65 35 Q65 10 100 10 Q135 10 135 35 Q135 25 125 20 Q100 15 75 20 Q65 25 65 35"
          className="fill-foreground/80"
        />
        
        {/* Neck */}
        <rect x="88" y="82" width="24" height="20" className="fill-secondary" />
        
        {/* Body outline */}
        <path
          d="M60 100 L60 280 Q60 290 70 290 L130 290 Q140 290 140 280 L140 100 Q140 95 130 95 L70 95 Q60 95 60 100"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        
        {/* Arms */}
        <path
          d="M60 105 L35 180 Q32 190 38 195 L45 195 L65 130"
          className="fill-secondary stroke-border"
          strokeWidth="2"
        />
        <path
          d="M140 105 L165 180 Q168 190 162 195 L155 195 L135 130"
          className="fill-secondary stroke-border"
          strokeWidth="2"
        />
        
        {/* Legs */}
        <rect x="68" y="285" width="25" height="90" rx="5" className="fill-secondary stroke-border" strokeWidth="2" />
        <rect x="107" y="285" width="25" height="90" rx="5" className="fill-secondary stroke-border" strokeWidth="2" />
        
        {/* Feet */}
        <ellipse cx="80" cy="380" rx="20" ry="10" className="fill-card stroke-border" strokeWidth="2" />
        <ellipse cx="120" cy="380" rx="20" ry="10" className="fill-card stroke-border" strokeWidth="2" />
      </svg>

      {/* Clothing overlays */}
      {dress && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '22%', height: '50%' }}>
          <img
            src={dress.imageUrl}
            alt="Dress"
            className="w-[50%] h-full object-contain animate-scale-in"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      )}

      {!dress && top && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '22%', height: '28%' }}>
          <img
            src={top.imageUrl}
            alt="Top"
            className="w-[50%] h-full object-contain animate-scale-in"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      )}

      {!dress && bottom && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '48%', height: '25%' }}>
          <img
            src={bottom.imageUrl}
            alt="Bottom"
            className="w-[45%] h-full object-contain animate-scale-in"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      )}

      {shoes && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '88%', height: '12%' }}>
          <img
            src={shoes.imageUrl}
            alt="Shoes"
            className="w-[35%] h-full object-contain animate-scale-in"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      )}
    </div>
  );
}
