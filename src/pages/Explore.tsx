import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Search } from 'lucide-react';
import { 
  INSPIRATION_LOOKS, 
  CATEGORY_LABELS, 
  getInspirationByCategory,
  searchInspiration,
  type InspirationCategory,
  type InspirationLook 
} from '@/data/inspirationData';
import { getItemsByCategory } from '@/data/wardrobeData';

type FilterCategory = InspirationCategory | 'all';

const FILTER_ORDER: FilterCategory[] = ['all', 'oldmoney', 'casual', 'datenight', 'sports'];

const Explore = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLook, setSelectedLook] = useState<InspirationLook | null>(null);

  const filteredLooks = useMemo(() => {
    if (searchQuery.trim()) {
      return searchInspiration(searchQuery);
    }
    return getInspirationByCategory(activeFilter);
  }, [activeFilter, searchQuery]);

  const handleFilterClick = (category: FilterCategory) => {
    setActiveFilter(category);
    setSearchQuery('');
  };

  const handleStyleOnAvatar = (look: InspirationLook) => {
    const tops = getItemsByCategory('tops');
    const bottoms = getItemsByCategory('bottoms');
    
    const topIndex = tops.findIndex(t => t.id === look.matchingItems.topId);
    const bottomIndex = bottoms.findIndex(b => b.id === look.matchingItems.bottomId);
    
    const outfitState = {
      tops: topIndex >= 0 ? topIndex : 0,
      bottoms: bottomIndex >= 0 ? bottomIndex : 0,
    };
    localStorage.setItem('dressup-outfit', JSON.stringify(outfitState));
    
    setSelectedLook(null);
    navigate('/dressup');
  };

  return (
    <div className="fixed inset-0 bg-[#fdf6ed] flex flex-col">
      <AppHeader />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-16 pb-24">
        <div className="max-w-md mx-auto">
          {/* Search Bar */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ara... (casual, date night, old money)"
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/70 border border-amber-200/50 text-sm text-amber-900 placeholder:text-amber-600/40 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="sticky top-0 z-10 bg-[#fdf6ed]/95 backdrop-blur-sm px-4 py-2 border-b border-amber-200/30">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {FILTER_ORDER.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterClick(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeFilter === category && !searchQuery
                      ? 'bg-amber-900 text-white'
                      : 'bg-white/70 text-amber-800 border border-amber-200'
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="px-3 py-3">
            <div className="columns-2 gap-2 space-y-2">
              {filteredLooks.map((look) => (
                <div
                  key={look.id}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => setSelectedLook(look)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-white shadow-sm">
                    <img
                      src={look.src}
                      alt={`${CATEGORY_LABELS[look.category]} look`}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-medium text-amber-900">
                        {CATEGORY_LABELS[look.category]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLooks.length === 0 && (
              <div className="text-center py-12 text-amber-800/60">
                Bu arama için sonuç bulunamadı
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Look Modal */}
      <Dialog open={!!selectedLook} onOpenChange={() => setSelectedLook(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-[#fdf6ed] border-amber-200">
          {selectedLook && (
            <>
              <button
                onClick={() => setSelectedLook(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative">
                <img
                  src={selectedLook.src}
                  alt="Selected look"
                  className="w-full max-h-[60vh] object-cover"
                />
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-100 rounded-full text-sm font-medium text-amber-900">
                    {CATEGORY_LABELS[selectedLook.category]}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleStyleOnAvatar(selectedLook)}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white rounded-full py-6"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Avatarda Dene
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Explore;
