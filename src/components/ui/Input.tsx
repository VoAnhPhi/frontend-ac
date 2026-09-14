import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, id, className = '', ...props }, ref) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return <div className="flex flex-col gap-1">
    <label htmlFor={inputId} className="text-sm font-medium">{label}</label>
    <input {...props} ref={ref} id={inputId} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} className={`h-[52px] w-full rounded-lg border border-[#ebecec] bg-[#f5fbfb] px-3 text-base outline-none placeholder:text-[#aba8a1] focus:border-brand focus:ring-1 focus:ring-brand aria-invalid:border-red-500 ${className}`} />
    {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">{error}</p>}
  </div>
})
