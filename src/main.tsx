import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from './components/ui/Button'
import { Input } from './components/ui/Input'
import { Loading } from './components/ui/Loading'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><main className="mx-auto mt-12 max-w-xl space-y-6 rounded-lg bg-white p-8"><h1 className="text-2xl font-bold">ACW3 UI components</h1><Input label="Wallet Address" placeholder="0x...." /><div className="flex gap-3"><Button>Connect</Button><Button variant="secondary">Mint</Button></div><Loading /></main></React.StrictMode>)
