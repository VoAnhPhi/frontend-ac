import { NavLink } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function LeftMenu() {
  return <aside className="flex w-[208px] shrink-0 flex-col justify-between border-r border-[#ebecec] bg-white max-md:w-[72px]">
    <div>
      <NavLink to="/profile" className="flex h-[60px] items-center border-b border-[#ebecec] px-8 text-base font-bold text-brand-dark max-md:justify-center max-md:px-0" aria-label="ACW3 home">AC<span className="max-md:hidden">W3</span></NavLink>
      <nav aria-label="Main navigation" className="space-y-1 px-4 py-4 max-md:px-2">
        <NavLink to="/profile/tokens" className={({ isActive }) => `flex h-10 items-center gap-2 rounded-full px-4 text-sm hover:bg-[#f5fbfb] max-md:justify-center max-md:px-0 ${isActive ? 'bg-[#f5fbfb] font-medium text-brand-dark' : ''}`}><Icon name="menu-token" size={24} /><span className="max-md:hidden">Token</span></NavLink>
        <NavLink to="/profile/nfts" className={({ isActive }) => `flex h-10 items-center gap-2 rounded-full px-4 text-sm hover:bg-[#f5fbfb] max-md:justify-center max-md:px-0 ${isActive ? 'bg-[#f5fbfb] font-medium text-brand-dark' : ''}`}><Icon name="menu-nft" size={24} /><span className="max-md:hidden">NFT</span></NavLink>
      </nav>
    </div>
    <div className="space-y-2 px-8 pb-6 text-sm max-md:px-2">
      <a href="https://x.com/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brand-dark max-md:justify-center"><Icon name="twitter" size={20} /><span className="max-md:hidden">Twitter / X</span></a>
      <a href="https://telegram.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brand-dark max-md:justify-center"><Icon name="telegram" size={20} /><span className="max-md:hidden">Telegram</span></a>
    </div>
  </aside>
}
