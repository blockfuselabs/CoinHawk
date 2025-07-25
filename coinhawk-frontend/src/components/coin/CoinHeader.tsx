import React from 'react';
import { Star, ExternalLink, Copy, Share2, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface CoinHeaderProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    image: string;
    address: string;
    price: number;
    change24h: number;
    marketCap: number;
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  onToggleWatchlist: (coinId: string) => void;
  onShare: () => void;
  onCopyAddress: () => void;
  isWatchlisted: boolean;
  copied: boolean;
}

export const CoinHeader: React.FC<CoinHeaderProps> = ({
  coin,
  onToggleWatchlist,
  onShare,
  onCopyAddress,
  isWatchlisted,
  copied,
}) => {
  const isPositive = coin.change24h >= 0;

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="card glow-effect">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
        {/* Main Info */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img 
              src={coin.image} 
              alt={coin.name}
              className="w-20 h-20 rounded-full bg-dark-surface-light shadow-lg ring-4 ring-hawk-accent/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `/api/placeholder/80/80`;
              }}
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success rounded-full border-4 border-dark-surface flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-dark-text-primary">
                {coin.name}
              </h1>
              <Badge variant="info">
                {coin.symbol.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Price */}
              <div className="text-2xl font-bold font-mono text-dark-text-primary">
                {formatPrice(coin.price)}
              </div>
              
              {/* Change */}
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-semibold font-mono">
                  {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
            
            {/* Market Cap */}
            <div className="text-sm text-dark-text-muted">
              Market Cap: <span className="font-mono text-dark-text-primary">
                ${(coin.marketCap / 1e6).toFixed(2)}M
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {coin.website && (
                <a
                  href={coin.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-text-muted hover:text-hawk-accent transition-colors"
                  title="Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {coin.twitter && (
                <a
                  href={coin.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-text-muted hover:text-hawk-accent transition-colors"
                  title="Twitter"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {coin.telegram && (
                <a
                  href={coin.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-text-muted hover:text-hawk-accent transition-colors"
                  title="Telegram"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => onToggleWatchlist(coin.id)}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              isWatchlisted ? 'bg-hawk-accent/20 border-hawk-accent/30 text-hawk-accent' : ''
            }`}
          >
            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
            <span>{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>
          
          <button onClick={onShare} className="btn-ghost p-3">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contract Address */}
      <div className="mt-6 pt-6 border-t border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <p className="text-sm text-dark-text-muted mb-2">Contract Address</p>
            <code className="text-sm bg-dark-surface-light px-4 py-2 rounded-lg font-mono text-dark-text-primary block sm:inline-block">
              {coin.address}
            </code>
          </div>
          <button
            onClick={onCopyAddress}
            className={`btn-ghost p-2 ${copied ? 'text-success' : ''}`}
            title="Copy address"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-success mt-2">Address copied to clipboard!</p>
        )}
      </div>
    </div>
  );
};
