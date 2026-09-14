import type { ReactNode } from 'react'
import { Header } from './Header'
import { LeftMenu } from './LeftMenu'
import { Footer } from './Footer'

export function AppShell({ children, title = 'Profile', showFooter = false }: { children: ReactNode; title?: string; showFooter?: boolean }) {
  return <div className="flex min-h-screen"><LeftMenu /><div className="flex min-w-0 flex-1 flex-col"><Header title={title} /><main className="flex-1">{children}</main>{showFooter && <Footer />}</div></div>
}
