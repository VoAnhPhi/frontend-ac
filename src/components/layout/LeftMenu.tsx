import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-9 items-center rounded-lg px-3 text-sm transition-colors hover:bg-[#f5fbfb] ${isActive ? 'bg-[#f5fbfb] font-medium text-brand-dark' : 'text-ink'}`;

export function LeftMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 lg:hidden ${open ? 'block' : 'hidden'}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] shrink-0 flex-col justify-between border-r border-[#ebecec] bg-white transition-transform lg:sticky lg:top-0 lg:z-10 lg:h-dvh lg:w-[208px] lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <NavLink
            to="/"
            onClick={onClose}
            className="flex h-[60px] items-center border-b border-[#ebecec] px-8 text-base font-bold text-brand-dark"
            aria-label="ACW3 dashboard"
          >
            ACW3
          </NavLink>
          <nav aria-label="Main navigation" className="space-y-5 px-4 py-4">
            <NavLink to="/" end onClick={onClose} className={linkClass}>
              Dashboard
            </NavLink>
            <section>
              <div className="mb-1 flex h-10 items-center gap-2 px-3 text-sm font-medium">
                <Icon name="menu-token" size={24} />
                <span>Token</span>
              </div>
              <div className="ml-8 space-y-1 border-l border-[#ebecec] pl-2">
                <NavLink to="/token/create" onClick={onClose} className={linkClass}>
                  Token Creator
                </NavLink>
                <NavLink to="/token/list" onClick={onClose} className={linkClass}>
                  Token List
                </NavLink>
              </div>
            </section>
            <section>
              <div className="mb-1 flex h-10 items-center gap-2 px-3 text-sm font-medium">
                <Icon name="menu-nft" size={24} />
                <span>NFT</span>
              </div>
              <div className="ml-8 space-y-1 border-l border-[#ebecec] pl-2">
                <NavLink to="/nft/create" onClick={onClose} className={linkClass}>
                  NFT Creator
                </NavLink>
                <NavLink to="/nft/list" onClick={onClose} className={linkClass}>
                  NFT List
                </NavLink>
              </div>
            </section>
          </nav>
        </div>
        <div className="space-y-2 px-8 pb-6 text-sm">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 hover:text-brand-dark"
          >
            <Icon name="twitter" size={20} />
            <span>Twitter / X</span>
          </a>
          <a
            href="https://telegram.org/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 hover:text-brand-dark"
          >
            <Icon name="telegram" size={20} />
            <span>Telegram</span>
          </a>
        </div>
      </aside>
    </>
  );
}
