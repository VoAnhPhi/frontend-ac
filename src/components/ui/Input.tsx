import { forwardRef, type InputEvent, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
  numeric?: 'integer' | 'decimal';
  compact?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    requiredMark = false,
    numeric,
    compact = false,
    id,
    className = '',
    onInput,
    ...props
  },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const descriptionId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const sizeClass = compact ? 'h-9 sm:h-11' : 'h-10 sm:h-12';

  function handleNumericInput(event: InputEvent<HTMLInputElement>) {
    if (numeric) {
      const original = event.currentTarget.value;
      const sanitized =
        numeric === 'integer'
          ? original.replace(/\D/g, '')
          : original.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
      if (sanitized !== original) event.currentTarget.value = sanitized;
    }
    onInput?.(event);
  }
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-medium leading-5 sm:text-sm sm:leading-6">
        {requiredMark && (
          <span aria-hidden="true" className="text-red-500">
            *{' '}
          </span>
        )}
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        type={numeric ? 'text' : props.type}
        inputMode={
          numeric === 'integer' ? 'numeric' : numeric === 'decimal' ? 'decimal' : props.inputMode
        }
        pattern={
          numeric === 'integer'
            ? '[0-9]*'
            : numeric === 'decimal'
              ? '[0-9]*[.]?[0-9]*'
              : props.pattern
        }
        required={requiredMark || props.required}
        aria-required={requiredMark || props.required || undefined}
        aria-invalid={!!error}
        aria-describedby={descriptionId}
        onInput={handleNumericInput}
        className={`${sizeClass} w-full rounded-lg border border-transparent bg-field px-2.5 text-xs outline-none placeholder:text-xs placeholder:text-placeholder focus:border-brand-dark focus:ring-1 focus:ring-brand-dark aria-invalid:border-red-500 sm:px-3 sm:text-[13px] sm:placeholder:text-[13px] ${className}`}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="pl-1 text-[11px] leading-4 text-muted sm:pl-2 sm:text-xs"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});
