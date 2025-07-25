import React, { useState } from 'react';
import { Search, Bell, TrendingUp, Settings, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  searchQuery, 
  onTabChange 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);



  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="glass border-b border-dark-border/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-hawk-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gradient">CoinHawk</h1>
                <p className="text-xs text-dark-text-muted hidden md:block">Base Coined Post Trading App</p>
              </div>
              {/* Mobile brand text */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gradient">CoinHawk</h1>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                <input
                  type="text"
                  placeholder="Search coins, symbols, or addresses..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="input input-search w-full bg-dark-surface/50"
                />
              </div>
            </div>

            {/* Mobile Search Toggle & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Mobile Search Button */}
              <button 
                className="md:hidden btn-ghost p-2 rounded-xl"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="btn-ghost p-2 rounded-xl relative hidden sm:block">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full text-xs"></span>
              </button>

              {/* Settings */}
              <button 
                className="btn-ghost p-2 rounded-xl hidden sm:block"
                onClick={() => handleTabChange('settings')}
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                className="btn-ghost p-2 rounded-xl md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Expandable) */}
          {isSearchExpanded && (
            <div className="mt-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
                <input
                  type="text"
                  placeholder="Search coins, symbols..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="input input-search w-full bg-dark-surface/50 pl-10 py-2 text-sm"
                  autoFocus
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

       
        </div>
      </header>

      {/* Mobile Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-dark-surface border-l border-dark-border z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-accent rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-hawk-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-gradient">CoinHawk</h2>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-ghost p-2 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>


              {/* Mobile Menu Actions */}
              <div className="mt-8 pt-6 border-t border-dark-border/30">
                <div className="space-y-2">
                  <button 
                    onClick={() => handleTabChange('settings')}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-light transition-all duration-200"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-light transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Notifications</span>
                    <div className="ml-auto w-2 h-2 bg-danger rounded-full" />
                  </button>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="mt-8 pt-6 border-t border-dark-border/30">
                <p className="text-xs text-dark-text-muted text-center">
                  Base Coined Post Trading App
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};