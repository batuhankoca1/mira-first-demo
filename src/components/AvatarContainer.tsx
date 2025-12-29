import { WardrobeItem } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Hardcoded positioning for each category (percentage-based)
const LAYER_STYLES: Record<ClothingCategory, React.CSSProperties> = {
  tops: {
    position: 'absolute',
    top: '28%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '35%',
    zIndex: 20,
  },
  bottoms: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '32%',
    zIndex: 10,
  },
  bags: {
    position: 'absolute',
    top: '45%',
    left: '65%',
    width: '25%',
    zIndex: 30,
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
          mixBlendMode: 'multiply', // Makes white backgrounds transparent
          height: 'auto',
        }}
        draggable={false}
      />
    );
  };

  return (
    <div className={`relative flex justify-center items-end h-full w-full ${className}`}>
      {/* Inner wrapper maintains aspect ratio */}
      <div className="relative h-[90%]" style={{ aspectRatio: '1 / 2' }}>
        {/* Base Avatar - ALWAYS visible, z-index 0 */}
        <img
          src={baseAvatar}
          alt="Base Avatar"
          className="relative w-full h-full object-contain"
          style={{ zIndex: 0 }}
          draggable={false}
        />

        {/* Clothing layers - hardcoded positions */}
        {renderClothingLayer('bottoms')}
        {renderClothingLayer('tops')}
        {renderClothingLayer('bags')}
      </div>
    </div>
  );
}
