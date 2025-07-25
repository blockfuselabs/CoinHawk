import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, ExternalLink } from 'lucide-react';
import blockies from 'blockies';

interface CoinCardProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    image: string;
    address: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    holders: number;
  };
  onViewDetails: (coinId: string) => void;
  onToggleWatchlist: (coinId: string) => void;
  isWatchlisted: boolean;
}

export const CoinCard: React.FC<CoinCardProps> = ({ 
  coin, 
  onViewDetails, 
  onToggleWatchlist, 
  isWatchlisted 
}) => {
  const [imageError, setImageError] = useState(false);
  const [blockieDataUrl, setBlockieDataUrl] = useState<string>('');

  const isPositive = coin.change24h >= 0;

  // Generate Blockies avatar based on contract address
  useEffect(() => {
    if (coin.address) {
      try {
        const canvas = blockies({
          seed: coin.address.toLowerCase(),
          size: 12, // Number of blocks per side
          scale: 4, // Pixel size of each block
          color: '#fbbf24', // Primary color (hawk accent)
          bgcolor: '#1e293b', // Background color (dark surface)
          spotcolor: '#10b981' // Spot color (success green)
        });
        setBlockieDataUrl(canvas.toDataURL());
      } catch (error) {
        console.error('Error generating blockies:', error);
      }
    }
  }, [coin.address]);
  
  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card card-hover fade-in group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {!imageError && coin.image ? (
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-12 h-12 rounded-full bg-dark-surface-light ring-2 ring-dark-border"
                onError={handleImageError}
              />
            ) : (
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-dark-border bg-dark-surface-light">
                {blockieDataUrl ? (
                  <img
                    src={blockieDataUrl}
                    alt={`${coin.name} Blockies Avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-hawk-accent/20 to-hawk-accent/5 flex items-center justify-center">
                    <span className="text-hawk-accent font-bold text-lg">
                      {coin.symbol.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-dark-surface shadow-lg">
              <div className="w-full h-full bg-success-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-dark-text-primary group-hover:text-hawk-accent transition-colors">
              {coin.name}
            </h3>
            <p className="text-sm text-dark-text-muted font-mono">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(coin.id);
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isWatchlisted 
              ? 'text-hawk-accent bg-hawk-accent/10 shadow-glow' 
              : 'text-dark-text-muted hover:text-hawk-accent hover:bg-hawk-accent/5'
          }`}
        >
          <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Price & Change */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold font-mono text-dark-text-primary">
            {formatPrice(coin.price)}
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
            isPositive ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-dark-text-muted">Volume 24h</p>
            <p className="font-semibold font-mono text-dark-text-primary">
              {formatVolume(coin.volume24h)}
            </p>
          </div>
          <div>
            <p className="text-dark-text-muted">Holders</p>
            <p className="font-semibold font-mono text-dark-text-primary">
              {coin.holders.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="pt-2 border-t border-dark-border">
          <p className="text-xs text-dark-text-muted mb-1">Contract Address</p>
          <div className="flex items-center justify-between">
            <code className="text-xs bg-dark-surface-light px-2 py-1 rounded font-mono text-dark-text-secondary">
              {coin.address.slice(0, 8)}...{coin.address.slice(-6)}
            </code>
            <button 
              className="text-dark-text-muted hover:text-hawk-accent transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Copy address to clipboard
                navigator.clipboard.writeText(coin.address);
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(coin.id)}
          className="btn-primary w-full mt-4"
        >
          View Details
        </button>
      </div>
    </div>
  );
};