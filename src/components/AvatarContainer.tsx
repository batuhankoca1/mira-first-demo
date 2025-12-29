import { DemoItem, CATEGORY_ORDER } from '@/data/demoCloset';
import { ClothingCategory } from '@/types/clothing';

interface AvatarContainerProps {
  selectedItems: Partial<Record<ClothingCategory, DemoItem | null>>;
  className?: string;
}

// Fixed container: 300x600
const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 600;

// Z-index for each layer (strict order)
const Z_INDEX: Record<ClothingCategory, number> = {
  shoes: 1,
  bottoms: 2,
  tops: 3,
  dresses: 4, // Dresses go over tops+bottoms visually
  jackets: 5,
  bags: 6,
  accessories: 7,
};

export function AvatarContainer({ selectedItems, className = '' }: AvatarContainerProps) {
  // Render a single clothing layer
  const renderClothingLayer = (item: DemoItem) => {
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
    (item): item is DemoItem => item !== null && item !== undefined
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
      {/* Base Avatar with underwear - single reusable asset */}
      <svg
        viewBox="0 0 300 600"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 0 }}
      >
        {/* Head */}
        <ellipse cx="150" cy="70" rx="45" ry="55" fill="#F5DEB3" stroke="#D4B896" strokeWidth="2" />
        
        {/* Hair */}
        <path
          d="M105 55 Q105 15 150 15 Q195 15 195 55 Q195 35 175 28 Q150 20 125 28 Q105 35 105 55"
          fill="#5C4033"
        />
        <path
          d="M100 60 Q95 120 105 150 Q100 130 100 100 Q100 80 100 60"
          fill="#5C4033"
        />
        <path
          d="M200 60 Q205 120 195 150 Q200 130 200 100 Q200 80 200 60"
          fill="#5C4033"
        />
        
        {/* Face details */}
        <ellipse cx="130" cy="65" rx="6" ry="4" fill="#5C4033" />
        <ellipse cx="170" cy="65" rx="6" ry="4" fill="#5C4033" />
        <path d="M145 85 Q150 92 155 85" stroke="#C9A88B" strokeWidth="2" fill="none" />
        
        {/* Neck */}
        <rect x="135" y="122" width="30" height="28" fill="#F5DEB3" />
        
        {/* Body/Torso */}
        <path
          d="M95 150 L95 330 Q95 340 110 340 L190 340 Q205 340 205 330 L205 150 Q205 145 190 145 L110 145 Q95 145 95 150"
          fill="#F5DEB3"
          stroke="#D4B896"
          strokeWidth="2"
        />
        
        {/* Arms */}
        <path
          d="M95 155 L60 265 Q55 280 63 287 L73 287 L100 190"
          fill="#F5DEB3"
          stroke="#D4B896"
          strokeWidth="2"
        />
        <path
          d="M205 155 L240 265 Q245 280 237 287 L227 287 L200 190"
          fill="#F5DEB3"
          stroke="#D4B896"
          strokeWidth="2"
        />
        
        {/* Hands */}
        <ellipse cx="68" cy="290" rx="12" ry="8" fill="#F5DEB3" stroke="#D4B896" strokeWidth="1" />
        <ellipse cx="232" cy="290" rx="12" ry="8" fill="#F5DEB3" stroke="#D4B896" strokeWidth="1" />
        
        {/* Underwear - Bra */}
        <path
          d="M110 165 Q115 155 135 155 Q150 155 150 168 Q150 155 165 155 Q185 155 190 165 L190 185 Q185 195 170 195 Q155 192 150 185 Q145 192 130 195 Q115 195 110 185 Z"
          fill="#E8B4B8"
          stroke="#D49A9E"
          strokeWidth="1.5"
        />
        
        {/* Underwear - Panties */}
        <path
          d="M115 310 L115 340 Q115 365 130 380 L130 340 Q132 330 150 330 Q168 330 170 340 L170 380 Q185 365 185 340 L185 310 Q175 305 150 305 Q125 305 115 310 Z"
          fill="#E8B4B8"
          stroke="#D49A9E"
          strokeWidth="1.5"
        />
        
        {/* Legs */}
        <path
          d="M115 340 L115 470 Q115 485 130 485 L130 340"
          fill="#F5DEB3"
          stroke="#D4B896"
          strokeWidth="2"
        />
        <path
          d="M170 340 L170 470 Q170 485 185 485 L185 340"
          fill="#F5DEB3"
          stroke="#D4B896"
          strokeWidth="2"
        />
        <rect x="115" y="340" width="15" height="145" fill="#F5DEB3" />
        <rect x="170" y="340" width="15" height="145" fill="#F5DEB3" />
        
        {/* Feet */}
        <ellipse cx="122" cy="490" rx="22" ry="12" fill="#F5DEB3" stroke="#D4B896" strokeWidth="2" />
        <ellipse cx="178" cy="490" rx="22" ry="12" fill="#F5DEB3" stroke="#D4B896" strokeWidth="2" />
      </svg>

      {/* Clothing layers */}
      {filteredItems.map(renderClothingLayer)}
    </div>
  );
}
