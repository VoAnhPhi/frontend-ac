import { Icon } from '../ui/Icon';

export function Footer({ landing = false }: { landing?: boolean }) {
  if (landing) {
    return (
      <footer className="flex min-h-[52px] items-center justify-between gap-3 border-t border-border bg-white px-4 text-[11px] text-muted sm:gap-4 sm:px-6 sm:text-xs">
        <div className="flex gap-6">
          <a
            href="#feature-request"
            className="transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none"
          >
            Feature Request
          </a>
          <a
            href="#contact"
            className="transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none"
          >
            Contact Us
          </a>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter / X"
            className="text-brand transition-colors hover:text-brand-dark focus-visible:text-brand-dark focus-visible:outline-none"
          >
            <Icon name="twitter" size={18} />
          </a>
          <a
            href="https://telegram.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="text-brand transition-colors hover:text-brand-dark focus-visible:text-brand-dark focus-visible:outline-none"
          >
            <Icon name="telegram" size={18} />
          </a>
          <a
            href="#documentation"
            aria-label="Documentation"
            className="text-brand-dark hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-brand-dark"
          >
            <Icon name="documentation" size={18} />
          </a>
        </div>
      </footer>
    );
  }
  return (
    <footer className="flex min-h-[52px] items-center justify-between gap-4 border-t border-border bg-white px-4 text-[11px] text-muted sm:px-6 sm:text-xs">
      <span>© {new Date().getFullYear()} ACW3</span>
      <span className="text-right">Tokens &amp; NFT with Ease</span>
    </footer>
  );
}
