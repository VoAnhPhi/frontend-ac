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
import { LeaderboardPage } from './pages/LeaderboardPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {/* Keys stop the token and NFT pages from sharing form and dialog state. */}
            <Route path="/token/create" element={<CreatorPage key="token" type="token" />} />
            <Route path="/token/list" element={<AssetsPage key="token" type="token" />} />
            <Route path="/nft/create" element={<CreatorPage key="nft" type="nft" />} />
            <Route path="/nft/list" element={<AssetsPage key="nft" type="nft" />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile/:category" element={<ProfilePage />} />
            <Route path="/profile" element={<Navigate to="/profile/tokens" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
