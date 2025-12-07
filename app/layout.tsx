import type { ReactNode } from 'react';

import './globals.css';
import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import {
  formatDetection,
  languageAlternates,
  robotsConfig,
  siteIcons,
  siteMetadata,
} from '@/lib/site-metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.name}`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  applicationName: siteMetadata.name,
  authors: [{ name: siteMetadata.name }],
  creator: siteMetadata.name,
  publisher: siteMetadata.name,
  category: 'technology',
  formatDetection,
  alternates: {
    canonical: '/',
    languages: languageAlternates,
  },
  icons: siteIcons,
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.name,
    title: siteMetadata.title,
    description: siteMetadata.description,
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
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialImage],
  },
  robots: robotsConfig,
  themeColor: siteMetadata.themeColor,
  other: {
    'og:logo': '/logo-up.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteMetadata.defaultLocale} className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
