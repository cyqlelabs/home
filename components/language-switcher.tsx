'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from './ui/button';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Refresh the page to apply new locale
    router.refresh();
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('en')}
        className={locale === 'en' ? 'bg-purple-600 hover:bg-purple-700' : ''}
      >
        EN
      </Button>
      <Button
        variant={locale === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('es')}
        className={locale === 'es' ? 'bg-purple-600 hover:bg-purple-700' : ''}
      >
        ES
      </Button>
    </div>
  );
}
