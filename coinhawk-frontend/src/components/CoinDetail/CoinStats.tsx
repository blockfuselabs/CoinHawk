import React from 'react';

interface CoinStatsProps {
  coin: {
    totalSupply: number;
    maxSupply: number;
    uniqueHolders: number;
  };
}

export const CoinStats: React.FC<CoinStatsProps> = ({ coin }) => {
  const stats = [
    { label: 'Total Supply', value: coin.totalSupply.toLocaleString() },
    { label: 'Max Supply', value: coin.maxSupply.toLocaleString() },
    { label: 'Unique Holders', value: coin.uniqueHolders.toLocaleString() },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Statistics</h3>
      <div className="space-y-3 md:space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-dark-text-muted text-sm md:text-base">{stat.label}</span>
            <span className="text-dark-text-primary font-mono text-sm md:text-base">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
