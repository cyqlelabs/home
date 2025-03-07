'use client';

import { type ReactNode } from 'react';
import { useTranslations as useNextIntlTranslations, NextIntlClientProvider } from 'next-intl';
import { getLocaleFromURL } from '@/lib/utils';

export function LanguageProvider({
  children,
  messages,
}: {
  children: ReactNode;
  messages?: Record<string, any>;
}) {
  const locale = getLocaleFromURL();

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

export function useTranslations() {
  return useNextIntlTranslations();
}
