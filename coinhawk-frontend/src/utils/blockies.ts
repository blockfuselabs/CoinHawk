// src/utils/blockies.ts
// Simple blockies generator without external dependency

interface BlockiesOptions {
  seed: string;
  size?: number;
  scale?: number;
  color?: string;
  bgcolor?: string;
  spotcolor?: string;
}

export const generateBlockies = (options: BlockiesOptions): string => {
  const {
    seed,
    size = 8,
    scale = 4,
    color = '#fbbf24',
    bgcolor = '#1e293b',
    spotcolor = '#10b981'
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = size * scale;
  canvas.height = size * scale;

  // Simple hash function for deterministic randomness
  const hash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const seedHash = hash(seed.toLowerCase());
  
  // Create a pseudo-random number generator based on seed
  let rng = seedHash;
  const random = (): number => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  // Generate the pattern
  const imageData = [];
  const dataWidth = Math.ceil(size / 2);
  
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < dataWidth; x++) {
      row[x] = Math.floor(random() * 2.3);
    }
    imageData[y] = row;
  }

  // Colors array
  const colors = [bgcolor, color, spotcolor];

  // Draw the blocks
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let colorIndex;
      
      if (x < dataWidth) {
        colorIndex = imageData[y][x];
      } else {
        // Mirror the left side
        colorIndex = imageData[y][size - x - 1];
      }
      
      ctx.fillStyle = colors[colorIndex] || bgcolor;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas.toDataURL();
};

// React hook for generating blockies
import { useState, useEffect } from 'react';

export const useBlockies = (address?: string): string => {
  const [blockieUrl, setBlockieUrl] = useState<string>('');

  useEffect(() => {
    if (address) {
      try {
        const url = generateBlockies({
          seed: address.toLowerCase(),
          size: 8,
          scale: 6,
          color: '#fbbf24',
          bgcolor: '#1e293b',
          spotcolor: '#10b981'
        });
        setBlockieUrl(url);
      } catch (error) {
        console.error('Error generating blockies:', error);
        setBlockieUrl('');
      }
    }
  }, [address]);

  return blockieUrl;
};