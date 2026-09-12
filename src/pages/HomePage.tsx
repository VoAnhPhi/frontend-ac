import { ArrowRightIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16">
      <div className="max-w-2xl">
        <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t('home.description')}
        </p>
        <Button className="mt-7" asChild>
          <Link to="/todos">
            {t('actions.start')}
            <ArrowRightIcon size={18} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
