'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select({ 
  value, 
  onChange, 
  options, 
  placeholder = "Выберите опцию", 
  disabled = false,
  className = ""
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-[#242424] border-0 rounded-lg text-white text-left
          focus:outline-none focus:ring-2 focus:ring-white/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? 'ring-2 ring-white/20' : ''}
        `}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icons.ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#242424] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-3 text-left hover:bg-[#363636] transition-colors
                ${value === option.value ? 'bg-[#363636] text-white' : 'text-gray-300'}
                first:rounded-t-lg last:rounded-b-lg
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


