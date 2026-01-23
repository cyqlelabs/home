export const siteMetadata = {
  name: 'Cyqle',
  siteUrl: 'https://cyqle.in',
  defaultLocale: 'en',
  locales: ['en', 'es'] as const,
  title: 'Cyqle | The P2P Cloud Desktop for Instant Collaboration',
  description:
    'A persistent P2P cloud desktop for instant team collaboration. Build, test, and automate together with AI-powered workflows. Start free today.',
  keywords: [
    'cloud desktop',
    'p2p collaboration',
    'ai automation',
    'remote workspace',
    'browser automation',
    'team productivity',
  ],
  socialImage: '/og-image.png',
  socialSquareImage: '/social-square.png',
  themeColor: '#0b6a6c',
  backgroundColor: '#03121b',
  twitter: '@cyqle',
};

export type SiteLocale = (typeof siteMetadata.locales)[number];

export const siteIcons = {
  icon: [
    { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon/favicon.ico' },
  ],
  apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  shortcut: ['/favicon/favicon.ico'],
  other: [
    { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: siteMetadata.themeColor },
  ],
};

export const robotsConfig = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
} as const;

export const formatDetection = {
  email: false,
  address: false,
  telephone: false,
};

export const languageAlternates: Record<string, string> = {
  'x-default': '/en/',
  'en-US': '/en/',
  'es-ES': '/es/',
};

export const getCanonicalPath = (locale?: SiteLocale) => {
  if (!locale) {
    return '/';
  }

  return `/${locale}/`;
};

export const getSEOAlternates = (locale: SiteLocale, path: string = '') => {
  const cleanPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;

  const languages: Record<string, string> = {
    'x-default': `/en${cleanPath}`,
  };

  siteMetadata.locales.forEach((l) => {
    const langTag = l === 'en' ? 'en-US' : 'es-ES';
    languages[langTag] = `/${l}${cleanPath}`;
  });

  return {
    canonical: `/${locale}${cleanPath}`,
    languages,
  };
};
