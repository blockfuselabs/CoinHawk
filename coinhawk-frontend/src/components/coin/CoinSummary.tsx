import React from 'react';
import { Bot, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

interface CoinSummaryProps {
  summary: string;
  coinName: string;
  riskLevel?: 'low' | 'medium' | 'high';
  confidence?: number;
}

export const CoinSummary: React.FC<CoinSummaryProps> = ({
  summary,
  coinName,
  riskLevel = 'medium',
  confidence = 85,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-danger';
      default: return 'text-warning';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return Shield;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const RiskIcon = getRiskIcon(riskLevel);

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-hawk-accent/10 rounded-lg">
          <Bot className="w-6 h-6 text-hawk-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-dark-text-primary">
            AI Analysis
          </h2>
          <p className="text-sm text-dark-text-muted">
            Generated insights for {coinName}
          </p>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-hawk-accent/5 to-transparent border border-hawk-accent/20 rounded-lg p-4">
          <p className="text-dark-text-primary leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-surface-light rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <RiskIcon className={`w-4 h-4 ${getRiskColor(riskLevel)}`} />
              <span className="text-sm font-semibold text-dark-text-secondary">
                Risk Level
              </span>
            </div>
            <div className={`text-lg font-bold capitalize ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </div>
          </div>

          <div className="bg-dark-surface-light rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-hawk-accent" />
              <span className="text-sm font-semibold text-dark-text-secondary">
                Confidence
              </span>
            </div>
            <div className="text-lg font-bold text-hawk-accent">
              {confidence}%
            </div>
          </div>
        </div>

        {/* Key Points */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-dark-text-secondary">
            Key Insights
          </h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
              <span className="text-dark-text-secondary">Strong community engagement</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
              <span className="text-dark-text-secondary">High volatility expected</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-1.5 h-1.5 bg-info rounded-full"></div>
              <span className="text-dark-text-secondary">Base ecosystem integration</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-dark-border">
          <p className="text-xs text-dark-text-muted">
            * This analysis is AI-generated based on market data, social sentiment, and technical indicators. 
            Not financial advice. Always do your own research before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};