import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Loading } from './components/ui/Loading';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppShell>
        <div className="mx-auto mt-12 max-w-xl space-y-6 rounded-lg bg-white p-8">
          <h2 className="text-2xl font-bold">ACW3 UI components</h2>
          <Input label="Wallet Address" placeholder="0x...." />
          <div className="flex gap-3">
            <Button>Connect</Button>
            <Button variant="secondary">Mint</Button>
          </div>
          <Loading />
        </div>
      </AppShell>
    </BrowserRouter>
  </React.StrictMode>,
);
