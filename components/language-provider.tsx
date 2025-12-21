'use client';

import { type ReactNode } from 'react';
import { useTranslations as useNextIntlTranslations, NextIntlClientProvider } from 'next-intl';

export function LanguageProvider({
  children,
  messages,
  locale,
}: {
  children: ReactNode;
  messages?: Record<string, any>;
  locale: string;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

export function useTranslations() {
  return useNextIntlTranslations();
}
