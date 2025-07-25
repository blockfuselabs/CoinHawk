// src/types/api.ts

// Zora API response structures (updated to match your real API)
export interface ZoraTokenPrice {
  priceInUsdc: string | null;
  currencyAddress: string;
  priceInPoolToken: string;
}

export interface ZoraCreatorEarnings {
  amount: {
    currencyAddress: string;
    amountRaw: string;
    amountDecimal: number;
  };
  amountUsd: string;
}

export interface ZoraPoolCurrencyToken {
  address: string;
  name: string;
  decimals: number;
}

export interface ZoraCreatorProfile {
  id: string;
  handle: string;
  avatar: {
    previewImage: {
      blurhash: string;
      medium: string;
      small: string;
    };
  } | null;
}

export interface ZoraMediaContent {
  mimeType: string;
  originalUri: string;
  previewImage: {
    small: string;
    medium: string;
    blurhash: string | null;
  };
}

export interface ZoraUniswapV4PoolKey {
  token0Address: string;
  token1Address: string;
  fee: number;
  tickSpacing: number;
  hookAddress: string;
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
  creatorEarnings: ZoraCreatorEarnings[];
  poolCurrencyToken: ZoraPoolCurrencyToken;
  tokenPrice: ZoraTokenPrice;
  marketCap: string;
  marketCapDelta24h: string;
  chainId: number;
  tokenUri: string;
  platformReferrerAddress: string;
  payoutRecipientAddress: string;
  creatorProfile: ZoraCreatorProfile;
  mediaContent: ZoraMediaContent;
  uniqueHolders: number;
  uniswapV4PoolKey: ZoraUniswapV4PoolKey;
  details?: ZoraToken;
  isFromBaseApp?: boolean;
}

// Normalized interfaces for your app
export interface ApiCoin {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  address: string;
  price: number;
  change24h: number;
  change7d?: number;
  volume24h: number;
  marketCap: number;
  totalSupply?: number;
  circulatingSupply?: number;
  maxSupply?: number;
  holders?: number;
  uniqueHolders?: number;
  createdAt: string;
  rank?: number;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  creatorAddress?: string;
  // Additional fields from Zora API
  creatorEarnings?: ZoraCreatorEarnings[];
  poolCurrencyToken?: ZoraPoolCurrencyToken;
  tokenPrice?: ZoraTokenPrice;
  marketCapDelta24h?: string;
  mediaContent?: ZoraMediaContent;
  totalVolume?: string;
  chainId?: number;
  tokenUri?: string;
  platformReferrerAddress?: string;
  payoutRecipientAddress?: string;
  creatorProfile?: ZoraCreatorProfile;
  uniswapV4PoolKey?: ZoraUniswapV4PoolKey;
  isFromBaseApp?: boolean;
}

export interface CoinSummary extends ApiCoin {}

export interface CoinDetail extends ApiCoin {
  description: string;
  chartData?: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
}

// API Response interfaces
export interface ZoraApiResponse<T> {
  success: boolean;
  data: T;
}

export interface TrendingCoinsResponse {
  coins: ApiCoin[];
  total: number;
}

export interface TopGainersResponse {
  coins: ApiCoin[];
  total: number;
}

export interface NewCoinsResponse {
  coins: ApiCoin[];
  total: number;
}

export interface MostValuableResponse {
  coins: ApiCoin[];
  total: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Query parameters
export interface CoinsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'marketCap' | 'volume' | 'price' | 'change' | 'holders';
  order?: 'asc' | 'desc';
}

// Utility function to safely parse numeric strings
const safeParseFloat = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? 0 : parsed;
};

// Utility function to calculate 24h change percentage
const calculate24hChange = (marketCap: string, marketCapDelta24h: string): number => {
  const currentMarketCap = safeParseFloat(marketCap);
  const delta = safeParseFloat(marketCapDelta24h);
  
  if (currentMarketCap === 0) return 0;
  
  const previousMarketCap = currentMarketCap - delta;
  if (previousMarketCap === 0) return 0;
  
  return (delta / previousMarketCap) * 100;
};

// Utility function to convert Zora token to ApiCoin
export function convertZoraTokenToApiCoin(zoraToken: ZoraToken): ApiCoin {
  const price = safeParseFloat(zoraToken.tokenPrice?.priceInUsdc);
  const marketCap = safeParseFloat(zoraToken.marketCap);
  const volume24h = safeParseFloat(zoraToken.volume24h);
  const totalSupply = safeParseFloat(zoraToken.totalSupply);
  const change24h = calculate24hChange(zoraToken.marketCap, zoraToken.marketCapDelta24h);

  return {
    id: zoraToken.id,
    name: zoraToken.name || 'Unknown Token',
    symbol: zoraToken.symbol || 'UNKNOWN',
    image: zoraToken.mediaContent?.previewImage?.medium || 
           zoraToken.mediaContent?.previewImage?.small || 
           undefined,
    address: zoraToken.address,
    price: price,
    change24h: change24h,
    change7d: 0, // Not provided by Zora API
    volume24h: volume24h,
    marketCap: marketCap,
    totalSupply: totalSupply,
    circulatingSupply: totalSupply, // Assuming all tokens are circulating
    maxSupply: totalSupply,
    uniqueHolders: zoraToken.uniqueHolders || 0,
    holders: zoraToken.uniqueHolders || 0,
    createdAt: zoraToken.createdAt,
    description: zoraToken.description || '',
    creatorAddress: zoraToken.creatorAddress,
    // Additional Zora-specific fields
    creatorEarnings: zoraToken.creatorEarnings,
    poolCurrencyToken: zoraToken.poolCurrencyToken,
    tokenPrice: zoraToken.tokenPrice,
    marketCapDelta24h: zoraToken.marketCapDelta24h,
    mediaContent: zoraToken.mediaContent,
    totalVolume: zoraToken.totalVolume,
    chainId: zoraToken.chainId,
    tokenUri: zoraToken.tokenUri,
    platformReferrerAddress: zoraToken.platformReferrerAddress,
    payoutRecipientAddress: zoraToken.payoutRecipientAddress,
    creatorProfile: zoraToken.creatorProfile,
    uniswapV4PoolKey: zoraToken.uniswapV4PoolKey,
    isFromBaseApp: zoraToken.isFromBaseApp,
  };
}

// Utility function to handle API responses with proper error handling
export function handleApiResponse<T>(response: any): T {
  if (!response) {
    throw new Error('No response received from API');
  }

  if (!response.success) {
    throw new Error(response.message || 'API request failed');
  }

  if (!response.data) {
    throw new Error('No data received from API');
  }

  return response.data;
}

// Utility function to format prices consistently
export function formatPrice(price: number): string {
  if (price === 0) return '0.00';
  if (price < 0.000001) return price.toExponential(2);
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}

// Utility function to format market cap and volume
export function formatMarketValue(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

// Utility function to format percentage changes
export function formatPercentageChange(change: number): string {
  const formatted = Math.abs(change).toFixed(2);
  return change >= 0 ? `+${formatted}%` : `-${formatted}%`;
}

// Utility function to get change color class
export function getChangeColorClass(change: number): string {
  return change >= 0 ? 'text-success' : 'text-danger';
}

// Utility function to get change icon
export function getChangeIcon(change: number): string {
  return change >= 0 ? '▲' : '▼';
}