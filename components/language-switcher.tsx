'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from './ui/button';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    localStorage.setItem('preferred-locale', newLocale);
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathnameWithoutLocale || '/'}`);
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('en')}
        className={locale === 'en' ? 'bg-black text-white hover:bg-gray-900' : ''}
      >
        EN
      </Button>
      <Button
        variant={locale === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('es')}
        className={locale === 'es' ? 'bg-black text-white hover:bg-gray-900' : ''}
      >
        ES
      </Button>
    </div>
  );
}
