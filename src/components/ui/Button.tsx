import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-brand-dark text-white hover:bg-brand-strong',
    secondary: 'border border-brand-dark text-brand-dark hover:bg-field',
    // The design's lighter secondary button; its text contrast on white is 3.3:1.
    outline: 'border border-brand text-brand hover:bg-brand-soft',
    ghost: 'text-ink hover:bg-field',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'min-h-8 px-3 text-xs sm:px-4 sm:text-sm',
    md: 'min-h-9 px-4 text-sm sm:px-6 sm:text-base',
    lg: 'min-h-10 px-5 text-sm sm:min-h-12 sm:px-8 sm:text-base',
  };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
