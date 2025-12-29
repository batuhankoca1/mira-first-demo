import { WardrobeItem } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Hardcoded positioning for each category - forced Paper Doll alignment
const LAYER_STYLES: Record<ClothingCategory, React.CSSProperties> = {
  tops: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70%',
    zIndex: 30,
  },
  bottoms: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '45%',
    zIndex: 20,
  },
  bags: {
    position: 'absolute',
    top: '40%',
    left: '70%',
    width: '30%',
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
          mixBlendMode: 'multiply', // Makes white backgrounds transparent
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
