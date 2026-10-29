import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'kesari' | 'ghost' | 'danger';
  size?: 'default' | 'small';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-center';

  const sizeClasses = size === 'small' 
    ? 'min-h-[36px] px-3 py-1.5 text-sm' 
    : 'min-h-[44px] px-5 py-2.5 text-base';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-navy text-on-navy hover:bg-[#081e3f] border border-transparent';
      break;
    case 'secondary':
      variantClasses = 'bg-surface text-navy border border-navy hover:bg-[#f0f4fa]';
      break;
    case 'kesari':
      variantClasses = 'bg-kesari text-ink hover:bg-[#d67b07] border border-transparent font-semibold shadow-sm';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-navy hover:bg-black/5 border border-transparent';
      break;
    case 'danger':
      variantClasses = 'bg-[#B3321F] text-white hover:bg-[#992817] border border-transparent';
      break;
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
