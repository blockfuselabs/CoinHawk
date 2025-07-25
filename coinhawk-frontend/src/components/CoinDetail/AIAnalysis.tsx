import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, AlertCircle } from 'lucide-react';
import { coinsService } from '../../services/coinService';
import { ApiError } from '../../config/client';

interface AIAnalysisProps {
  coinName: string;
  coinAddress?: string;
  coin?: {
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    holders: number;
    isFromBaseApp?: boolean;
  };
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ coinName, coinAddress, coin }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealAI, setUseRealAI] = useState(true);

  const generateFallbackAnalysis = () => {
    if (!coin) {
      return `${coinName} shows potential in the cryptocurrency market. As with all digital assets, it's important to consider market volatility and conduct thorough research before making investment decisions.`;
    }

    const insights = [];
    
    // Price performance analysis
    if (coin.change24h > 10) {
      insights.push(`${coinName} demonstrates strong bullish momentum with a ${coin.change24h.toFixed(1)}% gain in 24 hours`);
    } else if (coin.change24h > 0) {
      insights.push(`${coinName} shows positive price action with a ${coin.change24h.toFixed(1)}% increase`);
    } else if (coin.change24h > -5) {
      insights.push(`${coinName} maintains relative stability with a ${Math.abs(coin.change24h).toFixed(1)}% decline`);
    } else {
      insights.push(`${coinName} faces bearish pressure with a ${Math.abs(coin.change24h).toFixed(1)}% decrease`);
    }

    // Market cap analysis
    if (coin.marketCap > 10000000) {
      insights.push('indicating substantial market presence and investor confidence');
    } else if (coin.marketCap > 1000000) {
      insights.push('showing growing market adoption and community interest');
    } else {
      insights.push('representing an early-stage project with growth potential');
    }

    // Volume analysis
    if (coin.volume24h > 100000) {
      insights.push(`High trading volume of ${(coin.volume24h / 1000).toFixed(0)}K suggests active community engagement`);
    } else {
      insights.push('Trading activity indicates developing market interest');
    }

    // Holder analysis
    if (coin.holders > 1000) {
      insights.push(`With ${coin.holders.toLocaleString()} unique holders, the token shows healthy distribution`);
    } else {
      insights.push(`The ${coin.holders} holder base suggests an emerging community`);
    }

    // Base ecosystem analysis
    if (coin.isFromBaseApp) {
      insights.push('Integration with the Base ecosystem provides technical advantages and network effects');
    }

    // Risk assessment
    insights.push('Risk factors include market volatility typical of cryptocurrency assets and regulatory considerations');

    return insights.join('. ') + '.';
  };


  const fetchAISummary = async () => {
    if (!coinAddress) {
      console.log('⚠️ No coin address provided, using fallback analysis');
      setAnalysis(generateFallbackAnalysis());
      setUseRealAI(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🤖 Fetching AI summary for:', coinAddress);
      const summary = await coinsService.getAISummary(coinAddress);
      setAnalysis(summary);
      setUseRealAI(true);
      console.log('AI summary loaded successfully');
    } catch (error) {
      console.error('Failed to fetch AI summary:', error);
      
      let errorMessage = 'Failed to load AI analysis';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      console.log('Using fallback analysis');
      setAnalysis(generateFallbackAnalysis());
      setUseRealAI(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAnalysis = () => {
    if (coinAddress && useRealAI) {
      fetchAISummary();
    } else {
      setLoading(true);
      setTimeout(() => {
        setAnalysis(generateFallbackAnalysis());
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchAISummary();
  }, [coinAddress, coinName]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-hawk-accent" />
          <h3 className="text-lg font-semibold text-dark-text-primary">
            AI Analysis
          </h3>
          {!useRealAI && (
            <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
              Simulated
            </span>
          )}
        </div>
        <button
          onClick={handleRefreshAnalysis}
          disabled={loading}
          className="p-1 rounded hover:bg-dark-surface-light text-dark-text-muted hover:text-hawk-accent disabled:opacity-50"
          title="Refresh analysis"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Error Banner */}
      {error && useRealAI && (
        <div className="mb-3 p-2 bg-danger/10 border border-danger/20 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
          <span className="text-xs text-danger">{error}</span>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="bg-hawk-accent/5 border border-hawk-accent/20 rounded-lg p-3 md:p-4">
          {loading ? (
            <div className="space-y-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ) : (
            <p className="text-sm text-dark-text-primary leading-relaxed">
              {analysis}
            </p>
          )}
        </div>
        
        {/* Risk Indicators */}
        {coin && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-dark-surface-light rounded">
              <div className="text-dark-text-muted">Volatility</div>
              <div className={`font-semibold ${
                Math.abs(coin.change24h) > 15 ? 'text-danger' : 
                Math.abs(coin.change24h) > 5 ? 'text-warning' : 'text-success'
              }`}>
                {Math.abs(coin.change24h) > 15 ? 'High' : 
                 Math.abs(coin.change24h) > 5 ? 'Medium' : 'Low'}
              </div>
            </div>
            
            <div className="text-center p-2 bg-dark-surface-light rounded">
              <div className="text-dark-text-muted">Liquidity</div>
              <div className={`font-semibold ${
                coin.volume24h > 100000 ? 'text-success' : 
                coin.volume24h > 10000 ? 'text-warning' : 'text-danger'
              }`}>
                {coin.volume24h > 100000 ? 'High' : 
                 coin.volume24h > 10000 ? 'Medium' : 'Low'}
              </div>
            </div>
            
            <div className="text-center p-2 bg-dark-surface-light rounded">
              <div className="text-dark-text-muted">Adoption</div>
              <div className={`font-semibold ${
                coin.holders > 1000 ? 'text-success' : 
                coin.holders > 100 ? 'text-warning' : 'text-danger'
              }`}>
                {coin.holders > 1000 ? 'High' : 
                 coin.holders > 100 ? 'Medium' : 'Low'}
              </div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-dark-text-muted">
          * {useRealAI ? 'AI-powered analysis from advanced language models' : 'Generated analysis based on market data and technical indicators'}. Not financial advice.
        </p>
      </div>
    </div>
  );
};