import type { ReactNode } from 'react';

import '../globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import SchemaJsonLd from '@/components/schema-jsonld';
import {
  formatDetection,
  robotsConfig,
  siteIcons,
  siteMetadata,
  type SiteLocale,
} from '@/lib/site-metadata';

const inter = localFont({
  src: [
    { path: '../../public/fonts/inter-latin.woff2', weight: '100 900', style: 'normal' },
    { path: '../../public/fonts/inter-latin-ext.woff2', weight: '100 900', style: 'normal' },
  ],
  display: 'swap',
});

type Props = {
  children: ReactNode;
  params: { locale: string };
};

const isSupportedLocale = (value: string): value is SiteLocale =>
  siteMetadata.locales.includes(value as SiteLocale);

export async function generateMetadata({
  params: { locale },
}: Omit<Props, 'children'>): Promise<Metadata> {
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'metadata' });
  const localeTag = locale === 'es' ? 'es_ES' : 'en_US';
  const rootPath = `/${locale}/`;

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      template: `${siteMetadata.name} | %s`,
      default: t('title'),
    },
    description: t('description'),
    keywords: siteMetadata.keywords,
    applicationName: siteMetadata.name,
    authors: [{ name: siteMetadata.name }],
    creator: siteMetadata.name,
    publisher: siteMetadata.name,
    category: 'technology',
    formatDetection,
    icons: siteIcons,
    manifest: '/favicon/site.webmanifest',
    openGraph: {
      type: 'website',
      locale: localeTag,
      url: new URL(rootPath, siteMetadata.siteUrl).toString(),
      siteName: siteMetadata.name,
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: siteMetadata.socialImage,
          width: 1200,
          height: 630,
          alt: `${siteMetadata.name} social preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteMetadata.twitter,
      creator: siteMetadata.twitter,
      title: t('title'),
      description: t('description'),
      images: [siteMetadata.socialImage],
    },
    robots: robotsConfig,
    other: {
      'og:logo': '/logo-up.png',
    },
  };
}

export function generateViewport() {
  return {
    themeColor: siteMetadata.themeColor,
  };
}

export default async function RootLayout({ children, params: { locale } }: Props) {
  if (!isSupportedLocale(locale)) notFound();

  unstable_setRequestLocale(locale);

  const messages = (await import(`../../i18n/messages/${locale}/index.json`)).default;

  return (
    <html lang={locale} className="dark">
      <body className={inter.className}>
        <SchemaJsonLd />
        <ThemeProvider>
          <LanguageProvider messages={messages} locale={locale}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
