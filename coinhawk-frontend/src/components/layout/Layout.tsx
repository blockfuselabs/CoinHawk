// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { Header } from './Header';
import { PageNavigation } from './PageNavigation';
import { MobileNavigation } from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // You can emit this to parent components or global state
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header 
        onSearchChange={handleSearchChange} 
        searchQuery={searchQuery} 
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block">
        <PageNavigation 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
      
      <main className="w-full pb-20 md:pb-0">
        <div className=" md:mx-10 px-2 md:px-6 py-4 md:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Navigation - Only visible on mobile */}
      <MobileNavigation 
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
};