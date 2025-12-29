import { WardrobeItem, CATEGORY_ORDER } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Fixed container: 300x600
const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 600;

// Z-index for each layer (strict order per spec)
const Z_INDEX: Record<ClothingCategory, number> = {
  shoes: 5,
  bottoms: 10,
  tops: 20,
  dresses: 25, // Dresses go over tops+bottoms visually
  jackets: 30,
  bags: 35,
  accessories: 40,
};

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  // Render a single clothing layer
  const renderClothingLayer = (item: WardrobeItem) => {
    // Calculate position: anchorX/Y is center point, offset adjusts it
    const left = item.anchorX + item.offsetX - item.width / 2;
    // Maintain aspect ratio
    const height = item.width;
    const top = item.anchorY + item.offsetY - height / 2;

    return (
      <div
        key={item.id}
        className="absolute transition-all duration-150 ease-out pointer-events-none"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${item.width}px`,
          height: `${height}px`,
          zIndex: Z_INDEX[item.category],
        }}
      >
        <img
          src={item.src}
          alt={item.category}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  };

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

  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{
        width: `${CONTAINER_WIDTH}px`,
        height: `${CONTAINER_HEIGHT}px`,
      }}
    >
      {/* Base Avatar - anime style image */}
      <img
        src={baseAvatar}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ zIndex: 0 }}
        draggable={false}
      />

      {/* Clothing layers */}
      {filteredItems.map(renderClothingLayer)}
    </div>
  );
}
