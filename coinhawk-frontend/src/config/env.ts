// src/config/env.ts - Vite Environment Configuration

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_RETRY_ATTEMPTS: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEFAULT_CURRENCY: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_ERROR_REPORTING: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_COINGECKO_API_KEY: string;
  readonly VITE_MORALIS_API_KEY: string;
  readonly VITE_DEFAULT_CHAIN_ID: string;
  readonly VITE_CHAIN_NAME: string;
  readonly VITE_CHAIN_RPC_URL: string;
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_ENABLE_THEME_SWITCHING: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_ENABLE_SW: string;
  readonly VITE_CACHE_DURATION: string;
  readonly VITE_SHOW_REDUX_DEVTOOLS: string;
  readonly VITE_ENABLE_WHY_DID_YOU_RENDER: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Environment configuration helper for Vite
class ViteEnvConfig {
  private getEnvVar(key: string, defaultValue?: string): string {
    const value = import.meta.env[key as keyof ImportMetaEnv];
    return value !== undefined ? String(value) : (defaultValue || '');
  }

  private getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
    const value = this.getEnvVar(key);
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  private getNumberEnvVar(key: string, defaultValue: number): number {
    const value = this.getEnvVar(key);
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  // API Configuration
  get API_BASE_URL(): string {
    return this.getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api');
  }

  get API_TIMEOUT(): number {
    return this.getNumberEnvVar('VITE_API_TIMEOUT', 30000);
  }

  get API_RETRY_ATTEMPTS(): number {
    return this.getNumberEnvVar('VITE_API_RETRY_ATTEMPTS', 3);
  }

  // Environment Detection
  get NODE_ENV(): string {
    return import.meta.env.MODE || 'development';
  }

  get IS_DEVELOPMENT(): boolean {
    return import.meta.env.DEV;
  }

  get IS_PRODUCTION(): boolean {
    return import.meta.env.PROD;
  }

  // App Configuration
  get APP_NAME(): string {
    return this.getEnvVar('VITE_APP_NAME', 'CoinHawk');
  }

  get APP_VERSION(): string {
    return this.getEnvVar('VITE_APP_VERSION', '1.0.0');
  }

  get DEFAULT_CURRENCY(): string {
    return this.getEnvVar('VITE_DEFAULT_CURRENCY', 'USD');
  }

  // Feature Flags
  get ENABLE_ANALYTICS(): boolean {
    return this.getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false);
  }

  get ENABLE_ERROR_REPORTING(): boolean {
    return this.getBooleanEnvVar('VITE_ENABLE_ERROR_REPORTING', false);
  }

  get ENABLE_NOTIFICATIONS(): boolean {
    return this.getBooleanEnvVar('VITE_ENABLE_NOTIFICATIONS', true);
  }

  // Third-party API Keys
  get COINGECKO_API_KEY(): string {
    return this.getEnvVar('VITE_COINGECKO_API_KEY', '');
  }

  get MORALIS_API_KEY(): string {
    return this.getEnvVar('VITE_MORALIS_API_KEY', '');
  }

  // Blockchain Configuration
  get DEFAULT_CHAIN_ID(): number {
    return this.getNumberEnvVar('VITE_DEFAULT_CHAIN_ID', 8453);
  }

  get CHAIN_NAME(): string {
    return this.getEnvVar('VITE_CHAIN_NAME', 'Base');
  }

  get CHAIN_RPC_URL(): string {
    return this.getEnvVar('VITE_CHAIN_RPC_URL', 'https://mainnet.base.org');
  }

  // UI Configuration
  get DEFAULT_THEME(): string {
    return this.getEnvVar('VITE_DEFAULT_THEME', 'dark');
  }

  get ENABLE_THEME_SWITCHING(): boolean {
    return this.getBooleanEnvVar('VITE_ENABLE_THEME_SWITCHING', true);
  }

  get DEFAULT_LANGUAGE(): string {
    return this.getEnvVar('VITE_DEFAULT_LANGUAGE', 'en');
  }

  // Performance
  get ENABLE_SW(): boolean {
    return this.getBooleanEnvVar('VITE_ENABLE_SW', true);
  }

  get CACHE_DURATION(): number {
    return this.getNumberEnvVar('VITE_CACHE_DURATION', 300000);
  }

  // Development Tools
  get SHOW_REDUX_DEVTOOLS(): boolean {
    return this.getBooleanEnvVar('VITE_SHOW_REDUX_DEVTOOLS', this.IS_DEVELOPMENT);
  }

  get ENABLE_WHY_DID_YOU_RENDER(): boolean {
    return this.getBooleanEnvVar('VITE_ENABLE_WHY_DID_YOU_RENDER', false);
  }

  // Auth Configuration (if implemented)
  get AUTH_DOMAIN(): string {
    return this.getEnvVar('VITE_AUTH_DOMAIN', '');
  }

  get AUTH_CLIENT_ID(): string {
    return this.getEnvVar('VITE_AUTH_CLIENT_ID', '');
  }

  // Debug method to log all environment variables
  debugEnv(): void {
    if (!this.IS_DEVELOPMENT) return;
    
    console.group('🔧 Vite Environment Configuration');
    console.log('API_BASE_URL:', this.API_BASE_URL);
    console.log('NODE_ENV:', this.NODE_ENV);
    console.log('IS_DEVELOPMENT:', this.IS_DEVELOPMENT);
    console.log('IS_PRODUCTION:', this.IS_PRODUCTION);
    console.log('APP_NAME:', this.APP_NAME);
    console.log('APP_VERSION:', this.APP_VERSION);
    console.log('Available env vars:', Object.keys(import.meta.env));
    console.groupEnd();
  }

  // Validate required environment variables
  validateRequiredEnvVars(): string[] {
    const required = [
      'VITE_API_BASE_URL',
    ];

    const missing: string[] = [];

    required.forEach(key => {
      if (!this.getEnvVar(key)) {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
    }

    return missing;
  }

  // Get all environment variables for debugging
  getAllEnvVars(): Record<string, any> {
    return {
      ...import.meta.env,
      // Computed values
      IS_DEVELOPMENT: this.IS_DEVELOPMENT,
      IS_PRODUCTION: this.IS_PRODUCTION,
      NODE_ENV: this.NODE_ENV,
    };
  }
}

// Create and export singleton instance
export const env = new ViteEnvConfig();

// Export for debugging in development
if (env.IS_DEVELOPMENT) {
  (window as any).env = env;
  (window as any).envVars = env.getAllEnvVars();
  env.debugEnv();
}

// Validate environment on startup
const missingVars = env.validateRequiredEnvVars();
if (missingVars.length > 0 && env.IS_DEVELOPMENT) {
  console.warn('⚠️ Consider setting these environment variables in your .env file');
  console.log('💡 Vite uses VITE_ prefix for environment variables, e.g. VITE_API_BASE_URL');
}