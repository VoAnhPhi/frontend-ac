import { useState } from 'react';
import { Icon } from './Icon';

/**
 * Copies `value` to the clipboard. `compact` takes 16px in the layout, as an inline icon,
 * while its negative margin keeps a 24px target to click.
 */
export function CopyButton({
  value,
  label,
  compact = false,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        title={copied ? 'Copied' : label}
        className={`grid place-items-center rounded hover:bg-surface focus-visible:outline-2 focus-visible:outline-brand-dark ${compact ? '-m-1 size-6 text-muted' : 'size-7'}`}
      >
        <Icon name="copy" size={16} />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </span>
  );
}
