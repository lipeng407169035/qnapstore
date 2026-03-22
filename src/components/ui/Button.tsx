import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'blue' | 'outline' | 'ghost' | 'outline-blue';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap',
          {
            'bg-orange text-white hover:bg-orange-dark hover:-translate-y-0.5': variant === 'primary',
            'bg-blue text-white hover:bg-blue-dark hover:-translate-y-0.5': variant === 'blue',
            'bg-transparent text-white border-2 border-white/60 hover:border-white hover:bg-white/10': variant === 'outline',
            'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50': variant === 'ghost',
            'bg-transparent text-blue border border-blue hover:bg-blue-light': variant === 'outline-blue',
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-8 py-3.5 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
