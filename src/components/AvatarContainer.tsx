import { WardrobeItem } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar-v2.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Positioning config for each wearable category
interface LayerConfig {
  top: string;
  left: string;
  width: string;
  zIndex: number;
  scaleX?: number;
  scaleY?: number;
}

const LAYER_CONFIG: Record<ClothingCategory, LayerConfig> = {
  tops: {
    top: '14%',
    left: '16%',
    width: '68%',
    zIndex: 20,
  },
  bottoms: {
    top: '38%',
    left: '7%',
    width: '58%',
    zIndex: 10,
    scaleX: 1.5,
    scaleY: 1.84,
  },
};

// Render order (z-index: bottom to top)
const RENDER_ORDER: ClothingCategory[] = ['bottoms', 'tops'];

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Inner wrapper maintains aspect ratio matching the avatar */}
      <div 
        className="relative" 
        style={{ 
          height: '100%', 
          aspectRatio: '1 / 2',
        }}
      >
        {/* Base Avatar - z-index 0 */}
        <img
          src={baseAvatar}
          alt="Base Avatar"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 0,
          }}
          draggable={false}
        />

        {/* Clothing layers */}
        {RENDER_ORDER.map((category) => {
          const item = selectedItems[category];
          const config = LAYER_CONFIG[category];
          if (!item || !config) return null;

          const hasScale = config.scaleX || config.scaleY;
          const transform = hasScale 
            ? `scale(${config.scaleX ?? 1}, ${config.scaleY ?? 1})` 
            : undefined;

          return (
            <img
              key={item.id}
              src={item.src}
              alt={category}
              className="pointer-events-none"
              style={{
                position: 'absolute',
                top: config.top,
                left: config.left,
                width: config.width,
                height: 'auto',
                objectFit: 'contain',
                zIndex: config.zIndex,
                transform,
                transformOrigin: 'top left',
              }}
              draggable={false}
            />
          );
        })}
      </div>
    </div>
  );
}
