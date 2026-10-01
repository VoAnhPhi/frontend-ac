import { forwardRef, useEffect, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { Icon } from './Icon';

type ImageUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  hint: string;
  error?: string;
  requiredMark?: boolean;
};

/**
 * A file input styled as a drop zone; the native input stays visually hidden. Once a file is
 * chosen, the zone shows it, so the user can see what will be uploaded.
 */
export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(function ImageUpload(
  { label, hint, error, requiredMark = false, id, onChange, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);

  // Each preview URL holds the file in memory until it is revoked.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setPreview(file ? { url: URL.createObjectURL(file), name: file.name } : null);
    onChange?.(event);
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium leading-6">
        {requiredMark && (
          <span aria-hidden="true" className="text-red-500">
            *{' '}
          </span>
        )}
        {label}
      </label>
      <label className="flex h-[112px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#abe0dd] bg-field p-4 text-center text-xs text-muted transition-colors hover:border-brand-dark hover:bg-brand-soft sm:h-[120px] sm:text-sm">
        {preview ? (
          <>
            {/* 40px keeps the preview and both lines inside the zone's height on every breakpoint. */}
            <img
              src={preview.url}
              alt=""
              className="size-10 shrink-0 rounded-full bg-white object-cover"
            />
            <span className="mt-1 max-w-full shrink-0 truncate text-ink" title={preview.name}>
              {preview.name}
            </span>
            <span className="shrink-0 text-xs">Choose another image</span>
          </>
        ) : (
          <>
            <Icon name="plus" size={22} className="text-brand-dark" />
            <span className="mt-1 text-ink">Choose an image to upload</span>
            <span className="text-xs">{hint}</span>
          </>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="file"
          onChange={handleChange}
          className="sr-only"
          aria-required={requiredMark || undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </label>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
