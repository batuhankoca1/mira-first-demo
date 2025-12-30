import { WardrobeItem } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Positioning config for each wearable category
// All values are percentages relative to the avatar container
interface LayerConfig {
  top: string;
  left: string;
  width: string;
  zIndex: number;
}

const LAYER_CONFIG: Partial<Record<ClothingCategory, LayerConfig>> = {
  tops: {
    top: '18%',
    left: '25%',
    width: '50%',
    zIndex: 20,
  },
  bottoms: {
    top: '38%',
    left: '24%',
    width: '52%',
    zIndex: 10,
  },
  bags: {
    top: '35%',
    left: '65%',
    width: '25%',
    zIndex: 30,
  },
};

// Wearable categories that can be rendered on avatar
const WEARABLE_CATEGORIES: ClothingCategory[] = ['bottoms', 'tops', 'bags'];

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '75vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
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
        {WEARABLE_CATEGORIES.map((category) => {
          const item = selectedItems[category];
          const config = LAYER_CONFIG[category];
          if (!item || !config) return null;

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
              }}
              draggable={false}
            />
          );
        })}
      </div>
    </div>
  );
}
