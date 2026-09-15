import { forwardRef, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, requiredMark = false, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium leading-6">
        {requiredMark && <span aria-hidden="true">* </span>}
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`h-[52px] w-full rounded-lg border border-transparent bg-[#f5fbfb] px-3 text-base outline-none placeholder:text-[#aba8a1] focus:border-brand focus:ring-1 focus:ring-brand aria-invalid:border-red-500 ${className}`}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="pl-2 text-xs leading-4 text-muted">{hint}</p>
      ) : null}
    </div>
  );
});
