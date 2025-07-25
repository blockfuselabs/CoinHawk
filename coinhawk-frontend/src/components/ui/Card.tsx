import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  glow = false 
}) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${glow ? 'card-glow' : ''} ${className}`}>
      {children}
    </div>
  );
};
