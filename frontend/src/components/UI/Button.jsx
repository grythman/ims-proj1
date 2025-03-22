import React from 'react';
import clsx from 'clsx';

const Button = ({
  children,
  type = 'button',
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors';
  
  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
    text: 'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
  };
  
  const sizeStyles = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-base px-6 py-3',
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  const combinedClassName = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    disabled && disabledStyles,
    className
  );

  const renderIcon = (position) => {
    if (!Icon) return null;
    
    // Хэрэв Icon нь React Element бол шууд буцаана
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    
    // Хэрэв Icon нь функц бол түүнийг компонент болгон дуудна
    if (typeof Icon === 'function') {
      const IconElement = Icon;
      return <IconElement className={clsx('h-4 w-4', children && (position === 'left' ? 'mr-2' : 'ml-2'))} />;
    }
    
    // Бусад тохиолдолд null буцаана
    return null;
  };
  
  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {iconPosition === 'left' && renderIcon('left')}
      {children}
      {iconPosition === 'right' && renderIcon('right')}
    </button>
  );
};

export { Button }; 