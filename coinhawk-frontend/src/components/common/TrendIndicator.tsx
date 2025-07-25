import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  type?: 'arrow' | 'trend' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showPercentage?: boolean;
  animate?: boolean;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  type = 'trend',
  size = 'md',
  showValue = true,
  showPercentage = true,
  animate = false,
  className = '',
}) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const absValue = Math.abs(value);

  const getIcon = () => {
    if (isNeutral) return Minus;
    
    switch (type) {
      case 'arrow':
        return isPositive ? ArrowUp : ArrowDown;
      case 'trend':
        return isPositive ? TrendingUp : TrendingDown;
      case 'dot':
        return null;
      default:
        return isPositive ? TrendingUp : TrendingDown;
    }
  };

  const getColor = () => {
    if (isNeutral) return 'text-dark-text-muted';
    return isPositive ? 'text-success' : 'text-danger';
  };

  const getBgColor = () => {
    if (isNeutral) return 'bg-dark-surface-light';
    return isPositive ? 'bg-success/10' : 'bg-danger/10';
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Icon = getIcon();

  if (type === 'dot') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${
          isNeutral ? 'bg-dark-text-muted' : isPositive ? 'bg-success' : 'bg-danger'
        } ${animate ? 'animate-pulse' : ''}`}></div>
        {showValue && (
          <span className={`font-mono font-semibold ${sizeClasses[size]} ${getColor()}`}>
            {isPositive ? '+' : ''}{value.toFixed(2)}{showPercentage ? '%' : ''}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg ${getBgColor()} ${className}`}>
      {Icon && (
        <Icon className={`${iconSizes[size]} ${getColor()} ${animate ? 'animate-bounce-gentle' : ''}`} />
      )}
      {showValue && (
        <span className={`font-mono font-semibold ${sizeClasses[size]} ${getColor()}`}>
          {isPositive ? '+' : ''}{value.toFixed(2)}{showPercentage ? '%' : ''}
        </span>
      )}
    </div>
  );
};