import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export function Header({ title, onMenuToggle }: { title: string; onMenuToggle: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-[#ebecec] bg-white px-3 sm:pl-6 sm:pr-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuToggle}
          className="grid size-9 place-items-center rounded-lg text-xl hover:bg-[#f5fbfb] lg:hidden"
          aria-label="Open navigation"
        >
          ☰
        </button>
        <h1 className="truncate text-lg font-bold sm:text-2xl">{title}</h1>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Account menu"
          onClick={() => setMenuOpen((value) => !value)}
          className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-[#f5fbfb] focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Icon name="header-avatar" size={32} />
          <span className="hidden text-xs leading-[18px] sm:block">
            <span className="block font-medium">0x4aq...gfr6j5lda</span>
            <span className="text-muted">200 ZKN</span>
          </span>
          <Icon name="chevron" className={menuOpen ? 'rotate-180' : ''} />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+1px)] w-[199px] overflow-hidden rounded-lg border border-[#ebecec] bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,.08)]"
          >
            <Link
              role="menuitem"
              to="/profile/tokens"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 items-center gap-2 bg-[#f5fbfb] px-4 text-sm hover:bg-[#e8f5f4]"
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
