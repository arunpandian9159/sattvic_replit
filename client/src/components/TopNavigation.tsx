import { Link, useLocation } from 'wouter';
import { Home, UtensilsCrossed, ShoppingBag, User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function TopNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = user ? [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/meals', icon: UtensilsCrossed, label: 'Meals' },
    { path: '/my-orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' },
  ] : [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/meals', icon: UtensilsCrossed, label: 'Meals' },
    { path: '/login', icon: LogIn, label: 'Sign In' },
    { path: '/register', icon: User, label: 'Sign Up' },
  ];

  return (
    <nav className="top-nav w-full bg-card border-b border-border px-6 py-2 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-primary">Sattvic</span>
      </div>
      <div className="hidden md:flex gap-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path} className={`flex items-center gap-1 px-4 py-2 rounded transition-colors font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      {/* Hamburger for mobile */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(v => !v)} className="p-2 rounded focus:outline-none focus:ring">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        {menuOpen && (
          <div className="absolute right-4 top-14 bg-card border rounded shadow-lg flex flex-col w-48 animate-fade-in">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location === path;
              return (
                <Link key={path} href={path} className={`flex items-center gap-2 px-4 py-3 border-b last:border-b-0 transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`} onClick={() => setMenuOpen(false)}>
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
} 