import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useMockUser } from '@/hooks/useMockUser';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  User, 
  Settings, 
  Heart, 
  ShoppingBag, 
  Bell, 
  Shirt, 
  Sparkles,
  ChevronRight,
  Camera,
  Package,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, wardrobeCount, outfitCount } = useMockUser();
  const { getFavoriteCount } = useFavorites();
  
  const favoriteCount = getFavoriteCount();

  return (
    <div className="min-h-screen bg-background pb-28 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-md mx-auto px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-center">Profil</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-md mx-auto px-6 py-8">
        {/* User Card */}
        <div className="bg-gradient-to-br from-accent/10 via-amber-500/5 to-transparent rounded-3xl p-6 mb-6 border border-accent/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.name.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border-2 border-background rounded-full flex items-center justify-center shadow-sm">
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-accent mt-1">MIRA Premium Üye ✨</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard 
            icon={<Shirt className="w-4 h-4 text-accent" />} 
            label="Parça" 
            value={wardrobeCount.toString()} 
          />
          <StatCard 
            icon={<Sparkles className="w-4 h-4 text-accent" />} 
            label="Kombin" 
            value={outfitCount.toString()} 
          />
          <StatCard 
            icon={<Heart className="w-4 h-4 text-red-500" />} 
            label="Favori" 
            value={favoriteCount.toString()} 
            onClick={() => navigate('/favorites')}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <QuickActionCard 
            icon={<Heart className="w-5 h-5 text-red-500" />}
            label="Favorilerim"
            count={favoriteCount}
            onClick={() => navigate('/favorites')}
          />
          <QuickActionCard 
            icon={<ShoppingBag className="w-5 h-5 text-accent" />}
            label="Siparişlerim"
            count={2}
            onClick={() => {}}
          />
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          {/* Main Menu */}
          <MenuSection title="Hesabım">
            <MenuItem 
              icon={<Package className="w-5 h-5" />} 
              label="Satın Alımlarım" 
              onClick={() => {}}
            />
            <MenuItem 
              icon={<CreditCard className="w-5 h-5" />} 
              label="MIRA Cüzdan" 
              badge="₺2,500"
              onClick={() => {}}
            />
            <MenuItem 
              icon={<Bell className="w-5 h-5" />} 
              label="Bildirimler" 
              badge="3"
              onClick={() => {}}
            />
          </MenuSection>

          {/* Settings Menu */}
          <MenuSection title="Ayarlar">
            <MenuItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Uygulama Ayarları" 
              onClick={() => {}}
            />
            <MenuItem 
              icon={<HelpCircle className="w-5 h-5" />} 
              label="Yardım & Destek" 
              onClick={() => {}}
            />
          </MenuSection>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">MIRA v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Demo Hesap</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}

function StatCard({ icon, label, value, onClick }: StatCardProps) {
  return (
    <button 
      onClick={onClick}
      className="p-4 rounded-2xl bg-card border border-border/50 text-center hover:bg-card/80 transition-colors"
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-serif font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </button>
  );
}

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}

function QuickActionCard({ icon, label, count, onClick }: QuickActionCardProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:bg-card/80 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{count} ürün</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
        {title}
      </h3>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/30">
        {children}
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick: () => void;
}

function MenuItem({ icon, label, badge, onClick }: MenuItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-muted-foreground">
        {icon}
      </div>
      <span className="flex-1 text-left font-medium text-foreground">{label}</span>
      {badge && (
        <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

export default Profile;
