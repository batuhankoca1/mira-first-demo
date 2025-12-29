import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Compass, TrendingUp, Users, Sparkles } from 'lucide-react';

const Explore = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-md mx-auto px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-center">Explore</h1>
          <p className="text-sm text-muted-foreground text-center">Discover style inspiration</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-md mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Compass className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-serif font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-8 max-w-[280px]">
            Discover trending styles, outfit inspiration, and connect with the fashion community
          </p>

          {/* Preview features */}
          <div className="w-full space-y-3">
            <PreviewFeature
              icon={TrendingUp}
              title="Trending Styles"
              description="See what's popular this season"
            />
            <PreviewFeature
              icon={Sparkles}
              title="Style Inspiration"
              description="Get outfit ideas based on your closet"
            />
            <PreviewFeature
              icon={Users}
              title="Community"
              description="Share looks and get feedback"
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

function PreviewFeature({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="text-left">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default Explore;
