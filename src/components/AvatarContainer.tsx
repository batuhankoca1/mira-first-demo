import { WardrobeItem, CATEGORY_ORDER } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Reference dimensions for positioning calculations
const REFERENCE_WIDTH = 300;
const REFERENCE_HEIGHT = 600;

// Z-index for each layer (strict order per spec)
const Z_INDEX: Record<ClothingCategory, number> = {
  shoes: 5,
  bottoms: 10,
  tops: 20,
  dresses: 25,
  jackets: 30,
  bags: 35,
  accessories: 40,
};

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  // Get active items in z-order
  const activeItems = CATEGORY_ORDER.map((cat) => selectedItems[cat]).filter(
    (item): item is WardrobeItem => item !== null && item !== undefined
  );

  // If dress is selected, hide tops and bottoms visually
  const hasDress = selectedItems.dresses != null;
  const filteredItems = activeItems.filter((item) => {
    if (hasDress && (item.category === 'tops' || item.category === 'bottoms')) {
      return false;
    }
    return true;
  });

  // Render a single clothing layer
  const renderClothingLayer = (item: WardrobeItem) => {
    // Convert to percentage-based positioning
    const leftPercent = ((item.anchorX + item.offsetX - item.width / 2) / REFERENCE_WIDTH) * 100;
    const topPercent = ((item.anchorY + item.offsetY - item.width / 2) / REFERENCE_HEIGHT) * 100;
    const widthPercent = (item.width / REFERENCE_WIDTH) * 100;

    return (
      <img
        key={item.id}
        src={item.src}
        alt={item.category}
        className="absolute object-contain pointer-events-none transition-all duration-150"
        style={{
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          width: `${widthPercent}%`,
          height: 'auto',
          zIndex: Z_INDEX[item.category],
        }}
        draggable={false}
      />
    );
  };

  return (
    <div
      className={`relative flex justify-center items-end h-full w-full ${className}`}
    >
      {/* Inner wrapper that maintains aspect ratio */}
      <div 
        className="relative"
        style={{ 
          height: '90%',
          aspectRatio: `${REFERENCE_WIDTH} / ${REFERENCE_HEIGHT}`,
        }}
      >
        {/* Base Avatar - ALWAYS visible */}
        <img
          src={baseAvatar}
          alt="Base Avatar"
          className="relative w-full h-full object-contain"
          style={{ zIndex: 0 }}
          draggable={false}
        />

        {/* Clothing layers overlay */}
        {filteredItems.map(renderClothingLayer)}
      </div>
    </div>
  );
}
