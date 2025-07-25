import React, { useState } from 'react';
import { ExternalLink, Copy } from 'lucide-react';

interface CoinInfoProps {
  coin: {
    website?: string;
    twitter?: string;
    address: string;
    chainId?: number;
    creatorAddress?: string;
    createdAt?: string;
  };
}

export const CoinInfo: React.FC<CoinInfoProps> = ({ coin }) => {
  const [copied, setCopied] = useState('');

  const handleCopyAddress = async (address: string, type: string) => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  const getExplorerUrl = (address: string, chainId?: number) => {
    if (chainId === 8453) { // Base mainnet
      return `https://basescan.org/token/${address}`;
    }
    return `https://etherscan.io/token/${address}`;
  };

  const getExplorerName = (chainId?: number) => {
    if (chainId === 8453) return 'Basescan';
    return 'Etherscan';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const shortAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Info</h3>
      <div className="space-y-4">
        
        {/* Website */}
        {coin.website && (
          <div>
            <div className="text-sm text-dark-text-muted mb-2">Website</div>
            <a 
              href={coin.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-hawk-accent hover:underline text-sm md:text-base flex items-center space-x-1"
            >
              <span>{coin.website.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
        
        {/* Blockchain Explorer */}
        <div>
          <div className="text-sm text-dark-text-muted mb-2">Explorers</div>
          <div className="flex items-center space-x-2">
            <a 
              href={getExplorerUrl(coin.address, coin.chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hawk-accent hover:underline text-sm flex items-center space-x-1"
            >
              <span>{getExplorerName(coin.chainId)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Social Links */}
        {coin.twitter && (
          <div>
            <div className="text-sm text-dark-text-muted mb-2">Community</div>
            <div className="flex items-center space-x-4">
              <a 
                href={coin.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-hawk-accent hover:underline text-sm flex items-center space-x-1"
              >
                <span>Twitter</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Contract Address */}
        <div>
          <div className="text-sm text-dark-text-muted mb-2">Contract Address</div>
          <div className="flex items-center space-x-2">
            <code className="text-xs bg-dark-surface-light px-2 py-1 rounded font-mono text-dark-text-primary flex-1 truncate">
              {coin.address}
            </code>
            <button
              onClick={() => handleCopyAddress(coin.address, 'contract')}
              className={`p-1 rounded hover:bg-dark-surface-light ${
                copied === 'contract' ? 'text-success' : 'text-dark-text-muted'
              }`}
              title="Copy contract address"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied === 'contract' && (
            <p className="text-xs text-success mt-1">Contract address copied!</p>
          )}
        </div>

        {/* Creator Address */}
        {coin.creatorAddress && (
          <div>
            <div className="text-sm text-dark-text-muted mb-2">Creator Address</div>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-dark-surface-light px-2 py-1 rounded font-mono text-dark-text-primary flex-1 truncate">
                {coin.creatorAddress}
              </code>
              <button
                onClick={() => handleCopyAddress(coin.creatorAddress!, 'creator')}
                className={`p-1 rounded hover:bg-dark-surface-light ${
                  copied === 'creator' ? 'text-success' : 'text-dark-text-muted'
                }`}
                title="Copy creator address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied === 'creator' && (
              <p className="text-xs text-success mt-1">Creator address copied!</p>
            )}
          </div>
        )}

        {/* Creation Date */}
        <div>
          <div className="text-sm text-dark-text-muted mb-2">Created</div>
          <div className="text-sm text-dark-text-primary">
            {formatDate(coin.createdAt)}
          </div>
        </div>

        {/* Chain Info */}
        <div>
          <div className="text-sm text-dark-text-muted mb-2">Network</div>
          <div className="text-sm text-dark-text-primary">
            {coin.chainId === 8453 ? 'Base Mainnet' : `Chain ID: ${coin.chainId || 'Unknown'}`}
          </div>
        </div>
      </div>
    </div>
  );
};