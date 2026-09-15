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
        className="flex items-center justify-between text-sm font-medium leading-6"
      >
        <span>
          {requiredMark && <span aria-hidden="true">* </span>}
          {label}
        </span>
        {counter && <span className="font-normal text-muted">{counter}</span>}
      </label>
      <textarea
        {...props}
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        className={`min-h-[120px] w-full resize-y rounded-lg border border-[#ebecec] bg-white px-3 py-3 text-base outline-none placeholder:text-[#aba8a1] focus:border-brand focus:bg-[#f5fbfb] focus:ring-1 focus:ring-brand aria-invalid:border-red-500 ${className}`}
      />
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
