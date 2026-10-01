import { useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { signInPath } from '../../app/routes';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { Header } from './Header';
import { LeftMenu } from './LeftMenu';
import { Footer } from './Footer';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/token/create': 'Token Creator',
  '/token/list': 'Token List',
  '/nft/create': 'NFT Creator',
  '/nft/list': 'NFT List',
  '/leaderboard': 'Leaderboard',
};

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, search } = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useScrollToTop();
  const title = pathname.startsWith('/profile') ? 'Profile' : (titles[pathname] ?? 'Dashboard');
  if (pathname === '/') {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <Header title="" onMenuToggle={() => undefined} landing />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer landing />
      </div>
    );
  }
  if (pathname === '/leaderboard') {
    return <main className="min-w-0 flex-1">{children}</main>;
  }
  if (!isAuthenticated) {
    return <Navigate to={signInPath} replace state={{ from: pathname + search }} />;
  }
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
