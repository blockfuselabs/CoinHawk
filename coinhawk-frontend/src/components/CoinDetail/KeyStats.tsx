import React from 'react';

interface KeyStatsProps {
  coin: {
    marketCap: number;
    volume24h: number;
    circulatingSupply: number;
  };
}

export const KeyStats: React.FC<KeyStatsProps> = ({ coin }) => {
  const stats = [
    {
      label: 'Market Cap',
      value: `$${(coin.marketCap / 1e6).toFixed(2)}M`
    },
    {
      label: 'Fully Diluted Valuation',
      value: `$${(coin.marketCap / 1e6).toFixed(2)}M`
    },
    {
      label: '24h Trading Vol',
      value: `$${(coin.volume24h / 1e6).toFixed(2)}M`
    },
    {
      label: 'Circulating Supply',
      value: `${(coin.circulatingSupply / 1e6).toFixed(2)}M`
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center md:text-left">
          <div className="text-xs md:text-sm text-dark-text-muted mb-1 line-clamp-2">
            {stat.label}
          </div>
          <div className="font-bold text-dark-text-primary text-sm md:text-base">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};