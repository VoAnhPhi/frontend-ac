import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const root = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';

    const firstFocusable =
      dialogRef.current?.querySelector<HTMLElement>('[autofocus]') ??
      dialogRef.current?.querySelector<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled])',
      ) ??
      dialogRef.current?.querySelector<HTMLElement>('button:not([disabled])');
    firstFocusable?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-2 sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`max-h-[calc(100dvh-1rem)] w-full max-w-[500px] overflow-y-auto rounded-xl bg-white p-3 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-6 ${className}`}
      >
        <div className="relative mb-5 flex items-center justify-center">
          <h2 id={titleId} className="text-sm font-bold sm:text-lg">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute right-0 grid size-8 place-items-center rounded-full text-muted hover:bg-surface focus-visible:outline-2 focus-visible:outline-brand-dark"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}
