import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { User, Settings, Heart, ShoppingBag, Bell } from 'lucide-react';

const Profile = () => {
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
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4 border-4 border-card shadow-elevated">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-serif font-semibold">Misafir Kullanıcı</h2>
          <p className="text-sm text-muted-foreground">Stil yolculuğun seni bekliyor</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Parça" value="0" />
          <StatCard label="Kombin" value="0" />
          <StatCard label="Favori" value="0" />
        </div>

        {/* Menu */}
        <div className="space-y-2">
          <MenuItem icon={Heart} label="Kayıtlı Kombinler" badge="Yakında" />
          <MenuItem icon={ShoppingBag} label="Satın Alımlarım" badge="Yakında" />
          <MenuItem icon={Bell} label="Bildirimler" badge="Yakında" />
          <MenuItem icon={Settings} label="Ayarlar" badge="Yakında" />
        </div>

        {/* Login prompt */}
        <div className="mt-8 p-6 rounded-2xl bg-card border border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Dolabını tüm cihazlarında senkronize etmek için giriş yap
          </p>
          <Button variant="outline" className="w-full" disabled>
            Giriş Yap — Yakında
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/50 text-center">
      <p className="text-2xl font-serif font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function MenuItem({ icon: Icon, label, badge }: { icon: any; label: string; badge?: string }) {
  return (
    <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-card transition-colors duration-200">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <span className="flex-1 text-left font-medium text-foreground">{label}</span>
      {badge && (
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{badge}</span>
      )}
    </button>
  );
}

export default Profile;
