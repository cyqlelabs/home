import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://cyqle.in'),
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
      locale: 'en',
      url: 'https://cyqle.in',
      title: 'Cyqle - Collaborative Cloud Browser with AI Automation',
      description:
        "Supercharge your team's workflow with AI-powered automation in a collaborative browser environment",
      siteName: 'Cyqle',
      images: [
        {
          url: '/logo-up.png',
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
      images: ['/logo-up.png'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
