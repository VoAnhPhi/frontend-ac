import { useState } from 'react';
import { Icon } from './Icon';

export function CopyAddressButton({ address, label }: { address: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
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
        onClick={copyAddress}
        aria-label={`Copy address for ${label}`}
        title={copied ? 'Copied' : 'Copy address'}
        className="grid size-7 place-items-center rounded hover:bg-surface focus-visible:outline-2 focus-visible:outline-brand-dark"
      >
        <Icon name="copy" size={16} />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Address copied' : ''}
      </span>
    </span>
  );
}
