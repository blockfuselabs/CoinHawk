import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CoinHeader } from '../components/CoinDetail/CoinHeader';
import { KeyStats } from '../components/CoinDetail/KeyStats';
import { TabNavigation } from '../components/CoinDetail/TabNavigation';
import { PriceChart } from '../components/CoinDetail/PriceChart';
import { PerformanceMetrics } from '../components/CoinDetail/PerformanceMetrics';
import { CoinStats } from '../components/CoinDetail/CoinStats';
import { CoinInfo } from '../components/CoinDetail/CoinInfo';
import { AIAnalysis } from '../components/CoinDetail/AIAnalysis';
import { AboutCoin } from '../components/CoinDetail/AboutCoin';
import { coinsService } from '../services/coinService';
import { ApiError } from '../config/client';

interface CoinDetailData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  address: string;
  description: string;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  totalSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  uniqueHolders: number;
  creatorAddress: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  rank: number;
  createdAt: string;
  isFromBaseApp: boolean;
  chainId: number;
  chartData: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
}

interface CoinDetailProps {
  coinId: string;
  coinImage?: string;
  coinData?: any; // Add this to accept the coin data from Dashboard
  onBack: () => void;
}

export const CoinDetail: React.FC<CoinDetailProps> = ({ coinId, coinImage, coinData, onBack }) => {
  const [coin, setCoin] = useState<CoinDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartPeriod, setChartPeriod] = useState('24h');

  // Generate mock chart data based on current price
  const generateChartData = (currentPrice: number, change24h: number) => {
    const points = 24; // 24 hours of data
    const data = [];
    const startPrice = currentPrice / (1 + change24h / 100);
    
    for (let i = 0; i < points; i++) {
      const timestamp = Date.now() - (points - i) * 60 * 60 * 1000; // Hour intervals
      const priceVariation = Math.sin(i / 3) * 0.02 + Math.random() * 0.01 - 0.005;
      const progress = i / (points - 1);
      const price = startPrice + (currentPrice - startPrice) * progress + startPrice * priceVariation;
      const volume = Math.random() * 50000 + 10000;
      
      data.push({
        timestamp,
        price: Math.max(price, 0),
        volume
      });
    }
    
    return data;
  };

  // Transform API coin data to CoinDetailData
  const transformToCoinDetail = (apiCoin: any): CoinDetailData => {
    const chartData = generateChartData(apiCoin.price, apiCoin.change24h);
    
    return {
      id: apiCoin.id,
      name: apiCoin.name,
      symbol: apiCoin.symbol,
      image: apiCoin.image,
      address: apiCoin.address,
      description: apiCoin.description || `${apiCoin.name} is a cryptocurrency token on the Base network.`,
      price: apiCoin.price,
      change24h: apiCoin.change24h,
      change7d: apiCoin.change24h * 0.7, // Estimate 7d change
      volume24h: apiCoin.volume24h,
      marketCap: apiCoin.marketCap,
      totalSupply: apiCoin.totalSupply,
      circulatingSupply: apiCoin.totalSupply * 0.8, // Estimate circulating supply
      maxSupply: apiCoin.totalSupply,
      uniqueHolders: apiCoin.holders,
      creatorAddress: apiCoin.creatorAddress || '',
      website: `https://${apiCoin.symbol.toLowerCase()}.com`,
      twitter: `https://twitter.com/${apiCoin.symbol.toLowerCase()}`,
      telegram: `https://t.me/${apiCoin.symbol.toLowerCase()}`,
      rank: apiCoin.rank,
      createdAt: apiCoin.createdAt,
      isFromBaseApp: apiCoin.isFromBaseApp || false,
      chainId: apiCoin.chainId || 8453,
      chartData
    };
  };

  // Fetch coin data from API
  useEffect(() => {
    const fetchCoinData = async () => {
      console.log('🔄 CoinDetail useEffect triggered');
      console.log('🔄 coinId:', coinId);
      console.log('🔄 coinData:', coinData);
      console.log('🔄 coinImage:', coinImage);
      
      try {
        setLoading(true);
        setError(null);
        
        // If we already have coin data from Dashboard, use it immediately
        if (coinData) {
          console.log('✅ Using coin data from Dashboard - transforming...');
          const detailData = transformToCoinDetail(coinData);
          console.log('✅ Transformed coin data:', detailData);
          setCoin(detailData);
          setLoading(false);
          console.log('✅ Coin state set, loading set to false');
          return;
        }
        
        console.log('🔄 No coinData provided, fetching from API...');
        
        // Try to get specific coin by ID first
        let apiCoinData = await coinsService.getCoinById(coinId);
        console.log('📥 getCoinById response:', apiCoinData);
        
        // If not found by ID, try to find in the coins list
        if (!apiCoinData) {
          console.log('🔍 Coin not found by ID, searching in coins list...');
          const allCoins = await coinsService.getNewCoins({ limit: 100 });
          console.log('📥 All coins response:', allCoins);
          console.log('🔍 Searching for coinId:', coinId);
          
          const foundCoin = allCoins.find(coin => {
            console.log('🔍 Comparing:', {
              coinId,
              'coin.id': coin.id,
              'coin.symbol': coin.symbol,
              'coin.address': coin.address,
              'coin.name': coin.name
            });
            return coin.id === coinId || 
                   coin.symbol === coinId || 
                   coin.address === coinId ||
                   coin.name.toLowerCase() === coinId.toLowerCase();
          });
          
          console.log('🔍 Found coin:', foundCoin);
          apiCoinData = foundCoin || null;
        }
        
        if (apiCoinData) {
          const detailData = transformToCoinDetail(apiCoinData);
          setCoin(detailData);
          console.log('✅ Coin detail loaded:', detailData.name);
        } else {
          throw new Error('Coin not found');
        }
        
      } catch (error) {
        console.error('❌ Error fetching coin detail:', error);
        let errorMessage = 'Failed to load coin details';
        
        if (error instanceof ApiError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        
      } finally {
        setLoading(false);
      }
    };

    // Run the fetch function
    fetchCoinData();
  }, [coinId, coinData]); // Removed coinImage from dependencies as it's not critical

  // Debug: Log component state during render
  console.log('🎨 CoinDetail render state:', { loading, error, coin: coin?.name || 'null', coinDataProvided: !!coinData });

  // Handle watchlist toggle
  const handleToggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    
    // Save to localStorage
    const watchlist = JSON.parse(localStorage.getItem('coinWatchlist') || '[]');
    if (isWatchlisted) {
      const updated = watchlist.filter((id: string) => id !== coinId);
      localStorage.setItem('coinWatchlist', JSON.stringify(updated));
    } else {
      watchlist.push(coinId);
      localStorage.setItem('coinWatchlist', JSON.stringify(watchlist));
    }
  };

  // Load watchlist status
  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('coinWatchlist') || '[]');
    setIsWatchlisted(watchlist.includes(coinId));
  }, [coinId]);

  const formatPrice = (price: number) => {
    if (price < 0.000001) return `${price.toFixed(8)}`;
    if (price < 0.01) return `${price.toFixed(6)}`;
    if (price < 1) return `${price.toFixed(4)}`;
    return `${price.toFixed(2)}`;
  };

  const handleRefresh = async () => {
    const fetchCoinData = async () => {
      try {
        setError(null);
        const coinData = await coinsService.getCoinById(coinId);
        
        if (coinData) {
          const detailData = transformToCoinDetail(coinData);
          setCoin(detailData);
        }
      } catch (error) {
        console.error('Error refreshing coin data:', error);
        let errorMessage = 'Failed to refresh coin details';
        
        if (error instanceof ApiError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      }
    };

    fetchCoinData();
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-8 p-4 md:p-0">
        <div className="skeleton h-6 md:h-8 w-64 md:w-96"></div>
        <div className="skeleton h-32 md:h-64 w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="skeleton h-64 md:h-96 w-full"></div>
          </div>
          <div className="space-y-4 md:space-y-6">
            <div className="skeleton h-32 md:h-48 w-full"></div>
            <div className="skeleton h-24 md:h-32 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
            {error || 'Coin not found'}
          </h2>
          <p className="text-dark-text-muted">
            {error ? 'Unable to load coin details. Please try again.' : 'The requested coin could not be found.'}
          </p>
        </div>
        <div className="space-x-4">
          <button 
            onClick={onBack}
            className="btn-secondary"
          >
            ← Back to Dashboard
          </button>
          {error && (
            <button 
              onClick={handleRefresh}
              className="btn-primary"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8 p-4 md:p-0">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm">
        <button 
          onClick={onBack}
          className="text-hawk-accent hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4 md:hidden" />
          <span>Based Coins</span>
        </button>
        <span className="text-dark-text-muted">›</span>
        <span className="text-dark-text-primary truncate">{coin.name} Price</span>
      </nav>

      {/* Coin Header */}
      <CoinHeader
        coin={coin}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
        formatPrice={formatPrice}
      />

      {/* Key Stats */}
      <KeyStats coin={coin} />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <PriceChart
            coin={coin}
            chartPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
            formatPrice={formatPrice}
          />

          {/* Performance Metrics */}
          <PerformanceMetrics coin={coin} />
        </div>

        {/* Right Column - Stats & Info */}
        <div className="space-y-4 md:space-y-6">
          <CoinStats coin={coin} />
          <CoinInfo coin={coin} />
          <AIAnalysis 
            coinName={coin.name} 
            coinAddress={coin.address}
            coin={{
              symbol: coin.symbol,
              price: coin.price,
              change24h: coin.change24h,
              marketCap: coin.marketCap,
              volume24h: coin.volume24h,
              holders: coin.uniqueHolders,
              isFromBaseApp: coin.isFromBaseApp
            }}
          />
          <AboutCoin coin={coin} />
        </div>
      </div>
    </div>
  );
};