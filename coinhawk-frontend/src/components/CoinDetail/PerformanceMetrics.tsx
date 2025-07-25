import React from 'react';

interface PerformanceMetricsProps {
  coin: {
    change24h: number;
    change7d: number;
  };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ coin }) => {
  const metrics = [
    { period: '1h', change: -0.5, color: 'text-danger' },
    { period: '24h', change: coin.change24h, color: coin.change24h >= 0 ? 'text-success' : 'text-danger' },
    { period: '7d', change: coin.change7d, color: 'text-success' },
    { period: '14d', change: 6.6, color: 'text-success' },
    { period: '30d', change: 12.4, color: 'text-success' },
    { period: '1y', change: 77.6, color: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
      {metrics.map((metric) => (
        <div key={metric.period} className="text-center">
          <div className="text-xs md:text-sm text-dark-text-muted">{metric.period}</div>
          <div className={`font-semibold text-xs md:text-sm ${metric.color}`}>
            {metric.change >= 0 ? '▲' : '▼'} {Math.abs(metric.change).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
};
