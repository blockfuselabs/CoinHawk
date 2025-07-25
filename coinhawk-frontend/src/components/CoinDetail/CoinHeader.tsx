import React from 'react';
import { Star, Info } from 'lucide-react';
import { CoinAvatar } from '../common/CoinAvatar';

interface CoinHeaderProps {
  coin: {
    image: string;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    change24h: number;
  };
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  formatPrice: (price: number) => string;
}

export const CoinHeader: React.FC<CoinHeaderProps> = ({
  coin,
  isWatchlisted,
  onToggleWatchlist,
  formatPrice
}) => {
  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-start md:justify-between">
      <div className="flex items-center space-x-3 md:space-x-4">
        <CoinAvatar 
          symbol={coin.symbol} 
          name={coin.name} 
          image={coin.image}
          size="xl"
          className="ring-2 ring-dark-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-col space-x-2 md:space-x-2 mb-1 md:mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-dark-text-primary">
              {coin.name}
            </h1>
            {/* <span className="text-sm md:text-lg text-dark-text-muted font-mono uppercase flex-shrink-0">
              {coin.symbol}
            </span>
            <span className="text-xs md:text-sm text-dark-text-muted flex-shrink-0">
              #{coin.rank}
            </span> */}
          </div>
          
          <div className="space-y-2 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="text-2xl md:text-4xl font-bold font-mono text-dark-text-primary">
              ${formatPrice(coin.price)}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`font-semibold font-mono text-sm md:text-lg ${
                coin.change24h >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}% (24h)
              </span>
              <Info className="w-3 h-3 md:w-4 md:h-4 text-dark-text-muted" />
            </div>
          </div>

          {/* Price Range Bar */}
          <div className="mt-3 md:mt-4 flex items-center space-x-2 md:space-x-4">
            <span className="text-xs md:text-sm font-mono text-dark-text-muted">$0.1098</span>
            <div className="flex-1 h-1.5 md:h-2 bg-dark-surface-light rounded-full relative max-w-48 md:max-w-md">
              <div className="h-full bg-gradient-to-r from-danger via-warning to-success rounded-full"></div>
              <div 
                className="absolute top-0 w-1 h-1.5 md:h-2 bg-dark-text-primary rounded-full" 
                style={{ left: '70%' }}
              ></div>
            </div>
            <span className="text-xs md:text-sm font-mono text-dark-text-muted">$0.1267</span>
            <span className="text-xs text-dark-text-muted hidden sm:inline">24h Range</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-start">
        <button
          onClick={onToggleWatchlist}
          className={`btn-secondary flex items-center space-x-2 text-sm md:text-base ${
            isWatchlisted ? 'bg-hawk-accent/20 border-hawk-accent/30' : ''
          }`}
        >
          <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-current text-hawk-accent' : ''}`} />
          <span className="hidden sm:inline">
            {isWatchlisted ? 'Added to Portfolio' : 'Add to Portfolio'}
          </span>
          <span className="sm:hidden">
            {isWatchlisted ? 'Added' : 'Add'}
          </span>
          <span className="text-xs text-dark-text-muted hidden md:inline">• 2,109,640 added</span>
        </button>
      </div>
    </div>
  );
};