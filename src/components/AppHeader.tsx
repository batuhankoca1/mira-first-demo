import { Menu, User, CloudSun, MapPin } from 'lucide-react';

export const AppHeader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#fdf6ed] via-[#fdf6ed]/90 to-transparent">
      <div className="max-w-md mx-auto px-4 pt-4 pb-5">
        <div className="flex items-center justify-between">
          <button className="w-10 h-10 flex items-center justify-center text-amber-900/70 hover:text-amber-900 transition-colors">
            <Menu className="w-6 h-6" strokeWidth={2.5} />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-serif font-bold text-amber-800 tracking-wider">MIRA</h1>
          </div>
          
          <button className="w-10 h-10 rounded-full border-2 border-amber-800/30 flex items-center justify-center text-amber-800 hover:bg-amber-100/50 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
        
        {/* Weather Widget - Centered */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 text-amber-800/80">
            <CloudSun className="w-4 h-4" />
            <span className="text-xs font-medium">18°C, Parçalı Bulutlu</span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-700/60">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Beşiktaş</span>
          </div>
        </div>
      </div>
    </div>
  );
};
