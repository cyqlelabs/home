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
    keywords: 'collaborative browser, AI automation, team workflow, cloud browser, productivity',
    authors: [{ name: 'Cyqle Team' }],
    creator: 'Cyqle',
    publisher: 'Cyqle',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon/favicon.ico' },
      ],
      apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'mask-icon',
          url: '/favicon/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      ],
    },
    manifest: '/favicon/site.webmanifest',
    openGraph: {
      type: 'website',
      locale,
      url: 'https://cyqle.in',
      title: 'Cyqle - Collaborative Cloud Browser with AI Automation',
      description:
        "Supercharge your team's workflow with AI-powered automation in a collaborative browser environment",
      siteName: 'Cyqle',
      images: [
        {
          url: '/favicon/android-chrome-192x192.png',
          width: 1200,
          height: 630,
          alt: 'Cyqle - Collaborative Cloud Browser with AI Automation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cyqle - Collaborative Cloud Browser with AI Automation',
      description:
        "Supercharge your team's workflow with AI-powered automation in a collaborative browser environment",
      images: ['/favicon/android-chrome-192x192.png'],
      creator: '@cyqle',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      yahoo: 'yahoo-site-verification-code',
    },
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
  const messages = (await import(`../../i18n/messages/${locale}/index.json`)).default;

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
