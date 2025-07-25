import { useState, useEffect, useCallback } from 'react';
import { coinsService, Coin, MarketStats } from '../services/coinService';
import { CoinsQueryParams } from '../config/endpoints';
import { ApiError } from '../config/client';

export interface UseCoinsState {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  marketStats: MarketStats | null;
  hasMore: boolean;
}

export interface UseCoinsActions {
  fetchCoins: (params?: CoinsQueryParams) => Promise<void>;
  fetchTrendingCoins: (limit?: number) => Promise<void>;
  fetchTopGainers: (limit?: number) => Promise<void>;
  fetchTopLosers: (limit?: number) => Promise<void>;
  searchCoins: (query: string, limit?: number) => Promise<void>;
  fetchCoinById: (id: string) => Promise<Coin | null>;
  fetchMarketStats: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  loadMore: () => Promise<void>;
}

export interface UseCoinsReturn extends UseCoinsState, UseCoinsActions {}

export interface UseCoinsOptions {
  autoFetch?: boolean;
  initialParams?: CoinsQueryParams;
  refreshInterval?: number; 
}

export const useCoins = (options: UseCoinsOptions = {}): UseCoinsReturn => {
  const {
    autoFetch = true,
    initialParams = { limit: 20, sortBy: 'marketCap' as const, sortOrder: 'desc' as const },
    refreshInterval
  } = options;


  const [state, setState] = useState<UseCoinsState>({
    coins: [],
    loading: false,
    error: null,
    marketStats: null,
    hasMore: true,
  });

  const [currentParams, setCurrentParams] = useState<CoinsQueryParams>(initialParams);
  const [currentPage, setCurrentPage] = useState(1);

 
  const updateState = useCallback((updates: Partial<UseCoinsState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

 
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);


  const handleError = useCallback((error: unknown) => {
    console.error('Coins API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof ApiError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    updateState({ error: errorMessage, loading: false });
  }, [updateState]);

  // Fetch coins with parameters
  const fetchCoins = useCallback(async (params: CoinsQueryParams = {}) => {
    try {
      updateState({ loading: true, error: null });
      
      const mergedParams = { ...currentParams, ...params };
      setCurrentParams(mergedParams);
      
      console.log('🔄 Fetching coins with params:', mergedParams);
      
      const coins = await coinsService.getNewCoins(mergedParams);
      
      updateState({ 
        coins, 
        loading: false,
        hasMore: coins.length === (mergedParams.limit || 20)
      });
      
      setCurrentPage(1);
      
    } catch (error) {
      handleError(error);
    }
  }, [currentParams, updateState, handleError]);

  // Fetch trending coins
  const fetchTrendingCoins = useCallback(async (limit: number = 10) => {
    try {
      updateState({ loading: true, error: null });
      
      const coins = await coinsService.getTrendingCoins(limit);
      
      updateState({ coins, loading: false });
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  // Fetch top gainers
  const fetchTopGainers = useCallback(async (limit: number = 10) => {
    try {
      updateState({ loading: true, error: null });
      
      const coins = await coinsService.getTopGainers(limit);
      
      updateState({ coins, loading: false });
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  // Fetch top losers
  const fetchTopLosers = useCallback(async (limit: number = 10) => {
    try {
      updateState({ loading: true, error: null });
      
      const coins = await coinsService.getTopLosers(limit);
      
      updateState({ coins, loading: false });
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  // Search coins
  const searchCoins = useCallback(async (query: string, limit: number = 20) => {
    try {
      updateState({ loading: true, error: null });
      
      const coins = await coinsService.searchCoins(query, limit);
      
      updateState({ coins, loading: false });
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  // Fetch coin by ID
  const fetchCoinById = useCallback(async (id: string): Promise<Coin | null> => {
    try {
      clearError();
      
      const coin = await coinsService.getCoinById(id);
      return coin;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [clearError, handleError]);

  // Fetch market stats
  const fetchMarketStats = useCallback(async () => {
    try {
      const marketStats = await coinsService.getMarketStats();
      updateState({ marketStats });
    } catch (error) {
      console.error('Error fetching market stats:', error);
    }
  }, [updateState]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchCoins(currentParams),
      fetchMarketStats()
    ]);
  }, [fetchCoins, fetchMarketStats, currentParams]);

  // Load more coins
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading) return;
    
    try {
      updateState({ loading: true });
      
      const nextPage = currentPage + 1;
      const params = {
        ...currentParams,
        page: nextPage,
        offset: (nextPage - 1) * (currentParams.limit || 20)
      };
      
      const newCoins = await coinsService.getNewCoins(params);
      
      updateState({ 
        coins: [...state.coins, ...newCoins],
        loading: false,
        hasMore: newCoins.length === (currentParams.limit || 20)
      });
      
      setCurrentPage(nextPage);
      
    } catch (error) {
      handleError(error);
    }
  }, [state.hasMore, state.loading, state.coins, currentPage, currentParams, updateState, handleError]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refreshData();
    }
  }, [autoFetch]); 

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!state.loading) {
          refreshData();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, refreshData, state.loading]);

  return {
    ...state,
    
    fetchCoins,
    fetchTrendingCoins,
    fetchTopGainers,
    fetchTopLosers,
    searchCoins,
    fetchCoinById,
    fetchMarketStats,
    refreshData,
    clearError,
    loadMore,
  };
};

export const useTrendingCoins = (limit: number = 10) => {
  return useCoins({
    autoFetch: false, 
    initialParams: { limit, sortBy: 'volume' as const, sortOrder: 'desc' as const }
  });
};

export const useTopGainers = (limit: number = 10) => {
  return useCoins({
    autoFetch: false,
    initialParams: { limit, filterBy: 'gainers', sortBy: 'change' as const, sortOrder: 'desc' as const }
  });
};

export const useNewCoins = (limit: number = 20) => {
  return useCoins({
    autoFetch: true,
    initialParams: { limit, sortBy: 'createdAt' as const, sortOrder: 'desc' as const },
    refreshInterval: 30000 
  });
};