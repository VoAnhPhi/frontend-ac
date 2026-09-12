import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from '@/App';
import { store } from '@/app/store';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/i18n';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster position="bottom-right" richColors closeButton />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
