import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'markets', label: 'Markets' },
    { id: 'news', label: 'News' },
    { id: 'similar', label: 'Similar' },
    { id: 'historical', label: 'Historical' },
  ];

  return (
    <div className="border-b border-dark-border overflow-x-auto">
      <nav className="flex space-x-4 md:space-x-8 min-w-max px-1">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 md:pb-4 border-b-2 transition-all duration-200 text-sm md:text-base whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-hawk-accent text-hawk-accent font-semibold'
                : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary hover:border-dark-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};