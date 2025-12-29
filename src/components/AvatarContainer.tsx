import { WardrobeItem, CATEGORY_ORDER } from '@/data/wardrobeData';
import { ClothingCategory } from '@/types/clothing';
import baseAvatar from '@/assets/base-avatar.png';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

// Reference container dimensions for positioning calculations
const REFERENCE_WIDTH = 300;
const REFERENCE_HEIGHT = 600;

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
  // Render a single clothing layer with percentage-based positioning
  const renderClothingLayer = (item: WardrobeItem) => {
    // Convert fixed pixel values to percentages for responsive scaling
    const leftPercent = ((item.anchorX + item.offsetX - item.width / 2) / REFERENCE_WIDTH) * 100;
    const topPercent = ((item.anchorY + item.offsetY - item.width / 2) / REFERENCE_HEIGHT) * 100;
    const widthPercent = (item.width / REFERENCE_WIDTH) * 100;

    return (
      <div
        key={item.id}
        className="absolute transition-all duration-150 ease-out pointer-events-none"
        style={{
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          width: `${widthPercent}%`,
          aspectRatio: '1 / 1',
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
      className={`relative flex items-end justify-center w-full h-full ${className}`}
    >
      {/* Inner container maintains aspect ratio */}
      <div 
        className="relative h-[90%] max-h-full"
        style={{ aspectRatio: `${REFERENCE_WIDTH} / ${REFERENCE_HEIGHT}` }}
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
    </div>
  );
}
