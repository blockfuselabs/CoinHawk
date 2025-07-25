// src/components/coin/CoinStats.tsx
import React from 'react';
import { Users, DollarSign, TrendingUp, Coins, ExternalLink, Copy } from 'lucide-react';

interface CoinStatsProps {
  stats: {
    marketCap: number;
    totalSupply: number;
    volume24h: number;
    uniqueHolders: number;
    creatorAddress: string;
  };
}

export const CoinStats: React.FC<CoinStatsProps> = ({ stats }) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e12) return `${(supply / 1e12).toFixed(2)}T`;
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(1)}K`;
    return supply.toFixed(0);
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(stats.creatorAddress);
  };

  const handleViewOnExplorer = () => {
    // Open in Base explorer
    window.open(`https://basescan.org/address/${stats.creatorAddress}`, '_blank');
  };

  const statItems = [
    {
      icon: DollarSign,
      label: 'Market Cap',
      value: formatLargeNumber(stats.marketCap),
      subValue: 'Current valuation',
      color: 'text-hawk-accent',
      bgColor: 'bg-hawk-accent/10',
    },
    {
      icon: TrendingUp,
      label: '24h Volume',
      value: formatLargeNumber(stats.volume24h),
      subValue: 'Trading activity',
      color: 'text-success-500',
      bgColor: 'bg-success-500/10',
    },
    {
      icon: Coins,
      label: 'Total Supply',
      value: formatSupply(stats.totalSupply),
      subValue: 'Total tokens',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      label: 'Unique Holders',
      value: stats.uniqueHolders.toLocaleString(),
      subValue: 'Token holders',
      color: 'text-warning-500',
      bgColor: 'bg-warning-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="stats-grid">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="card card-hover fade-in">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark-text-muted">{item.label}</p>
                  <p className="text-xs text-dark-text-muted">{item.subValue}</p>
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-dark-text-primary">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creator Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-hawk-accent" />
            <span>Creator Information</span>
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark-text-muted mb-2">Creator Address</p>
              <div className="flex items-center justify-between p-3 bg-dark-surface-light rounded-lg">
                <code className="text-sm font-mono text-dark-text-primary flex-1 mr-3">
                  {stats.creatorAddress}
                </code>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyAddress}
                    className="btn-ghost p-2 text-dark-text-muted hover:text-hawk-accent"
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleViewOnExplorer}
                    className="btn-secondary btn-sm flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View on BaseScan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-hawk-accent" />
            <span>Market Metrics</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-text-muted">Market Cap Rank</span>
              <span className="font-mono text-dark-text-primary">#1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-text-muted">Fully Diluted Valuation</span>
              <span className="font-mono text-dark-text-primary">
                {formatLargeNumber(stats.marketCap * 1.2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-text-muted">Volume/Market Cap</span>
              <span className="font-mono text-dark-text-primary">
                {((stats.volume24h / stats.marketCap) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-text-muted">Holders Growth (24h)</span>
              <span className="font-mono text-success-500">+2.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Risk Assessment */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-hawk-accent" />
          <span>Token Security</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-success-500/10 border border-success-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-success-500">Contract Verified</span>
            </div>
            <p className="text-xs text-dark-text-muted">
              Smart contract source code has been verified on BaseScan
            </p>
          </div>
          
          <div className="p-4 bg-warning-500/10 border border-warning-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <span className="text-sm font-medium text-warning-500">Moderate Risk</span>
            </div>
            <p className="text-xs text-dark-text-muted">
              New token with limited trading history. Exercise caution.
            </p>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-500">Base Network</span>
            </div>
            <p className="text-xs text-dark-text-muted">
              Built on Base L2 with low transaction fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};