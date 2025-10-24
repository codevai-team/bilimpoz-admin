'use client';

import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ text, children, position = 'bottom' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full right-0 mb-2',
    bottom: 'top-full right-0 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5'
  };

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && text && (
        <div className={`absolute z-[9999] pointer-events-none ${positionClasses[position]}`}>
          {/* Треугольный указатель */}
          {position === 'bottom' && (
            <div 
              className="absolute -top-1 right-3"
              style={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '5px solid #404040'
              }}
            >
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-[1px]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '4px solid #151515'
                }}
              />
            </div>
          )}
          {/* Блок подсказки */}
          <div 
            className="px-2 py-1 text-xs text-white rounded-md whitespace-nowrap"
            style={{
              backgroundColor: '#151515',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              border: '1px solid #404040'
            }}
          >
            {text}
          </div>
        </div>
      )}
    </div>
  );
}
