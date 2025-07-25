// src/pages/Settings.tsx
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Database, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';

interface SettingsData {
  notifications: {
    priceAlerts: boolean;
    volumeAlerts: boolean;
    newCoins: boolean;
    emailNotifications: boolean;
  };
  display: {
    theme: 'dark' | 'light' | 'auto';
    currency: 'USD' | 'EUR' | 'BTC' | 'ETH';
    priceFormat: 'full' | 'abbreviated';
    refreshInterval: number;
  };
  trading: {
    defaultSlippage: number;
    gasPriceAlert: boolean;
    autoRefresh: boolean;
  };
  privacy: {
    shareData: boolean;
    trackingAllowed: boolean;
    cacheData: boolean;
  };
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      priceAlerts: true,
      volumeAlerts: true,
      newCoins: false,
      emailNotifications: false,
    },
    display: {
      theme: 'dark',
      currency: 'USD',
      priceFormat: 'abbreviated',
      refreshInterval: 30,
    },
    trading: {
      defaultSlippage: 0.5,
      gasPriceAlert: true,
      autoRefresh: true,
    },
    privacy: {
      shareData: false,
      trackingAllowed: true,
      cacheData: true,
    },
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false);
  };

  const handleExportData = () => {
    // Export user data
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // Import user data
    console.log('Importing data...');
  };

  const handleClearCache = () => {
    // Clear application cache
    console.log('Clearing cache...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Settings
          </h1>
          <p className="text-dark-text-secondary">
            Customize your CoinHawk experience
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center space-x-3">
            <button className="btn-ghost" onClick={handleReset}>
              Reset
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSave} 
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-hawk-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-dark-text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-dark-text-muted">
                    {key === 'priceAlerts' && 'Get notified when tracked coins hit price targets'}
                    {key === 'volumeAlerts' && 'Alerts for significant volume changes'}
                    {key === 'newCoins' && 'Notifications for newly added coins'}
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hawk-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hawk-accent"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Display */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-hawk-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">
              Display
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Theme
              </label>
              <select
                value={settings.display.theme}
                onChange={(e) => updateSetting('display', 'theme', e.target.value)}
                className="input w-full"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Currency
              </label>
              <select
                value={settings.display.currency}
                onChange={(e) => updateSetting('display', 'currency', e.target.value)}
                className="input w-full"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="BTC">BTC (₿)</option>
                <option value="ETH">ETH (Ξ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={settings.display.refreshInterval}
                onChange={(e) => updateSetting('display', 'refreshInterval', parseInt(e.target.value))}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Trading */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <RefreshCw className="w-6 h-6 text-hawk-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">
              Trading
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Default Slippage (%)
              </label>
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={settings.trading.defaultSlippage}
                onChange={(e) => updateSetting('trading', 'defaultSlippage', parseFloat(e.target.value))}
                className="input w-full"
              />
            </div>

            {Object.entries(settings.trading).filter(([key]) => key !== 'defaultSlippage').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-dark-text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => updateSetting('trading', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hawk-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hawk-accent"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-hawk-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">
              Privacy & Data
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-dark-text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hawk-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hawk-accent"></div>
                </label>
              </div>
            ))}

            <div className="pt-4 border-t border-dark-border">
              <h3 className="text-sm font-semibold text-dark-text-primary mb-4">
                Data Management
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="btn-secondary" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
                <button className="btn-secondary" onClick={handleImportData}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </button>
                <button className="btn-secondary" onClick={handleClearCache}>
                  <Database className="w-4 h-4 mr-2" />
                  Clear Cache
                </button>
                <button className="btn-secondary text-danger-500 hover:bg-danger-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-hawk-accent" />
          <h2 className="text-xl font-semibold text-dark-text-primary">
            Application Info
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-dark-text-muted">Version</p>
            <p className="font-mono text-dark-text-primary">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-dark-text-muted">Platform</p>
            <p className="font-mono text-dark-text-primary">Tauri + React</p>
          </div>
          <div>
            <p className="text-sm text-dark-text-muted">Build</p>
            <p className="font-mono text-dark-text-primary">2024.01.20</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-dark-border">
          <p className="text-sm text-dark-text-muted">
            CoinHawk is built with modern web technologies for the Base ecosystem. 
            Report issues or suggest features on our GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
};