import React from 'react';

// Simple router type definitions
export type Route = 'dashboard' | 'coin-detail' | 'watchlist' | 'settings' | 'analytics';

export interface RouterState {
  currentRoute: Route;
  selectedCoinId?: string;
}

// Simple routing context (optional - you can use React state instead)
export const RouterContext = React.createContext<{
  route: Route;
  coinId?: string;
  navigate: (route: Route, coinId?: string) => void;
}>({
  route: 'dashboard',
  navigate: () => {},
});

// Router hook
export const useRouter = () => {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
};

// Router provider component
export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = React.useState<Route>('dashboard');
  const [coinId, setCoinId] = React.useState<string>();

  const navigate = React.useCallback((newRoute: Route, newCoinId?: string) => {
    setRoute(newRoute);
    setCoinId(newCoinId);
  }, []);

  return (
    <RouterContext.Provider value={{ route, coinId, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// Route utilities
export const routeNames: Record<Route, string> = {
  dashboard: 'Dashboard',
  'coin-detail': 'Coin Details',
  watchlist: 'Watchlist',
  settings: 'Settings',
  analytics: 'Analytics',
};

export const getRouteTitle = (route: Route): string => {
  return routeNames[route] || 'CoinHawk';
};