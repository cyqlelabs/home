import React from 'react';
import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { LanguageProvider } from '@/components/language-provider';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateMetadata({ params: { locale } }: Omit<Props, 'children'>) {
  return {
    title: {
      template: '%s | Cyqle',
      default: 'Cyqle - Collaborative Cloud Browser with AI Automation',
    },
    description:
      "Supercharge your team's workflow with AI-powered automation in a collaborative browser environment",
  };
}

const locales = ['en', 'es'];

export default async function RootLayout({ children, params: { locale } }: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations('metadata');

  // Get messages for client-side
  const messages = (await import(`../../messages/${locale}/index.json`)).default;

  return (
    <html lang={locale} className="dark">
      <head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider messages={messages}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
