import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { store } from './app/store';
import { AppShell } from './components/layout/AppShell';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { CreatorPage } from './pages/CreatorPage';
import { AssetsPage } from './pages/AssetsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/token/create" element={<CreatorPage type="token" />} />
            <Route path="/token/list" element={<AssetsPage type="token" />} />
            <Route path="/nft/create" element={<CreatorPage type="nft" />} />
            <Route path="/nft/list" element={<AssetsPage type="nft" />} />
            <Route path="/profile/:category" element={<ProfilePage />} />
            <Route path="/profile" element={<Navigate to="/profile/tokens" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
