import './globals.css';
import { Inter } from 'next/font/google';
import { type Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cyqle',
  description: 'The Collaborative Smart Browser',
  openGraph: {
    locale: 'en_US',
    url: 'https://cyqle.in',
    type: 'website',
    images: [
      {
        url: 'https://cyqle.in/logo-up.png',
        width: 768,
        height: 768,
        alt: 'Cyqle Logo',
      },
    ],
  },
  other: {
    'og:logo': 'https://cyqle.in/logo-up.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
