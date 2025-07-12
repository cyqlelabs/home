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
        url: 'https://cyqle.in/favicon/android-chrome-192x192.png',
        width: 192,
        height: 192,
        alt: 'Cyqle Logo',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
