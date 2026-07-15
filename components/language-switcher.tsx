'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useTranslations } from '@/components/language-provider';
import { siteMetadata, type SiteLocale } from '@/lib/site-metadata';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const languages: Record<SiteLocale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇧🇷' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  uk: { name: 'Українська', flag: '🇺🇦' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const switchLocale = (newLocale: string) => {
    localStorage.setItem('preferred-locale', newLocale);
    const pathnameWithoutLocale = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '');
    router.push(`/${newLocale}${pathnameWithoutLocale || '/'}`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('navbar.changeLanguage')}
          className="gap-1.5 px-2.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider">{locale}</span>
          <ChevronDown className="h-3 w-3 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[11rem] border-white/10 bg-black/95 backdrop-blur-md"
      >
        {[...siteMetadata.locales]
          .sort((a, b) => languages[a].name.localeCompare(languages[b].name))
          .map((code) => (
            <DropdownMenuItem
              key={code}
              onClick={() => switchLocale(code)}
              className={`cursor-pointer gap-3 py-2 focus:bg-white/10 focus:text-white ${
                code === locale ? 'text-white' : 'text-slate-300'
              }`}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {languages[code].flag}
              </span>
              <span className="flex-1">{languages[code].name}</span>
              {code === locale && <Check className="h-4 w-4 text-blue-400" aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
