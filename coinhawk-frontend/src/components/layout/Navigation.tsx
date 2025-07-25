import React from 'react';
import { Home, Star, TrendingUp, Settings, BarChart3, Wallet, Bell } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  compact?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  compact = false 
}) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      description: 'All coined posts' 
    },
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: TrendingUp, 
      description: 'Hot coins today' 
    },
    { 
      id: 'watchlist', 
      label: 'Watchlist', 
      icon: Star, 
      description: 'Your saved coins' 
    },
    { 
      id: 'portfolio', 
      label: 'Portfolio', 
      icon: Wallet, 
      description: 'Your holdings' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Market insights' 
    },
  ];

  const bottomItems = [
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      description: 'Alerts & updates' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'App preferences' 
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0], isBottom = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 relative ${
          isActive
            ? 'bg-hawk-accent text-hawk-primary font-semibold shadow-lg'
            : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-light'
        }`}
        title={compact ? item.label : undefined}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!compact && (
          <div className="flex-1 min-w-0">
            <span className="block">{item.label}</span>
            {!isActive && (
              <span className="text-xs text-dark-text-muted group-hover:text-dark-text-secondary transition-colors">
                {item.description}
              </span>
            )}
          </div>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-hawk-primary rounded-r-full"></div>
        )}
      </button>
    );
  };

  if (compact) {
    return (
      <nav className="flex flex-col items-center space-y-2 py-4">
        {menuItems.map(item => renderMenuItem(item))}
        <div className="w-8 h-px bg-dark-border my-4"></div>
        {bottomItems.map(item => renderMenuItem(item, true))}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wide">
          MAIN MENU
        </h3>
      </div>
      
      {menuItems.map(item => renderMenuItem(item))}
      
      <div className="px-6 py-4">
        <div className="w-full h-px bg-dark-border"></div>
      </div>
      
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wide">
          ACCOUNT
        </h3>
      </div>
      
      {bottomItems.map(item => renderMenuItem(item, true))}
    </nav>
  );
};