import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { formatAddress, wallet } from '../../features/profile/data';

export function Header({
  title,
  onMenuToggle,
  landing = false,
}: {
  title: string;
  onMenuToggle: () => void;
  landing?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  if (landing) {
    return (
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:h-[60px] sm:px-6">
        <Link to="/" className="font-bold text-brand-dark">
          ACW3
        </Link>
        <Link
          to="/?dialog=register"
          className="min-w-[112px] rounded-full bg-brand-dark px-5 py-2 text-center text-sm font-medium text-white hover:bg-brand-strong sm:min-w-[124px]"
        >
          Connect
        </Link>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center justify-between border-b border-border bg-white px-3 sm:h-[60px] sm:pl-6 sm:pr-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuToggle}
          className="grid size-9 place-items-center rounded-lg hover:bg-field focus-visible:outline-2 focus-visible:outline-brand-dark lg:hidden"
          aria-label="Open navigation"
        >
          <Icon name="menu" size={22} />
        </button>
        <h1 className="truncate text-base font-bold sm:text-xl lg:text-2xl">{title}</h1>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Account menu"
          onClick={() => setMenuOpen((value) => !value)}
          className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-field focus-visible:outline-2 focus-visible:outline-brand-dark"
        >
          <Icon name="header-avatar" size={32} />
          <span className="hidden text-xs leading-[18px] sm:block">
            <span className="block font-medium">{formatAddress(wallet.address)}</span>
            <span className="text-muted">
              {wallet.balance} {wallet.symbol}
            </span>
          </span>
          <Icon name="chevron" className={menuOpen ? 'rotate-180' : ''} />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+1px)] w-[199px] overflow-hidden rounded-lg border border-border bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,.08)]"
          >
            <Link
              role="menuitem"
              to="/profile/tokens"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 items-center gap-2 bg-field px-4 text-sm hover:bg-brand-soft"
            >
              <span className="grid size-6 place-items-center">
                <Icon name="profile" />
              </span>
              Profile
            </Link>
            <button
              role="menuitem"
              type="button"
              disabled
              title="Authentication is not connected yet"
              className="flex h-10 w-full cursor-not-allowed items-center gap-2 px-4 text-left text-sm opacity-60"
            >
              <span className="grid size-6 place-items-center">
                <Icon name="logout" />
              </span>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
