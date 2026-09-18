import { forwardRef, type TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  counter?: string;
  requiredMark?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, counter, requiredMark = false, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={inputId}
        className="flex items-center justify-between text-xs font-medium leading-5 sm:text-sm sm:leading-6"
      >
        <span>
          {requiredMark && (
            <span aria-hidden="true" className="text-red-500">
              *{' '}
            </span>
          )}
          {label}
        </span>
        {counter && <span className="font-normal text-muted">{counter}</span>}
      </label>
      <textarea
        {...props}
        ref={ref}
        id={inputId}
        required={requiredMark || props.required}
        aria-required={requiredMark || props.required || undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`min-h-24 w-full resize-y rounded-lg border border-border bg-white px-2.5 py-2.5 text-xs placeholder:text-xs outline-none placeholder:text-placeholder focus:border-brand-dark focus:bg-field focus:ring-1 focus:ring-brand-dark aria-invalid:border-red-500 sm:min-h-[120px] sm:px-3 sm:py-3 sm:text-[13px] sm:placeholder:text-[13px] ${className}`}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
