import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shirt, Layers, Store, Compass, User } from 'lucide-react';

const navItems = [
  { path: '/closet', label: 'Dolap', icon: Shirt },
  { path: '/dressup', label: 'Kombin', icon: Layers },
  { path: '/marketplace', label: 'Pazar', icon: Store },
  { path: '/explore', label: 'Keşfet', icon: Compass },
  { path: '/profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 max-w-md mx-auto">
      <div className="flex items-center justify-around h-20 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all duration-200 flex-1",
                isActive 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6 transition-transform duration-200", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-xs", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
