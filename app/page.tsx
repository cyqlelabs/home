'use client';

import { useEffect } from 'react';
import { siteMetadata } from '@/lib/site-metadata';

function getPreferredLocale(): string {
  const { locales, defaultLocale } = siteMetadata;
  const supported = locales as readonly string[];

  try {
    const stored = localStorage.getItem('preferred-locale');
    if (stored && supported.includes(stored)) {
      return stored;
    }
  } catch {}

  const languages: readonly string[] =
    navigator.languages ?? [navigator.language || (navigator as any).userLanguage].filter(Boolean);

  for (const lang of languages) {
    const prefix = lang.split('-')[0].toLowerCase();
    if (supported.includes(prefix)) {
      return prefix;
    }
  }

  return defaultLocale;
}

export default function RootPage() {
  useEffect(() => {
    const locale = getPreferredLocale();
    window.location.replace(`/${locale}/`);
  }, []);

  return null;
}
