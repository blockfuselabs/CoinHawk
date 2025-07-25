// src/components/layout/PageNavigation.tsx
import React from 'react';
import { TrendingUp, Star, Wallet, BarChart3, Home } from 'lucide-react';

interface PageNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-dark-bg border-b border-dark-border/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-center space-x-12">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group flex items-center space-x-2 px-6 py-3 rounded-lg border-b-2 transition-all duration-300 relative ${
                  isActive
                    ? 'border-hawk-accent text-hawk-accent font-semibold bg-hawk-accent/5'
                    : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-light/30 hover:border-hawk-accent/40'
                }`}
              >
                <Icon className={`w-4 h-4 transition-all duration-300 ${
                  isActive ? 'text-hawk-accent' : 'text-dark-text-muted group-hover:text-dark-text-primary'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};