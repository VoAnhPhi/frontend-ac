import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-9 items-center rounded-full px-3 text-sm transition-colors duration-200 ${isActive ? 'bg-brand font-medium text-white hover:bg-brand-dark' : 'text-ink hover:bg-[#f5fbfb] hover:text-brand-dark'}`;

export function LeftMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const tokenOpen = pathname.startsWith('/token');
  const nftOpen = pathname.startsWith('/nft');
  const profilePage = pathname.startsWith('/profile');
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
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] shrink-0 flex-col justify-between border-r border-[#ebecec] bg-white shadow-xl transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none lg:sticky lg:top-0 lg:z-10 lg:h-dvh lg:w-[208px] lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}
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
                className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-[#f5fbfb]"
              >
                <Icon name="menu-token" size={24} />
                <span>Token</span>
              </NavLink>
              <div
                aria-hidden={!tokenOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${tokenOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="ml-8 space-y-1 border-l border-[#dfe3e3] py-1 pl-2">
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
                className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-[#f5fbfb]"
              >
                <Icon name="menu-nft" size={24} />
                <span>NFT</span>
              </NavLink>
              <div
                aria-hidden={!nftOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${nftOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="ml-8 space-y-1 border-l border-[#dfe3e3] py-1 pl-2">
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
            <span className="size-5 bg-current text-muted transition-colors [mask-image:url('/figma/twitter.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:text-brand-dark" />
            <span>Twitter / X</span>
          </a>
          <a
            href="https://telegram.org/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 transition-colors hover:text-brand-dark"
          >
            <span className="size-5 bg-current text-ink transition-colors [mask-image:url('/figma/telegram.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:text-brand-dark" />
            <span>Telegram</span>
          </a>
        </div>
      </aside>
    </>
  );
}
