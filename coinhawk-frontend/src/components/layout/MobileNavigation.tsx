// src/components/layout/MobileNavigation.tsx
import React from 'react';
import { Home, TrendingUp, Star, Wallet, BarChart3 } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-dark-surface/95 backdrop-blur-lg border-t border-dark-border">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-hawk-accent bg-hawk-accent/10'
                    : 'text-dark-text-muted'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 transition-all duration-200 ${
                  isActive ? 'text-hawk-accent scale-110' : 'text-dark-text-muted'
                }`} />
                <span className={`text-xs font-medium transition-all duration-200 truncate ${
                  isActive ? 'text-hawk-accent' : 'text-dark-text-muted'
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-hawk-accent rounded-b-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};