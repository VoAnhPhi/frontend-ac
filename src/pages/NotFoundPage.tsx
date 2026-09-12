import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-start justify-center px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">{t('notFound.title')}</h1>
      <Button className="mt-6" asChild>
        <Link to="/">{t('notFound.back')}</Link>
      </Button>
    </section>
  );
}
