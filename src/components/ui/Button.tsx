// src/components/ui/Button.tsx

import { cn } from '../../utils/cn';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, isLoading, variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 rounded font-semibold transition-colors',
        variant === 'primary' && 'bg-blue-600 hover:bg-blue-700 text-white',
        variant === 'secondary' && 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        (isLoading || props.disabled) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
}
