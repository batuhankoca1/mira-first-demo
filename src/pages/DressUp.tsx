import { BottomNav } from '@/components/BottomNav';
import { OutfitSwiper } from '@/components/OutfitSwiper';
import { useCloset } from '@/hooks/useCloset';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DressUp = () => {
  const { items, isLoading } = useCloset();

  return (
    <div className="min-h-screen bg-background pb-28 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-md mx-auto px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-center">Dress Up</h1>
          <p className="text-sm text-muted-foreground text-center">Mix and match your outfits</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-md mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-4xl">🪞</span>
            </div>
            <p className="text-lg font-medium text-foreground mb-1">No clothes yet</p>
            <p className="text-sm text-muted-foreground mb-6">Add items to your closet first</p>
            <Button asChild>
              <Link to="/closet">Go to Closet</Link>
            </Button>
          </div>
        ) : (
          <OutfitSwiper items={items} />
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default DressUp;
