import { type MetadataRoute } from 'next';
import { siteMetadata } from '@/lib/site-metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/cookies', '/privacy-policy', '/terms-of-service'];

  const sitemap: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    siteMetadata.locales.forEach((locale) => {
      sitemap.push({
        url: `${siteMetadata.siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  return sitemap;
}
