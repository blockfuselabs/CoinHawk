import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  suggestions?: Array<{
    id: string;
    name: string;
    symbol: string;
    image?: string;
  }>;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search coins, symbols, or addresses...",
  value,
  onChange,
  onSearch,
  suggestions = [],
  loading = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    onChange(suggestion.symbol);
    setShowSuggestions(false);
    onSearch?.(suggestion.symbol);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    setShowSuggestions(isFocused && value.length > 0 && suggestions.length > 0);
  }, [isFocused, value, suggestions.length]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`input input-search w-full transition-all duration-200 ${
            isFocused ? 'ring-2 ring-hawk-accent/20 border-hawk-accent/50' : ''
          }`}
        />
        
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="loading-spinner w-4 h-4"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface border border-dark-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-surface-light transition-colors text-left"
            >
              {suggestion.image ? (
                <img 
                  src={suggestion.image} 
                  alt={suggestion.name}
                  className="w-8 h-8 rounded-full bg-dark-surface-light"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-dark-surface-light flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-dark-text-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-dark-text-primary truncate">
                  {suggestion.name}
                </div>
                <div className="text-sm text-dark-text-muted">
                  {suggestion.symbol.toUpperCase()}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};