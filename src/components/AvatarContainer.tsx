import { WardrobeItem, StyleAdjustments } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar-v2.png';
import avatarMask from '@/assets/avatar-mask.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
  isTuckedIn?: boolean;
}

// Default positioning config for each wearable category
interface LayerConfig {
  top: string;
  left: string;
  width: string;
  zIndex: number;
  scaleX?: number;
  scaleY?: number;
}

const DEFAULT_LAYER_CONFIG: Record<'tops' | 'bottoms', LayerConfig> = {
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

// Compute final layer config by merging defaults with per-item adjustments
function getLayerConfig(
  category: 'tops' | 'bottoms',
  item: WardrobeItem,
  isTuckedIn: boolean
): LayerConfig {
  const defaults = DEFAULT_LAYER_CONFIG[category];
  const adj = item.styleAdjustments || {};
  
  // Tuck-in logic: swap z-index so bottoms cover tops
  let zIndex = adj.zIndex ?? defaults.zIndex;
  if (isTuckedIn) {
    zIndex = category === 'tops' ? 10 : 25;
  }

  return {
    top: adj.top ?? defaults.top,
    left: adj.left ?? defaults.left,
    width: adj.width ?? defaults.width,
    zIndex,
    scaleX: adj.scaleX ?? defaults.scaleX,
    scaleY: adj.scaleY ?? defaults.scaleY,
  };
}

// Render order (z-index: bottom to top by default)
const RENDER_ORDER: ('tops' | 'bottoms')[] = ['bottoms', 'tops'];

export function AvatarContainer({ selectedItems, className = '', isTuckedIn = false }: AvatarContainerProps) {
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
            top: '5%',
            left: '5%',
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            zIndex: 0,
          }}
          draggable={false}
        />

        {/* Clothing layers */}
        {RENDER_ORDER.map((category) => {
          const item = selectedItems[category];
          if (!item) return null;

          const config = getLayerConfig(category, item, isTuckedIn);
          const hasScale = config.scaleX || config.scaleY;
          const transform = hasScale 
            ? `scale(${config.scaleX ?? 1}, ${config.scaleY ?? 1})` 
            : undefined;

          return (
            <img
              key={item.id}
              src={item.src}
              alt={category}
              className="pointer-events-none transition-all duration-300 ease-out"
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

        {/* Avatar Mask - head/neck/hands overlay for realism */}
        <img
          src={avatarMask}
          alt=""
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 50,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
