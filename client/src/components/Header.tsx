import React, { useState } from 'react';
import { Link } from 'wouter';
import { User, LogOut, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Sattvic Foods</h1>
                <p className="text-xs text-muted-foreground -mt-1">Fresh • Healthy • Home-style</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-foreground hover:text-primary transition-colors font-medium">Home</span>
            </Link>
            <Link href="/meals">
              <span className="text-foreground hover:text-primary transition-colors font-medium">Meal Plans</span>
            </Link>
            {user && (
              <Link href="/my-orders">
                <span className="text-foreground hover:text-primary transition-colors font-medium">My Orders</span>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-lg shadow-lg z-20 py-2">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Link href="/profile">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                      </Link>
                      <Link href="/my-orders">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                          My Orders
                        </button>
                      </Link>
                      <hr className="my-2 border-border" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="btn-secondary text-sm px-4 py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-primary text-sm px-4 py-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
