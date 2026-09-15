import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LeftMenu } from './LeftMenu';
import { Footer } from './Footer';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/token/create': 'Token Creator',
  '/token/list': 'List Tokens',
  '/nft/create': 'Create NFT Collection',
  '/nft/list': 'NFT Collections',
};

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const title = pathname.startsWith('/profile') ? 'Profile' : (titles[pathname] ?? 'Dashboard');
  return (
    <div className="flex min-h-dvh bg-surface">
      <LeftMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} onMenuToggle={() => setMenuOpen((value) => !value)} />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
