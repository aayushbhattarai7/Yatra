import React from 'react';

type BadgeVariant = 'default' | 'outline' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-blue-100 text-blue-800',
  outline: 'bg-transparent border border-gray-300 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};

export const Badge = ({ 
  variant = 'default', 
  children, 
  className = '' 
}: BadgeProps) => {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};