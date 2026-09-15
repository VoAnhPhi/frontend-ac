import { Icon } from '../ui/Icon';

export function Footer({ landing = false }: { landing?: boolean }) {
  if (landing) {
    return (
      <footer className="flex min-h-[52px] items-center justify-between gap-4 border-t border-[#ebecec] bg-white px-6 text-xs text-muted">
        <div className="flex gap-6">
          <a href="#feature-request">Feature Request</a>
          <a href="#contact">Contact Us</a>
        </div>
        <div className="flex items-center gap-6">
          <Icon name="twitter" size={18} />
          <Icon name="telegram" size={18} />
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
