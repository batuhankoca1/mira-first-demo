import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { Compass, TrendingUp, Users, Sparkles } from 'lucide-react';

const Explore = () => {
  return (
    <div className="fixed inset-0 bg-[#fdf6ed] flex flex-col">
      <AppHeader />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-28">
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-amber-700" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-amber-900 mb-2">Coming Soon</h2>
            <p className="text-amber-800/70 mb-8 max-w-[280px]">
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
      </div>

      <BottomNav />
    </div>
  );
};

function PreviewFeature({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-amber-200/50">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-amber-700" />
      </div>
      <div className="text-left">
        <p className="font-medium text-amber-900">{title}</p>
        <p className="text-sm text-amber-800/60">{description}</p>
      </div>
    </div>
  );
}

export default Explore;
