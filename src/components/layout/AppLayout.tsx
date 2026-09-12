import { MoonIcon, SunIcon, TranslateIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = async () => {
    const language = i18n.language === 'en' ? 'vi' : 'en';
    await i18n.changeLanguage(language);
    window.localStorage.setItem('taskflow.language', language);
    document.documentElement.lang = language;
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <NavLink to="/" className="mr-auto text-lg font-bold tracking-tight">
            {t('appName')}
          </NavLink>
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            {[
              { to: '/', label: t('nav.home'), end: true },
              { to: '/todos', label: t('nav.todos'), end: false },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1 border-l border-border pl-3">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={t('accessibility.language')}
              title={t('accessibility.language')}
              onClick={changeLanguage}
            >
              <TranslateIcon size={19} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={t('accessibility.theme')}
              title={t('accessibility.theme')}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <SunIcon size={19} /> : <MoonIcon size={19} />}
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
