import React, { useState } from 'react';

interface CoinAvatarProps {
  symbol: string;
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CoinAvatar: React.FC<CoinAvatarProps> = ({
  symbol,
  name,
  image,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-5 h-5 md:w-6 md:h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-12 h-12 md:w-16 md:h-16 text-lg md:text-xl'
  };

  const generateGradient = (text: string) => {
    // Generate consistent colors based on the coin symbol/name
    const hash = text.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
        
    const hue1 = (hash * 137.508) % 360;
    const hue2 = ((hash * 137.508) + 60) % 360;
        
    return {
      background: `linear-gradient(135deg, hsl(${hue1}, 70%, 55%) 0%, hsl(${hue2}, 70%, 45%) 100%)`,
    };
  };

  const firstLetter = (symbol || name || '?').charAt(0).toUpperCase();
  const gradientStyle = generateGradient(symbol + name);

  // Check if we have a valid image URL (not placeholder, not empty, not error)
  const hasValidImage = image && 
                       !image.includes('/api/placeholder/') && 
                       !image.includes('placeholder') && 
                       !imageError;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    console.log(`🖼️ Image failed to load for ${name}:`, image);
    setImageError(true);
    setImageLoading(false);
  };

  // If we have a valid image and no error, try to display it
  if (hasValidImage) {
    return (
      <div className={`${sizeClasses[size]} rounded-full relative ${className}`}>
        {imageLoading && (
          <div 
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white absolute inset-0`}
            style={gradientStyle}
          >
            {firstLetter}
          </div>
        )}
        <img 
          src={image}
          alt={`${name} logo`}
          className={`${sizeClasses[size]} rounded-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
    );
  }

  // Use gradient-based avatar as default or fallback
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={gradientStyle}
      title={`${name} (${symbol})`}
    >
      {firstLetter}
    </div>
  );
};