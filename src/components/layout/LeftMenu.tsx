import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-9 items-center rounded-full px-3 text-sm transition-colors duration-200 ${isActive ? 'bg-brand-dark font-medium text-white hover:bg-brand-strong' : 'text-ink hover:bg-field hover:text-brand-dark'}`;

export function LeftMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const tokenOpen = pathname.startsWith('/token');
  const nftOpen = pathname.startsWith('/nft');
  const profilePage = pathname.startsWith('/profile');
  const interactive = open || desktop;

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!open || desktop) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [desktop, onClose, open]);
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        inert={!interactive}
        aria-hidden={!interactive}
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] shrink-0 flex-col justify-between border-r border-border bg-white shadow-xl transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none lg:sticky lg:top-0 lg:z-10 lg:h-dvh lg:w-[208px] lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <NavLink
            to="/"
            onClick={onClose}
            className="flex h-[60px] items-center border-b border-border px-8 text-base font-bold text-brand-dark"
            aria-label="ACW3 dashboard"
          >
            ACW3
          </NavLink>
          <nav aria-label="Main navigation" className="space-y-3 px-4 py-4">
            {!profilePage && (
              <NavLink to="/" end onClick={onClose} className={linkClass}>
                <Icon name="home" size={20} className="mr-2" />
                Dashboard
              </NavLink>
            )}
            <section>
              <NavLink
                to={profilePage ? '/profile/tokens' : '/token/create'}
                onClick={onClose}
                className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-field"
              >
                <Icon name="menu-token" size={24} />
                <span>Token</span>
              </NavLink>
              <div
                aria-hidden={!tokenOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${tokenOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="ml-8 space-y-1 border-l border-border py-1 pl-2">
                    <NavLink
                      to="/token/create"
                      onClick={onClose}
                      className={linkClass}
                      tabIndex={tokenOpen ? 0 : -1}
                    >
                      Token Creator
                    </NavLink>
                    <NavLink
                      to="/token/list"
                      onClick={onClose}
                      className={linkClass}
                      tabIndex={tokenOpen ? 0 : -1}
                    >
                      Token List
                    </NavLink>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <NavLink
                to={profilePage ? '/profile/nfts' : '/nft/create'}
                onClick={onClose}
                className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-field"
              >
                <Icon name="menu-nft" size={24} />
                <span>NFT</span>
              </NavLink>
              <div
                aria-hidden={!nftOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${nftOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="ml-8 space-y-1 border-l border-border py-1 pl-2">
                    <NavLink
                      to="/nft/create"
                      onClick={onClose}
                      className={linkClass}
                      tabIndex={nftOpen ? 0 : -1}
                    >
                      NFT Creator
                    </NavLink>
                    <NavLink
                      to="/nft/list"
                      onClick={onClose}
                      className={linkClass}
                      tabIndex={nftOpen ? 0 : -1}
                    >
                      NFT List
                    </NavLink>
                  </div>
                </div>
              </div>
            </section>
          </nav>
        </div>
        <div className="space-y-2 px-8 pb-6 text-sm">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 transition-colors hover:text-brand-dark"
          >
            <Icon
              name="twitter"
              size={20}
              className="text-muted transition-colors group-hover:text-brand-dark"
            />
            <span>Twitter / X</span>
          </a>
          <a
            href="https://telegram.org/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 transition-colors hover:text-brand-dark"
          >
            <Icon
              name="telegram"
              size={20}
              className="text-ink transition-colors group-hover:text-brand-dark"
            />
            <span>Telegram</span>
          </a>
        </div>
      </aside>
    </>
  );
}
