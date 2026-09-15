export function Footer() {
  return (
    <footer className="flex min-h-[52px] items-center justify-between gap-4 border-t border-[#ebecec] bg-white px-4 text-xs text-muted sm:px-6">
      <span>© {new Date().getFullYear()} ACW3</span>
      <span className="text-right">Tokens &amp; NFT with Ease</span>
    </footer>
  );
}
