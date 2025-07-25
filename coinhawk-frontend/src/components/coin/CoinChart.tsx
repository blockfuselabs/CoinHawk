// src/components/coin/CoinChart.tsx
import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity, Volume2, Maximize2 } from 'lucide-react';

interface CoinChartProps {
  coinId: string;
  data: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
}

export const CoinChart: React.FC<CoinChartProps> = ({ coinId, data }) => {
  const [timeframe, setTimeframe] = useState('24h');
  const [chartType, setChartType] = useState<'line' | 'area' | 'volume'>('area');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeframes = [
    { value: '1h', label: '1H' },
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
  ];

  // Format data for Recharts
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      timestamp: point.timestamp,
      price: point.price,
      volume: point.volume / 1e6, // Convert to millions for readability
      date: new Date(point.timestamp).toLocaleDateString()
    }));
  }, [data]);

  // Calculate chart metrics
  const chartMetrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        highPrice: 0,
        lowPrice: 0,
        totalVolume: 0,
        isPositive: false
      };
    }

    const prices = data.map(d => d.price);
    const volumes = data.map(d => d.volume);
    const currentPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const priceChange = currentPrice - firstPrice;
    const priceChangePercent = ((priceChange / firstPrice) * 100);
    
    return {
      currentPrice,
      priceChange,
      priceChangePercent,
      highPrice: Math.max(...prices),
      lowPrice: Math.min(...prices),
      totalVolume: volumes.reduce((sum, vol) => sum + vol, 0),
      isPositive: priceChange >= 0
    };
  }, [data]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-dark-text-muted text-xs mb-1">{data.date} • {label}</p>
          {chartType === 'volume' ? (
            <p className="text-dark-text-primary font-mono">
              Volume: <span className="text-hawk-accent">${data.volume.toFixed(2)}M</span>
            </p>
          ) : (
            <>
              <p className="text-dark-text-primary font-mono">
                Price: <span className="text-hawk-accent">${data.price.toFixed(6)}</span>
              </p>
              <p className="text-dark-text-muted text-xs">
                Volume: ${data.volume.toFixed(2)}M
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Chart height based on fullscreen state
  const chartHeight = isFullscreen ? 600 : 400;

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
            <p className="text-dark-text-muted">No chart data available</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      width: '100%',
      height: chartHeight,
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    if (chartType === 'volume') {
      return (
        <ResponsiveContainer {...commonProps}>
          <BarChart 
            data={chartData}
            barCategoryGap="20%" 
            maxBarSize={60}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(148, 163, 184, 0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="volume" 
              fill="#fbbf24"
              radius={[2, 2, 0, 0]}
              fillOpacity={0.8}
              stroke="#fbbf24"
              strokeWidth={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer {...commonProps}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={chartMetrics.isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={chartMetrics.isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(148, 163, 184, 0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(6)}`}
              domain={['dataMin * 0.999', 'dataMax * 1.001']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartMetrics.isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: chartMetrics.isPositive ? '#10b981' : '#ef4444',
                strokeWidth: 2,
                stroke: '#1e293b'
              }}
            />
            {/* Reference line for starting price */}
            <ReferenceLine 
              y={chartData[0]?.price} 
              stroke="rgba(148, 163, 184, 0.3)" 
              strokeDasharray="2 2" 
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // Line chart (default)
    return (
      <ResponsiveContainer {...commonProps}>
        <LineChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(148, 163, 184, 0.1)" 
            vertical={false}
          />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(6)}`}
            domain={['dataMin * 0.999', 'dataMax * 1.001']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={chartMetrics.isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: chartMetrics.isPositive ? '#10b981' : '#ef4444',
              strokeWidth: 2,
              stroke: '#1e293b'
            }}
          />
          {/* Reference line for starting price */}
          <ReferenceLine 
            y={chartData[0]?.price} 
            stroke="rgba(148, 163, 184, 0.3)" 
            strokeDasharray="2 2" 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`card ${isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-hawk-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">
              {chartType === 'volume' ? 'Volume Chart' : 'Price Chart'}
            </h2>
          </div>
          
          {/* Current Price & Change */}
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-lg font-bold font-mono text-dark-text-primary">
                ${chartMetrics.currentPrice.toFixed(6)}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                chartMetrics.isPositive ? 'text-success-500' : 'text-danger-500'
              }`}>
                {chartMetrics.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-mono">
                  {chartMetrics.isPositive ? '+' : ''}{chartMetrics.priceChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Chart Type Toggle */}
          <div className="flex bg-dark-surface-light rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-hawk-accent text-hawk-primary shadow-sm'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-hawk-accent text-hawk-primary shadow-sm'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('volume')}
              className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center space-x-1 ${
                chartType === 'volume'
                  ? 'bg-hawk-accent text-hawk-primary shadow-sm'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Volume</span>
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-dark-surface-light rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  timeframe === tf.value
                    ? 'bg-hawk-accent text-hawk-primary shadow-sm'
                    : 'text-dark-text-secondary hover:text-dark-text-primary'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn-ghost p-2"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-dark-surface-light rounded-lg">
        <div>
          <p className="text-xs text-dark-text-muted">24h High</p>
          <p className="font-mono text-sm text-dark-text-primary">
            ${chartMetrics.highPrice.toFixed(6)}
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-text-muted">24h Low</p>
          <p className="font-mono text-sm text-dark-text-primary">
            ${chartMetrics.lowPrice.toFixed(6)}
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-text-muted">24h Change</p>
          <p className={`font-mono text-sm ${
            chartMetrics.isPositive ? 'text-success-500' : 'text-danger-500'
          }`}>
            ${chartMetrics.priceChange.toFixed(6)}
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-text-muted">24h Volume</p>
          <p className="font-mono text-sm text-dark-text-primary">
            ${(chartMetrics.totalVolume / 1e6).toFixed(2)}M
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        {renderChart()}
        
        {/* Chart info overlay */}
        <div className="absolute top-4 left-4">
          <div className="bg-dark-surface/80 backdrop-blur-sm rounded-lg p-3 border border-dark-border/50">
            <p className="text-xs text-dark-text-muted">
              {timeframe.toUpperCase()} • {chartData.length} data points
            </p>
            <p className="text-xs text-dark-text-muted">
              Coin: {coinId}
            </p>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-dark-surface/80 backdrop-blur-sm rounded-lg p-2 border border-dark-border/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-dark-text-muted">Live • Base Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-dark-text-muted">
        <div className="flex items-center space-x-4">
          <span>Powered by Recharts</span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>•</span>
          <span>Data provided by CoinHawk API</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Chart Type: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
        </div>
      </div>

      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 btn-ghost p-2 z-10"
        >
          ✕
        </button>
      )}
    </div>
  );
};