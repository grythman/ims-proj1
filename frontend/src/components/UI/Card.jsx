import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div 
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-50',
        hover && 'hover:shadow-sm hover:border-gray-100',
        'transition-all duration-200 ease-in-out',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, bordered = false, ...props }) => {
  return (
    <div 
      className={clsx(
        'px-4 py-3',
        bordered && 'border-b border-gray-50',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('px-4 py-3', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, bordered = false, ...props }) => {
  return (
    <div 
      className={clsx(
        'px-4 py-3',
        bordered && 'border-t border-gray-50',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 
      className={clsx('text-base font-medium text-gray-800', className)} 
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className, ...props }) => {
  return (
    <p 
      className={clsx('mt-1 text-sm text-gray-500', className)} 
      {...props}
    >
      {children}
    </p>
  );
};

// Single export statement
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };