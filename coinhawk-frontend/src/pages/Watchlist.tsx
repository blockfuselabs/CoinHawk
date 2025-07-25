// src/pages/Watchlist.tsx
import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Eye, AlertCircle } from 'lucide-react';
import { CoinCard } from '../components/coin/CoinCard';

interface WatchlistCoin {
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
  addedAt: string;
  alerts?: {
    priceAbove?: number;
    priceBelow?: number;
    volumeChange?: number;
  };
}

// Add props interface
interface WatchlistProps {
  onViewCoinDetail: (coinData: any) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({ onViewCoinDetail }) => {
  const [watchlistCoins, setWatchlistCoins] = useState<WatchlistCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'added' | 'price' | 'change' | 'volume'>('added');
  const [filterBy, setFilterBy] = useState<'all' | 'gainers' | 'losers'>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockWatchlist: WatchlistCoin[] = [
      {
        id: '1',
        name: 'BaseGold',
        symbol: 'BGLD',
        image: '/api/placeholder/48/48',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        price: 0.1234,
        change24h: 12.45,
        volume24h: 1250000,
        marketCap: 15000000,
        holders: 8934,
        addedAt: '2024-01-20',
        alerts: {
          priceAbove: 0.15,
          priceBelow: 0.10,
        },
      },
      {
        id: '2',
        name: 'BaseMeme',
        symbol: 'BMEME',
        image: '/api/placeholder/48/48',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        price: 0.0067,
        change24h: -5.23,
        volume24h: 890000,
        marketCap: 6700000,
        holders: 12045,
        addedAt: '2024-01-18',
        alerts: {
          volumeChange: 50,
        },
      },
    ];

    setTimeout(() => {
      setWatchlistCoins(mockWatchlist);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFromWatchlist = (coinId: string) => {
    setWatchlistCoins(prev => prev.filter(coin => coin.id !== coinId));
  };

  // Use the prop instead of console.log
  const handleViewDetails = (coinId: string) => {
    const coin = watchlistCoins.find(c => c.id === coinId);
    if (coin) {
      onViewCoinDetail(coin);
    }
  };

  const handleToggleWatchlist = (coinId: string) => {
    handleRemoveFromWatchlist(coinId);
  };

  const filteredAndSortedCoins = watchlistCoins
    .filter(coin => {
      if (filterBy === 'all') return true;
      if (filterBy === 'gainers') return coin.change24h > 0;
      if (filterBy === 'losers') return coin.change24h < 0;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'added':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.change24h - a.change24h;
        case 'volume':
          return b.volume24h - a.volume24h;
        default:
          return 0;
      }
    });

  const gainersCount = watchlistCoins.filter(coin => coin.change24h > 0).length;
  const losersCount = watchlistCoins.filter(coin => coin.change24h < 0).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-20"></div>
            </div>
          ))}
        </div>
        
        <div className="coin-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Your Watchlist
          </h1>
          <p className="text-dark-text-secondary">
            Track your favorite coins and set up alerts
          </p>
        </div>

        <button className="btn-primary">
          <Eye className="w-4 h-4 mr-2" />
          Browse Coins
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <Star className="w-5 h-5 text-hawk-accent" />
            <div>
              <p className="text-sm text-dark-text-muted">Tracked Coins</p>
              <p className="text-2xl font-bold font-mono text-dark-text-primary">
                {watchlistCoins.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-5 h-5 text-success-500" />
            <div>
              <p className="text-sm text-dark-text-muted">Gainers</p>
              <p className="text-2xl font-bold font-mono text-success-500">
                {gainersCount}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingDown className="w-5 h-5 text-danger-500" />
            <div>
              <p className="text-sm text-dark-text-muted">Losers</p>
              <p className="text-2xl font-bold font-mono text-danger-500">
                {losersCount}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <AlertCircle className="w-5 h-5 text-warning-500" />
            <div>
              <p className="text-sm text-dark-text-muted">Active Alerts</p>
              <p className="text-2xl font-bold font-mono text-warning-500">
                {watchlistCoins.filter(coin => coin.alerts).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="input bg-dark-surface-light border-dark-border"
          >
            <option value="all">All Coins</option>
            <option value="gainers">Gainers Only</option>
            <option value="losers">Losers Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input bg-dark-surface-light border-dark-border"
          >
            <option value="added">Recently Added</option>
            <option value="price">Price</option>
            <option value="change">24h Change</option>
            <option value="volume">Volume</option>
          </select>
        </div>

        <div className="text-sm text-dark-text-muted">
          Showing {filteredAndSortedCoins.length} of {watchlistCoins.length} coins
        </div>
      </div>

      {/* Watchlist Content */}
      {filteredAndSortedCoins.length > 0 ? (
        <div className="coin-grid">
          {filteredAndSortedCoins.map((coin) => (
            <div key={coin.id} className="relative">
              <CoinCard
                coin={coin}
                onViewDetails={handleViewDetails}
                onToggleWatchlist={handleToggleWatchlist}
                isWatchlisted={true}
              />
              
              {/* Alerts Badge */}
              {coin.alerts && (
                <div className="absolute top-2 right-2">
                  <div className="badge-warning text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Alert
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Star className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-text-primary mb-2">
            {watchlistCoins.length === 0 ? 'Your watchlist is empty' : 'No coins match your filters'}
          </h3>
          <p className="text-dark-text-muted mb-6">
            {watchlistCoins.length === 0 
              ? 'Start tracking coins by adding them to your watchlist'
              : 'Try adjusting your filters to see more coins'
            }
          </p>
          <button className="btn-primary">
            <Eye className="w-4 h-4 mr-2" />
            Discover Coins
          </button>
        </div>
      )}
    </div>
  );
};