import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  link: 'text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm',
  info: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm leading-4',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  as: Component = 'button',
  href,
  to,
  ...props
}) => {
  // Determine the component to render
  const ButtonComponent = to ? Link : href ? 'a' : Component;

  // Handle loading state
  const isLoading = loading || props.isLoading;

  // Combine all props
  const buttonProps = {
    ...(to ? { to } : {}),
    ...(href ? { href } : {}),
    className: clsx(
      'relative inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rounded-md',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    ),
    disabled: disabled || isLoading,
    ...props,
  };

  const iconClassName = clsx(
    iconSizes[size],
    children && (iconPosition === 'left' ? 'mr-2' : 'ml-2')
  );

  return (
    <ButtonComponent {...buttonProps}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-md">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
      <span className={clsx('flex items-center', isLoading && 'opacity-0')}>
        {Icon && iconPosition === 'left' && (
          <Icon className={iconClassName} aria-hidden="true" />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={iconClassName} aria-hidden="true" />
        )}
      </span>
    </ButtonComponent>
  );
};

export { Button };
export default Button; 