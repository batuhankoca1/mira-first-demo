import { ClothingItem } from '@/types/clothing';
import { cn } from '@/lib/utils';

interface Avatar2DProps {
  top?: ClothingItem;
  bottom?: ClothingItem;
  dress?: ClothingItem;
  jacket?: ClothingItem;
  shoes?: ClothingItem;
  bag?: ClothingItem;
  accessory?: ClothingItem;
  className?: string;
}

// Fixed layer positions for each category (percentage-based for responsiveness)
const LAYER_STYLES: Record<string, React.CSSProperties> = {
  dress: {
    top: '22%',
    height: '50%',
    width: '55%',
  },
  top: {
    top: '22%',
    height: '28%',
    width: '50%',
  },
  jacket: {
    top: '20%',
    height: '32%',
    width: '58%',
  },
  bottom: {
    top: '48%',
    height: '26%',
    width: '45%',
  },
  shoes: {
    top: '88%',
    height: '12%',
    width: '35%',
  },
  bag: {
    top: '40%',
    right: '5%',
    left: 'auto',
    height: '20%',
    width: '25%',
  },
  accessory: {
    top: '5%',
    height: '15%',
    width: '30%',
  },
};

export function Avatar2D({ 
  top, 
  bottom, 
  dress, 
  jacket,
  shoes, 
  bag,
  accessory,
  className 
}: Avatar2DProps) {
  // Render a clothing layer
  const renderLayer = (
    item: ClothingItem | undefined, 
    layerKey: string,
    zIndex: number
  ) => {
    if (!item) return null;
    
    const style = LAYER_STYLES[layerKey];
    const itemScale = item.scale ?? 1;
    const offset = item.anchorOffset ?? { x: 0, y: 0 };
    
    return (
      <div 
        key={layerKey}
        className="absolute flex items-center justify-center"
        style={{ 
          ...style,
          left: style.left ?? '50%',
          transform: `translateX(${style.left ? 0 : -50}%) translateX(${offset.x}px) translateY(${offset.y}px) scale(${itemScale})`,
          zIndex,
        }}
      >
        <img
          src={item.imageUrl}
          alt={layerKey}
          className="w-full h-full object-contain animate-scale-in"
          style={{ 
            mixBlendMode: 'multiply',
            imageRendering: 'auto',
          }}
          draggable={false}
        />
      </div>
    );
  };

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

      {/* Clothing layers - ordered by z-index */}
      {/* Bottom layer (pants/skirt) */}
      {!dress && renderLayer(bottom, 'bottom', 10)}
      
      {/* Dress (replaces top + bottom) */}
      {renderLayer(dress, 'dress', 15)}
      
      {/* Top layer */}
      {!dress && renderLayer(top, 'top', 20)}
      
      {/* Jacket layer (over top) */}
      {renderLayer(jacket, 'jacket', 25)}
      
      {/* Shoes */}
      {renderLayer(shoes, 'shoes', 5)}
      
      {/* Bag (side accessory) */}
      {renderLayer(bag, 'bag', 30)}
      
      {/* Accessory (head/neck) */}
      {renderLayer(accessory, 'accessory', 35)}
    </div>
  );
}
