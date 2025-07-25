import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
  change?: number;
  changeType?: '24h' | '7d' | '30d';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animate?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  change,
  changeType = '24h',
  size = 'md',
  showIcon = true,
  animate = false,
  className = '',
}) => {
  const formatPrice = (price: number) => {
    if (price === 0) return '$0.00';
    if (price < 0.000001) return `${price.toExponential(2)}`;
    if (price < 0.01) return `${price.toFixed(6)}`;
    if (price < 1) return `${price.toFixed(4)}`;
    if (price < 1000) return `${price.toFixed(2)}`;
    if (price < 1000000) return `${(price / 1000).toFixed(2)}K`;
    if (price < 1000000000) return `${(price / 1000000).toFixed(2)}M`;
    return `${(price / 1000000000).toFixed(2)}B`;
  };

  const getChangeData = () => {
    if (change === undefined) return null;
    
    const isPositive = change > 0;
    const isNeutral = change === 0;
    
    return {
      isPositive,
      isNeutral,
      formatted: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
      color: isNeutral ? 'price-neutral' : isPositive ? 'price-positive' : 'price-negative',
      icon: isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown,
    };
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const changeData = getChangeData();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`font-bold font-mono ${sizeClasses[size]} ${animate ? 'transition-all duration-300' : ''}`}>
        {formatPrice(price)}
      </span>
      
      {changeData && (
        <div className={`flex items-center space-x-1 ${changeData.color}`}>
          {showIcon && (
            <changeData.icon className="w-4 h-4" />
          )}
          <span className="font-semibold font-mono text-sm">
            {changeData.formatted}
          </span>
          <span className="text-xs text-dark-text-muted">
            {changeType}
          </span>
        </div>
      )}
    </div>
  );
};
