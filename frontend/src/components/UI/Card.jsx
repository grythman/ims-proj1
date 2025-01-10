import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx(
        'bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('px-4 py-5 sm:p-6', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('px-4 pb-5 sm:px-6', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 
      className={clsx('text-lg font-medium text-gray-900', className)} 
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
export { Card, CardHeader, CardContent, CardTitle, CardDescription };