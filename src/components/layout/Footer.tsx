export function Footer({ landing = false }: { landing?: boolean }) {
  if (landing) {
    return (
      <footer className="flex min-h-[52px] items-center justify-between gap-4 border-t border-[#ebecec] bg-white px-6 text-xs text-muted">
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
            <span className="block size-[18px] bg-current [mask-image:url('/figma/twitter.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </a>
          <a
            href="https://telegram.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="text-brand transition-colors hover:text-brand-dark focus-visible:text-brand-dark focus-visible:outline-none"
          >
            <span className="block size-[18px] bg-current [mask-image:url('/figma/telegram.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </a>
          <span aria-label="Documentation" className="text-lg">
            ▧
          </span>
        </div>
      </footer>
    );
  }
  return (
    <footer className="flex min-h-[52px] items-center justify-between gap-4 border-t border-[#ebecec] bg-white px-4 text-xs text-muted sm:px-6">
      <span>© {new Date().getFullYear()} ACW3</span>
      <span className="text-right">Tokens &amp; NFT with Ease</span>
    </footer>
  );
}
