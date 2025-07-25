import { apiClient } from '../config/client';
import { API_ENDPOINTS, buildQueryParams, CoinsQueryParams } from '../config/endpoints';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}


export interface AISummaryResponse {
  success: boolean;
  summary?: string;
  error?: string;
}


export interface ZoraToken {
  __typename: string;
  id: string;
  name: string;
  description: string;
  address: string;
  symbol: string;
  totalSupply: string;
  totalVolume: string;
  volume24h: string;
  createdAt: string;
  creatorAddress: string;
  creatorEarnings: Array<{
    amount: {
      currencyAddress: string;
      amountRaw: string;
      amountDecimal: number;
    };
    amountUsd: string;
  }>;
  poolCurrencyToken: {
    address: string;
    name: string;
    decimals: number;
  };
  tokenPrice: {
    priceInUsdc: string | null;
    currencyAddress: string;
    priceInPoolToken: string;
  };
  marketCap: string;
  marketCapDelta24h: string;
  chainId: number;
  tokenUri: string;
  platformReferrerAddress: string;
  payoutRecipientAddress: string;
  creatorProfile: {
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string;
        medium: string;
        small: string;
      };
    } | null;
  };
  mediaContent: {
    mimeType: string;
    originalUri: string;
    previewImage: {
      small: string;
      medium: string;
      blurhash: string | null;
    };
  };
  uniqueHolders: number;
  uniswapV4PoolKey: {
    token0Address: string;
    token1Address: string;
    fee: number;
    tickSpacing: number;
    hookAddress: string;
  };
  details: ZoraToken; 
  isFromBaseApp: boolean;
}

export interface Coin {
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
  totalSupply: number;
  createdAt: string;
  rank: number;
  description?: string;
  creatorAddress?: string;
  chainId?: number;
  isFromBaseApp?: boolean;
}

export interface MarketStats {
  totalMarketCap: number;
  totalVolume: number;
  activeCoins: number;
  totalHolders: number;
  change24h: number;
}

const transformZoraTokenToCoin = (token: ZoraToken, index: number): Coin => {
  const price = token.tokenPrice.priceInUsdc 
    ? parseFloat(token.tokenPrice.priceInUsdc) 
    : 0;
  
  const marketCapValue = parseFloat(token.marketCap) || 0;
  const volume24hValue = parseFloat(token.volume24h) || 0;
  const totalSupplyValue = parseFloat(token.totalSupply) || 0;
  

  const change24h = parseFloat(token.marketCapDelta24h) || (Math.random() - 0.5) * 20;

  return {
    id: token.id,
    name: token.name,
    symbol: token.symbol,
    image: token.mediaContent?.previewImage?.medium || 
           token.mediaContent?.previewImage?.small || 
           token.creatorProfile?.avatar?.previewImage?.medium || '',
    address: token.address,
    price,
    change24h,
    volume24h: volume24hValue,
    marketCap: marketCapValue,
    holders: token.uniqueHolders,
    totalSupply: totalSupplyValue,
    createdAt: token.createdAt,
    rank: index + 1,
    description: token.description,
    creatorAddress: token.creatorAddress,
    chainId: token.chainId,
    isFromBaseApp: token.isFromBaseApp,
  };
};

class CoinsService {
  // Get new/latest coins
  async getNewCoins(params: CoinsQueryParams = {}): Promise<Coin[]> {
    try {
      const queryString = buildQueryParams(params);
      console.log('🔄 Making API request to:', `${API_ENDPOINTS.COINS.NEW}${queryString}`);
      
      const response = await apiClient.get<ApiResponse<ZoraToken[]>>(`${API_ENDPOINTS.COINS.NEW}${queryString}`);
      console.log('Raw API response:', response);
      
      const tokens = response.success !== undefined ? response.data : (response as any);
      
      if (Array.isArray(tokens)) {
        const transformedCoins = tokens.map((token, index) => transformZoraTokenToCoin(token, index));
        console.log('Transformed coins:', transformedCoins.length);
        return transformedCoins;
      }
      
      throw new Error('Invalid response format: expected array of tokens');
    } catch (error) {
      console.error('Error fetching new coins:', error);
      throw error;
    }
  }

  // Get coin by ID
  async getCoinById(id: string): Promise<Coin | null> {
    try {
      const response = await apiClient.get<ApiResponse<ZoraToken>>(API_ENDPOINTS.COINS.BY_ID(id));
      
      const token = response.success !== undefined ? response.data : (response as any);
      
      if (token) {
        return transformZoraTokenToCoin(token, 0);
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching coin ${id}:`, error);
      throw error;
    }
  }

  // Get trending coins
  async getTrendingCoins(limit: number = 10): Promise<Coin[]> {
    try {
      const params: CoinsQueryParams = { limit, sortBy: 'volume', sortOrder: 'desc' };
      return await this.getNewCoins(params);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  }

  // Get top gainers
  async getTopGainers(limit: number = 10): Promise<Coin[]> {
    try {
      const coins = await this.getNewCoins({ limit: 50 }); 
      return coins
        .filter(coin => coin.change24h > 0)
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      throw error;
    }
  }

  // Get top losers
  async getTopLosers(limit: number = 10): Promise<Coin[]> {
    try {
      const coins = await this.getNewCoins({ limit: 50 }); 
      return coins
        .filter(coin => coin.change24h < 0)
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top losers:', error);
      throw error;
    }
  }

  // Search coins
  async searchCoins(query: string, limit: number = 20): Promise<Coin[]> {
    try {
      const params = { search: query, limit };
      return await this.getNewCoins(params);
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  }

  // Get market stats
  async getMarketStats(): Promise<MarketStats> {
    try {
      const coins = await this.getNewCoins({ limit: 100 });
      
      const totalMarketCap = coins.reduce((sum, coin) => sum + coin.marketCap, 0);
      const totalVolume = coins.reduce((sum, coin) => sum + coin.volume24h, 0);
      const totalHolders = coins.reduce((sum, coin) => sum + coin.holders, 0);
      const avgChange = coins.reduce((sum, coin) => sum + coin.change24h, 0) / coins.length;
      
      return {
        totalMarketCap,
        totalVolume,
        activeCoins: coins.length,
        totalHolders,
        change24h: avgChange,
      };
    } catch (error) {
      console.error('Error fetching market stats:', error);
      throw error;
    }
  }

  async getAISummary(coinAddress: string): Promise<string> {
  try {
    console.log('🤖 Fetching AI summary for:', coinAddress);
    
    const response = await apiClient.get<AISummaryResponse>(`/coins/summary?coinAddress=${coinAddress}`);

    const summaryResponse = response.success !== undefined ? response : (response as any);
    
    if (summaryResponse.success && summaryResponse.summary) {
      console.log('AI summary received');
      return summaryResponse.summary;
    }
    
    throw new Error(summaryResponse.error || 'Failed to get AI summary');
  } catch (error) {
    console.error('Error fetching AI summary:', error);
    throw error;
  }
}
}


export const coinsService = new CoinsService();


export { CoinsService };