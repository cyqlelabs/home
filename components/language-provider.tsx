'use client';

import { type ReactNode } from 'react';
import { useTranslations as useNextIntlTranslations, NextIntlClientProvider } from 'next-intl';
import { getLocaleFromCookie } from '@/lib/utils';

export function LanguageProvider({
  children,
  messages,
  locale: serverLocale,
}: {
  children: ReactNode;
  messages?: Record<string, any>;
  locale?: string;
}) {
  const clientLocale = getLocaleFromCookie();
  const locale = serverLocale || clientLocale;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

export function useTranslations() {
  return useNextIntlTranslations();
}
