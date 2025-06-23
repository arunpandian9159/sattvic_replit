import { Link, useLocation } from 'wouter';
import { Home, UtensilsCrossed, ShoppingBag, User, Clock } from 'lucide-react';

export default function MobileNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/meals', icon: UtensilsCrossed, label: 'Meals' },
    { path: '/my-orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <div className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors touch-target ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}