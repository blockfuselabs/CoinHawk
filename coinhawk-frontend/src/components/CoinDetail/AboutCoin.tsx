import React from 'react';

interface AboutCoinProps {
  coin: {
    name: string;
    symbol: string;
    description: string;
    isFromBaseApp?: boolean;
    chainId?: number;
  };
}

export const AboutCoin: React.FC<AboutCoinProps> = ({ coin }) => {
  // Generate additional context based on coin data
  const getAdditionalInfo = () => {
    const infoParts = [];
    
    if (coin.isFromBaseApp) {
      infoParts.push(`${coin.name} was created through the Base App, demonstrating its integration with the Base ecosystem.`);
    }
    
    if (coin.chainId === 8453) {
      infoParts.push(`Built on Base, a secure, low-cost, builder-friendly Ethereum Layer 2 blockchain.`);
    }
    
    infoParts.push(`${coin.symbol} operates as a digital asset with community-driven governance and transparent blockchain mechanics.`);
    
    return infoParts.join(' ');
  };

  const fullDescription = coin.description 
    ? `${coin.description} ${getAdditionalInfo()}`
    : `${coin.name} (${coin.symbol}) is a cryptocurrency token that operates on the blockchain. ${getAdditionalInfo()}`;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
        About {coin.name}
      </h3>
      <div className="space-y-3">
        <p className="text-dark-text-secondary leading-relaxed text-sm">
          {fullDescription}
        </p>
        
        {/* Key Features */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-dark-text-primary mb-2">Key Features:</h4>
          <ul className="text-xs text-dark-text-secondary space-y-1">
            <li>• Decentralized digital asset</li>
            <li>• Transparent blockchain transactions</li>
            {coin.chainId === 8453 && <li>• Built on Base Layer 2 for low fees</li>}
            {coin.isFromBaseApp && <li>• Base App ecosystem integration</li>}
            <li>• Community-driven development</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
          <p className="text-xs text-dark-text-muted">
            <strong>Disclaimer:</strong> Cryptocurrency investments carry risk. This information is for educational purposes only and should not be considered financial advice. Always do your own research before investing.
          </p>
        </div>
      </div>
    </div>
  );
};