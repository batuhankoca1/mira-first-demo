import { WardrobeItem } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Fine-tuned positioning for transparent clothing on the anime avatar
const LAYER_STYLES: Record<ClothingCategory, React.CSSProperties> = {
  // Tops: positioned at chest/torso area
  tops: {
    position: 'absolute',
    top: '18%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '48%',
    zIndex: 30,
  },
  // Bottoms: positioned at waist → legs
  bottoms: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50%',
    zIndex: 20,
  },
  // Bag: hangs on right side (empty for now)
  bags: {
    position: 'absolute',
    top: '38%',
    left: '70%',
    transform: 'translateX(-50%)',
    width: '20%',
    zIndex: 40,
  },
};

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  // Render a clothing layer with hardcoded positioning
  const renderClothingLayer = (category: ClothingCategory) => {
    const item = selectedItems[category];
    if (!item) return null;

    return (
      <img
        key={item.id}
        src={item.src}
        alt={category}
        className="pointer-events-none"
        style={{
          ...LAYER_STYLES[category],
          height: 'auto',
          objectFit: 'contain',
          opacity: 1,
        }}
        draggable={false}
      />
    );
  };

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
      {/* Inner wrapper maintains aspect ratio */}
      <div className="relative" style={{ height: '100%', aspectRatio: '1 / 2' }}>
        {/* Base Avatar - ALWAYS visible, z-index 0 */}
        <img
          src={baseAvatar}
          alt="Base Avatar"
          className="object-contain"
          style={{
            position: 'relative',
            zIndex: 0,
            display: 'block',
            opacity: 1,
            maxHeight: '100%',
            width: 'auto',
          }}
          draggable={false}
        />

        {/* Clothing layers - hardcoded positions, rendered in z-order */}
        {renderClothingLayer('bottoms')}
        {renderClothingLayer('tops')}
        {renderClothingLayer('bags')}
      </div>
    </div>
  );
}
