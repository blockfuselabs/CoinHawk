export const API_ENDPOINTS = {
  // Coins endpoints
  COINS: {
    NEW: '/coins/new',
    BY_ID: (id: string) => `/coins/${id}`,
    TRENDING: '/coins/trending',
    TOP_GAINERS: '/coins/gainers',
    TOP_LOSERS: '/coins/losers',
    SEARCH: '/coins/search',
    MARKET_DATA: '/coins/market-data',
  },
  
  // Market endpoints
  MARKET: {
    STATS: '/market/stats',
    CAP: '/market/cap',
    VOLUME: '/market/volume',
  },
  
  // User endpoints
  USER: {
    WATCHLIST: '/user/watchlist',
    PORTFOLIO: '/user/portfolio',
  }
} as const;

export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: 'marketCap' | 'volume' | 'price' | 'change' | 'holders' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  filterBy?: 'all' | 'gainers' | 'losers' | 'new';
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  maxVolume?: number;
}

export interface CoinsQueryParams extends PaginationParams, SortParams, FilterParams {
  search?: string;
  chainId?: number;
}

export default API_ENDPOINTS;