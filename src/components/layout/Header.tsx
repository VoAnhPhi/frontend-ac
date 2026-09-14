import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function Header({ title = 'Profile' }: { title?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="relative z-10 flex h-[60px] items-center justify-between border-b border-[#ebecec] bg-white pl-6 pr-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <div className="relative">
      <button type="button" aria-expanded={menuOpen} aria-haspopup="menu" aria-label="Account menu" onClick={() => setMenuOpen(value => !value)} className="flex items-center gap-2 rounded-lg p-2 text-left hover:bg-[#f5fbfb] focus-visible:outline-2 focus-visible:outline-brand">
        <Icon name="header-avatar" size={32} />
        <span className="hidden text-xs leading-[18px] sm:block"><span className="block font-medium">0x4aq...gfr6j5lda</span><span className="text-muted">200 ZKN</span></span>
        <Icon name="chevron" size={16} className={menuOpen ? 'rotate-180' : ''} />
      </button>
      {menuOpen && <div role="menu" className="absolute right-0 top-full w-[199px] overflow-hidden rounded-lg border border-[#ebecec] bg-white shadow-md">
        <Link role="menuitem" to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 bg-[#f5fbfb] px-4 py-2 hover:bg-[#e8f5f4]"><Icon name="profile" size={24} />Profile</Link>
        <button role="menuitem" type="button" onClick={() => setMenuOpen(false)} className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[#f5fbfb]"><Icon name="logout" size={24} />Log out</button>
      </div>}
    </div>
  </header>
}
