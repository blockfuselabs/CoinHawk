import React, { useState, useEffect } from 'react';
import { CoinAvatar } from '../components/common/CoinAvatar';
import { TrendingUp, Flame, Award, Eye, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { useCoins, useTrendingCoins, useTopGainers } from '../hooks/useCoinData';
import { Coin } from '../services/coinService';

interface DashboardProps {
  onViewCoinDetail: (coinData: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewCoinDetail }) => {
  // Main coins data
  const {
    coins,
    loading,
    error,
    marketStats,
    hasMore,
    fetchCoins,
    refreshData,
    loadMore,
    clearError
  } = useCoins({
    autoFetch: true,
    initialParams: { limit: 20, sortBy: 'marketCap', sortOrder: 'desc' },
    refreshInterval: 60000 // Refresh every minute
  });

  // Trending coins
  const {
    coins: trendingCoins,
    loading: trendingLoading,
    fetchTrendingCoins
  } = useTrendingCoins();

  // Top gainers
  const {
    coins: topGainers,
    loading: gainersLoading,
    fetchTopGainers
  } = useTopGainers();

  // Local state
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [highlightsEnabled, setHighlightsEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load trending and gainers data on mount
  useEffect(() => {
    fetchTrendingCoins(5);
    fetchTopGainers(5);
  }, [fetchTrendingCoins, fetchTopGainers]);

const handleViewDetails = (coinId: string) => {
  // First, try to find the coin in the main coins array
  let coin = coins.find(c => c.id === coinId);
  
  // If not found, try trending coins
  if (!coin) {
    coin = trendingCoins.find(c => c.id === coinId);
  }
  
  // If still not found, try top gainers
  if (!coin) {
    coin = topGainers.find(c => c.id === coinId);
  }
  
  // If we found the coin, pass it to the detail view
  if (coin) {
    console.log('📤 Passing coin to detail view:', coin);
    onViewCoinDetail({
      coinId: coin.id,
      coinImage: coin.image,
      coinData: coin,
    });
  } else {
    console.error('❌ Coin not found in any array:', coinId);
    // Still try to pass just the coinId, let the detail component handle it
    onViewCoinDetail({
      coinId: coinId,
      coinImage: undefined,
      coinData: undefined,
    });
  }
};

  const handleToggleWatchlist = (coinId: string) => {
    setWatchlist(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshData(),
        fetchTrendingCoins(5),
        fetchTopGainers(5)
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy);
    await fetchCoins({ 
      sortBy: newSortBy as any, 
      sortOrder: 'desc',
      filterBy: filterBy === 'all' ? undefined : filterBy as any
    });
  };

  const handleFilterChange = async (newFilterBy: string) => {
    setFilterBy(newFilterBy);
    await fetchCoins({ 
      sortBy: sortBy as any, 
      sortOrder: 'desc',
      filterBy: newFilterBy === 'all' ? undefined : newFilterBy as any
    });
  };

  const filteredAndSortedCoins = coins.filter(coin => {
    if (filterBy === 'all') return true;
    if (filterBy === 'gainers') return coin.change24h > 0;
    if (filterBy === 'losers') return coin.change24h < 0;
    if (filterBy === 'new') {
      const createdDate = new Date(coin.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdDate > weekAgo;
    }
    return true;
  });

  const totalMarketCap = marketStats?.totalMarketCap || coins.reduce((sum, coin) => sum + coin.marketCap, 0);
  const totalVolume = marketStats?.totalVolume || coins.reduce((sum, coin) => sum + coin.volume24h, 0);
  const gainersCount = coins.filter(coin => coin.change24h > 0).length;
  const marketChange = marketStats?.change24h || (gainersCount / coins.length > 0.5 ? 4.1 : -2.3);

  // Featured coins
  const featuredTrending = trendingCoins[0];
  const featuredGainer = topGainers[0];

  // Error display
  if (error && !coins.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-danger" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-2">
            Unable to load coin data
          </h3>
          <p className="text-dark-text-muted mb-4">{error}</p>
          <button 
            onClick={() => {
              clearError();
              refreshData();
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !coins.length) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="skeleton h-8 w-full max-w-md"></div>
        <div className="skeleton h-20 md:h-24 w-full"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton h-16 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-dark-text-primary mb-2">
            Coined Post by Market Cap
          </h1>
          <div className="flex flex-wrap items-center space-x-1 md:space-x-2 text-sm md:text-base text-dark-text-secondary">
            <span>
              The global coined post market cap today is ${(totalMarketCap / 1e12).toFixed(2)} Trillion, a
            </span>
            <span className={`font-semibold ${marketChange > 0 ? 'text-success' : 'text-danger'}`}>
              {marketChange > 0 ? '▲' : '▼'} {Math.abs(marketChange).toFixed(1)}%
            </span>
            <span>change in the last 24 hours.</span>
            <button className="text-hawk-accent hover:underline">Read more</button>
          </div>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-dark-surface-light rounded-lg hover:bg-dark-surface transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && coins.length > 0 && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-danger" />
            <span className="text-sm text-danger">{error}</span>
          </div>
          <button onClick={clearError} className="text-danger hover:text-danger/80">
            ×
          </button>
        </div>
      )}

      {/* Market Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="card">
          <div className="text-2xl md:text-3xl font-bold text-dark-text-primary mb-2">
            ${(totalMarketCap / 1e9).toFixed(1)}B
          </div>
          <div className="text-sm text-dark-text-muted">
            Market Cap <span className={`${marketChange > 0 ? 'text-success' : 'text-danger'}`}>
              {marketChange > 0 ? '▲' : '▼'} {Math.abs(marketChange).toFixed(1)}%
            </span>
          </div>
          <div className="mt-4 h-12 md:h-16 bg-gradient-to-r from-success/20 to-success/5 rounded-lg flex items-end">
            <div className="w-full h-6 md:h-8 bg-success/40 rounded-lg"></div>
          </div>
        </div>

        <div className="card">
          <div className="text-2xl md:text-3xl font-bold text-dark-text-primary mb-2">
            ${(totalVolume / 1e9).toFixed(1)}B
          </div>
          <div className="text-sm text-dark-text-muted">
            24h Trading Volume
          </div>
          <div className="mt-4 h-12 md:h-16 bg-gradient-to-r from-danger/20 to-danger/5 rounded-lg flex items-end">
            <div className="w-3/4 h-4 md:h-6 bg-danger/40 rounded-lg"></div>
          </div>
        </div>
      </div> */}

      {/* Featured Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Trending Featured Card */}
        <div className="space-y-4">
          {/* Trending Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-hawk-accent" />
              <h2 className="text-xl md:text-2xl font-bold text-dark-text-primary">Trending</h2>
              {trendingLoading && <div className="w-4 h-4 animate-spin border-2 border-hawk-accent border-t-transparent rounded-full" />}
            </div>
            <button className="text-hawk-accent text-sm hover:underline">View more →</button>
          </div>

          {/* #1 Trending Featured Card */}
          {featuredTrending && (
            <div 
              className="card hover:bg-dark-surface-light/50 transition-all duration-300 cursor-pointer border-l-4 border-hawk-accent"
              onClick={() => handleViewDetails(featuredTrending.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-hawk-accent/20 text-hawk-accent text-sm font-bold px-2 py-1 rounded">
                    #1
                  </div>
                  <CoinAvatar 
                    symbol={featuredTrending.symbol} 
                    name={featuredTrending.name} 
                    image={featuredTrending.image}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark-text-primary">
                      {featuredTrending.name}
                    </h3>
                    <p className="text-sm text-dark-text-muted uppercase">
                      {featuredTrending.symbol}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWatchlist(featuredTrending.id);
                  }}
                  className="text-dark-text-muted hover:text-hawk-accent p-2 rounded-lg hover:bg-dark-surface-light"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-dark-text-muted mb-1">Price</p>
                  <p className="text-xl md:text-2xl font-bold font-mono text-dark-text-primary">
                    ${featuredTrending.price > 0 ? featuredTrending.price.toFixed(6) : '0.000000'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark-text-muted mb-1">24h Change</p>
                  <p className={`text-xl md:text-2xl font-bold ${
                    featuredTrending.change24h >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {featuredTrending.change24h >= 0 ? '▲' : '▼'} {Math.abs(featuredTrending.change24h).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-dark-text-muted">Market Cap</p>
                  <p className="font-mono text-dark-text-primary">
                    ${featuredTrending.marketCap > 1e6 ? (featuredTrending.marketCap / 1e6).toFixed(1) + 'M' : featuredTrending.marketCap.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-dark-text-muted">Holders</p>
                  <p className="font-mono text-dark-text-primary">
                    {featuredTrending.holders.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trending List (2-5) */}
          <div className="space-y-2">
            {trendingCoins.slice(1, 5).map((coin, idx) => (
              <div 
                key={coin.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-surface-light transition-colors cursor-pointer"
                onClick={() => handleViewDetails(coin.id)}
              >
                <span className="text-dark-text-muted w-6 text-sm font-medium">#{idx + 2}</span>
                <CoinAvatar 
                  symbol={coin.symbol} 
                  name={coin.name} 
                  image={coin.image}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="font-medium text-dark-text-primary text-sm">{coin.name}</div>
                  <div className="text-xs text-dark-text-muted uppercase">{coin.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-dark-text-primary text-sm font-mono">
                    ${coin.price > 0 ? coin.price.toFixed(6) : '0.000000'}
                  </div>
                  <div className={`text-xs ${coin.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
                    {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers Featured Card */}
        <div className="space-y-4">
          {/* Top Gainers Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-success" />
              <h2 className="text-xl md:text-2xl font-bold text-dark-text-primary">Top Gainers</h2>
              {gainersLoading && <div className="w-4 h-4 animate-spin border-2 border-success border-t-transparent rounded-full" />}
            </div>
            <button className="text-hawk-accent text-sm hover:underline">View more →</button>
          </div>

          {/* #1 Top Gainer Featured Card */}
          {featuredGainer && (
            <div 
              className="card hover:bg-dark-surface-light/50 transition-all duration-300 cursor-pointer border-l-4 border-success"
              onClick={() => handleViewDetails(featuredGainer.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-success/20 text-success text-sm font-bold px-2 py-1 rounded">
                    #1
                  </div>
                  <CoinAvatar 
                    symbol={featuredGainer.symbol} 
                    name={featuredGainer.name} 
                    image={featuredGainer.image}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark-text-primary">
                      {featuredGainer.name}
                    </h3>
                    <p className="text-sm text-dark-text-muted uppercase">
                      {featuredGainer.symbol}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWatchlist(featuredGainer.id);
                  }}
                  className="text-dark-text-muted hover:text-success p-2 rounded-lg hover:bg-dark-surface-light"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-dark-text-muted mb-1">Price</p>
                  <p className="text-xl md:text-2xl font-bold font-mono text-dark-text-primary">
                    ${featuredGainer.price > 0 ? featuredGainer.price.toFixed(6) : '0.000000'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark-text-muted mb-1">24h Change</p>
                  <p className="text-xl md:text-2xl font-bold text-success">
                    ▲ {featuredGainer.change24h.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-dark-text-muted">Market Cap</p>
                  <p className="font-mono text-dark-text-primary">
                    ${featuredGainer.marketCap > 1e6 ? (featuredGainer.marketCap / 1e6).toFixed(1) + 'M' : featuredGainer.marketCap.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-dark-text-muted">Holders</p>
                  <p className="font-mono text-dark-text-primary">
                    {featuredGainer.holders.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Gainers List (2-5) */}
          <div className="space-y-2">
            {topGainers.slice(1, 5).map((coin, idx) => (
              <div 
                key={coin.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-surface-light transition-colors cursor-pointer"
                onClick={() => handleViewDetails(coin.id)}
              >
                <span className="text-dark-text-muted w-6 text-sm font-medium">#{idx + 2}</span>
                <CoinAvatar 
                  symbol={coin.symbol} 
                  name={coin.name} 
                  image={coin.image}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="font-medium text-dark-text-primary text-sm">{coin.name}</div>
                  <div className="text-xs text-dark-text-muted uppercase">{coin.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-dark-text-primary text-sm font-mono">
                    ${coin.price > 0 ? coin.price.toFixed(6) : '0.000000'}
                  </div>
                  <div className="text-success text-xs">
                    ▲ {coin.change24h.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Highlights Toggle */}
          <button
            onClick={() => setHighlightsEnabled(!highlightsEnabled)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              highlightsEnabled 
                ? 'bg-hawk-accent text-hawk-primary' 
                : 'bg-dark-surface-light text-dark-text-secondary'
            }`}
          >
            <span className="text-sm font-medium">Highlights</span>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
              highlightsEnabled ? 'border-hawk-primary bg-hawk-primary' : 'border-dark-border'
            }`}>
              {highlightsEnabled && <span className="text-hawk-accent text-xs">✓</span>}
            </div>
          </button>

          {/* Filter Tabs */}
          <div className="flex bg-dark-surface-light rounded-lg p-1">
            {[
              { id: 'all', label: 'All', icon: Star },
              { id: 'gainers', label: 'Gainers', icon: TrendingUp },
              { id: 'new', label: 'New', icon: Flame },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id)}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-3 py-2 text-xs md:text-sm rounded transition-all disabled:opacity-50 ${
                    filterBy === tab.id
                      ? 'bg-dark-surface text-dark-text-primary'
                      : 'text-dark-text-muted hover:text-dark-text-primary'
                  }`}
                >
                  <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 bg-dark-surface-light text-dark-text-primary border border-dark-border rounded-lg text-sm disabled:opacity-50"
          >
            <option value="marketCap">Market Cap</option>
            <option value="volume">Volume</option>
            <option value="price">Price</option>
            <option value="change">24h Change</option>
            <option value="holders">Holders</option>
          </select>
        </div>

        <div className="text-xs md:text-sm text-dark-text-muted text-center md:text-right">
          Showing {filteredAndSortedCoins.length} of {coins.length} coins
          {loading && <span className="ml-2">• Loading...</span>}
        </div>
      </div>

      {/* Coins Table - Mobile Responsive */}
      <div className="card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-4 px-4 text-dark-text-muted font-medium">#</th>
                <th className="text-left py-4 px-4 text-dark-text-muted font-medium">Coin</th>
                <th className="text-right py-4 px-4 text-dark-text-muted font-medium">Price</th>
                <th className="text-right py-4 px-4 text-dark-text-muted font-medium">24h</th>
                <th className="text-right py-4 px-4 text-dark-text-muted font-medium">Market Cap</th>
                <th className="text-right py-4 px-4 text-dark-text-muted font-medium">Holders</th>
                <th className="text-right py-4 px-4 text-dark-text-muted font-medium">Created</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCoins.map((coin) => (
                <tr 
                  key={coin.id} 
                  className="border-b border-dark-border/30 hover:bg-dark-surface-light/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(coin.id)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWatchlist(coin.id);
                        }}
                        className={`text-dark-text-muted hover:text-hawk-accent ${
                          watchlist.includes(coin.id) ? 'text-hawk-accent' : ''
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <span className="text-dark-text-muted">{coin.rank}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <CoinAvatar 
                        symbol={coin.symbol} 
                        name={coin.name} 
                        image={coin.image}
                        size="md"
                      />
                      <div>
                        <div className="font-medium text-dark-text-primary">{coin.name}</div>
                        <div className="text-sm text-dark-text-muted uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-mono text-dark-text-primary">
                      ${coin.price > 0 ? coin.price.toFixed(6) : '0.000000'}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={coin.change24h >= 0 ? 'text-success' : 'text-danger'}>
                      {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-mono text-dark-text-primary">
                      ${coin.marketCap > 1e6 ? (coin.marketCap / 1e6).toFixed(1) + 'M' : coin.marketCap.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-mono text-dark-text-primary">
                      {coin.holders.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-sm text-dark-text-muted">
                      {new Date(coin.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">View</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredAndSortedCoins.map((coin) => (
            <div 
              key={coin.id}
              className="p-4 border-b border-dark-border/30 last:border-b-0 cursor-pointer hover:bg-dark-surface-light/30 transition-colors"
              onClick={() => handleViewDetails(coin.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-dark-text-muted">#{coin.rank}</span>
                  <CoinAvatar 
                    symbol={coin.symbol} 
                    name={coin.name} 
                    image={coin.image}
                    size="md"
                  />
                  <div>
                    <div className="font-medium text-dark-text-primary">{coin.name}</div>
                    <div className="text-xs text-dark-text-muted uppercase">{coin.symbol}</div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWatchlist(coin.id);
                  }}
                  className={`text-dark-text-muted hover:text-hawk-accent p-1 ${
                    watchlist.includes(coin.id) ? 'text-hawk-accent' : ''
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-lg font-bold text-dark-text-primary">
                  ${coin.price > 0 ? coin.price.toFixed(6) : '0.000000'}
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                  coin.change24h >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(1)}%
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-dark-text-muted">Market Cap</span>
                  <div className="font-mono text-dark-text-primary">
                    ${coin.marketCap > 1e6 ? (coin.marketCap / 1e6).toFixed(1) + 'M' : coin.marketCap.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-dark-text-muted">Holders</span>
                  <div className="font-mono text-dark-text-primary">
                    {coin.holders.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center py-4 md:py-6 border-t border-dark-border">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="btn-secondary disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Coins'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};