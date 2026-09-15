import { useEffect, type ReactNode } from 'react';

export function Dialog({
  title,
  children,
  onClose,
  className = '',
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`max-h-[calc(100dvh-2rem)] w-full max-w-[500px] overflow-y-auto rounded-xl bg-white p-6 shadow-xl ${className}`}
      >
        <div className="relative mb-5 flex items-center justify-center">
          <h2 id="dialog-title" className="text-lg font-bold">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute right-0 grid size-8 place-items-center rounded-full text-xl text-muted hover:bg-surface"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
