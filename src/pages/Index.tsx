import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        
        <div className="relative container max-w-md mx-auto px-6 pt-16 pb-12">
          {/* Logo */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-6xl font-serif font-bold tracking-tight mb-2">
              MIRA
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personal style companion
            </p>
          </div>

          {/* Illustration */}
          <div className="relative h-[280px] mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Decorative circles */}
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-accent/10 animate-float" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-secondary animate-float" style={{ animationDelay: '1s' }} />
                
                {/* Main icon */}
                <div className="relative w-48 h-48 rounded-3xl bg-card shadow-elevated flex items-center justify-center">
                  <span className="text-8xl">👗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <FeatureCard
              icon="📸"
              title="Capture Your Wardrobe"
              description="Photograph your clothes to build your digital closet"
            />
            <FeatureCard
              icon="🪞"
              title="Mix & Match"
              description="Dress your avatar with swipe-based outfit creation"
            />
            <FeatureCard
              icon="✨"
              title="Discover Your Style"
              description="Find new ways to wear what you already own"
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Button asChild size="lg" className="w-full">
              <Link to="/closet">Open My Closet</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/dressup">Try Dress Up</Link>
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-soft">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="font-medium text-foreground mb-0.5">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default Index;
