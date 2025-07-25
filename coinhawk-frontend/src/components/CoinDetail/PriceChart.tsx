import React from 'react';

interface PriceChartProps {
  coin: {
    price: number;
    change24h: number;
    chartData: Array<{
      timestamp: number;
      price: number;
      volume: number;
    }>;
  };
  chartPeriod: string;
  onPeriodChange: (period: string) => void;
  formatPrice: (price: number) => string;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  coin,
  chartPeriod,
  onPeriodChange,
  formatPrice
}) => {
  const periods = ['24h', '7d', '1m', '3m', '1y', 'Max', 'LOG'];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-dark-text-muted">Price</span>
          <span className="text-dark-text-muted hidden sm:inline">Market Cap</span>
          <span className="text-dark-text-muted hidden sm:inline">TradingView</span>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded transition-all flex-shrink-0 ${
                chartPeriod === period
                  ? 'bg-hawk-accent text-hawk-primary'
                  : 'text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-surface-light'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-container bg-dark-surface rounded-xl p-3 md:p-6 border border-dark-border">
        <div className="h-64 md:h-96 relative">
          {/* Mobile-optimized SVG Chart */}
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={coin.change24h >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={coin.change24h >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.05"/>
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            <g stroke="#475569" strokeWidth="0.5" opacity="0.3">
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`h-${i}`} x1="0" y1={i * 80 + 40} x2="800" y2={i * 80 + 40} />
              ))}
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <line key={`v-${i}`} x1={i * 133.33} y1="40" x2={i * 133.33} y2="360" />
              ))}
            </g>
            
            {/* Area Chart */}
            <path
              d="M 0 280 L 133.33 240 L 266.66 220 L 400 200 L 533.33 230 L 666.66 180 L 800 200 L 800 360 L 0 360 Z"
              fill="url(#priceGradient)"
            />
            
            {/* Price Line */}
            <path
              d="M 0 280 L 133.33 240 L 266.66 220 L 400 200 L 533.33 230 L 666.66 180 L 800 200"
              stroke={coin.change24h >= 0 ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Data Points */}
            {coin.chartData.map((point, index) => (
              <circle
                key={index}
                cx={index * 133.33}
                cy={280 - (point.price - 0.1098) * 2000}
                r="4"
                fill={coin.change24h >= 0 ? "#10b981" : "#ef4444"}
                className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              />
            ))}
            
            {/* Y-axis Labels - hidden on small screens */}
            <g fill="#94a3b8" fontSize="10" textAnchor="end" className="hidden sm:block">
              <text x="35" y="45">$0.127</text>
              <text x="35" y="125">$0.125</text>
              <text x="35" y="205">$0.123</text>
              <text x="35" y="285">$0.121</text>
              <text x="35" y="365">$0.119</text>
            </g>
            
            {/* X-axis Labels - simplified on mobile */}
            <g fill="#94a3b8" fontSize="10" textAnchor="middle">
              <text x="67" y="385" className="hidden sm:block">18:00</text>
              <text x="200" y="385">21:00</text>
              <text x="333" y="385" className="hidden sm:block">00:00</text>
              <text x="467" y="385">03:00</text>
              <text x="600" y="385" className="hidden sm:block">06:00</text>
              <text x="733" y="385">09:00</text>
            </g>
            
            {/* Current Price Indicator */}
            <g>
              <line x1="800" y1="200" x2="815" y2="200" stroke="#fbbf24" strokeWidth="2"/>
              <text x="820" y="205" fill="#fbbf24" fontSize="10" fontWeight="bold" className="hidden sm:block">
                ${formatPrice(coin.price)}
              </text>
            </g>
          </svg>
          
          {/* Chart Info Overlay */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-dark-surface/80 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-dark-border/50">
            <div className="text-xs md:text-sm text-dark-text-muted">Current Price</div>
            <div className="text-lg md:text-xl font-bold text-dark-text-primary font-mono">
              ${formatPrice(coin.price)}
            </div>
            <div className={`text-xs md:text-sm font-semibold ${coin.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
              {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}% (24h)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
