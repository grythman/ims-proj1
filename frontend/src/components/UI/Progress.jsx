import React from 'react';
import clsx from 'clsx';

const Progress = ({ 
  value, 
  max = 100, 
  className,
  color = 'emerald',
  size = 'md',
  showValue = false,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="relative">
      <div 
        className={clsx(
          'bg-gray-200 rounded-full overflow-hidden',
          sizes[size],
          className
        )} 
        {...props}
      >
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-in-out',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="absolute right-0 -top-6 text-sm text-gray-600">
          {percentage}%
        </span>
      )}
    </div>
  );
};

export default Progress;