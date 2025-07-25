import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter, Check } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  description?: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  icon = <Filter className="w-4 h-4" />,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary flex items-center space-x-2 min-w-[120px]"
      >
        {icon}
        <span className="flex-1 text-left truncate">
          {selectedOption?.label || label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-dark-surface border border-dark-border rounded-lg shadow-lg z-50 py-2">
          <div className="px-3 py-2 border-b border-dark-border">
            <h4 className="text-sm font-semibold text-dark-text-primary">{label}</h4>
          </div>
          
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-dark-surface-light transition-colors text-left"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-dark-text-primary">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs bg-dark-surface-light px-2 py-1 rounded-full text-dark-text-muted">
                      {option.count}
                    </span>
                  )}
                </div>
                {option.description && (
                  <div className="text-xs text-dark-text-muted mt-1">
                    {option.description}
                  </div>
                )}
              </div>
              
              {value === option.value && (
                <Check className="w-4 h-4 text-hawk-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
