import { DemoItem, CATEGORY_ORDER } from '@/data/demoCloset';
import { ClothingCategory } from '@/types/clothing';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, DemoItem | null>>;
  className?: string;
}

// Fixed container: 300x600
const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 600;

// Z-index for each layer
const Z_INDEX: Record<ClothingCategory, number> = {
  shoes: 1,
  bottoms: 2,
  tops: 3,
  dresses: 4, // Dresses go over tops+bottoms
  jackets: 5,
  bags: 6,
  accessories: 7,
};

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  // Render a single clothing layer
  const renderClothingLayer = (item: DemoItem) => {
    // Calculate position: anchorX/Y is center point, offset adjusts it
    const left = item.anchorX + item.offsetX - item.width / 2;
    // Maintain aspect ratio - assume square source for now
    const height = item.width;
    const top = item.anchorY + item.offsetY - height / 2;

    return (
      <div
        key={item.id}
        className="absolute transition-all duration-200 ease-out"
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
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    );
  };

  // Get active items in z-order
  const activeItems = CATEGORY_ORDER.map((cat) => selectedItems[cat]).filter(
    (item): item is DemoItem => item !== null && item !== undefined
  );

  // If dress is selected, hide tops and bottoms
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
      {/* Base Avatar - naked body silhouette */}
      <svg
        viewBox="0 0 300 600"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <ellipse cx="150" cy="70" rx="45" ry="55" className="fill-secondary stroke-border" strokeWidth="2" />
        
        {/* Hair */}
        <path
          d="M105 55 Q105 20 150 20 Q195 20 195 55 Q195 40 180 32 Q150 25 120 32 Q105 40 105 55"
          className="fill-foreground/80"
        />
        
        {/* Neck */}
        <rect x="135" y="122" width="30" height="28" className="fill-secondary" />
        
        {/* Torso */}
        <path
          d="M90 150 L90 320 Q90 335 105 335 L195 335 Q210 335 210 320 L210 150 Q210 145 195 145 L105 145 Q90 145 90 150"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        
        {/* Arms */}
        <path
          d="M90 155 L55 260 Q50 275 58 282 L68 282 L95 185"
          className="fill-secondary stroke-border"
          strokeWidth="2"
        />
        <path
          d="M210 155 L245 260 Q250 275 242 282 L232 282 L205 185"
          className="fill-secondary stroke-border"
          strokeWidth="2"
        />
        
        {/* Legs */}
        <rect x="105" y="330" width="35" height="150" rx="8" className="fill-secondary stroke-border" strokeWidth="2" />
        <rect x="160" y="330" width="35" height="150" rx="8" className="fill-secondary stroke-border" strokeWidth="2" />
        
        {/* Feet */}
        <ellipse cx="122" cy="490" rx="28" ry="14" className="fill-card stroke-border" strokeWidth="2" />
        <ellipse cx="178" cy="490" rx="28" ry="14" className="fill-card stroke-border" strokeWidth="2" />
      </svg>

      {/* Clothing layers */}
      {filteredItems.map(renderClothingLayer)}
    </div>
  );
}
