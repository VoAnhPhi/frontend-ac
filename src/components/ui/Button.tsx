import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', disabled, children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'border border-brand text-brand hover:bg-[#f5fbfb]',
    ghost: 'text-ink hover:bg-[#f5fbfb]',
  }
  return <button {...props} disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${size === 'sm' ? 'min-h-8 px-4 text-sm' : 'min-h-[38px] px-8 text-base'} ${variants[variant]} ${className}`}>
    {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />}
    {children}
  </button>
}
