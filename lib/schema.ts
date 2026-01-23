import { siteMetadata } from './site-metadata';
import type { WithContext, Organization, WebSite, SoftwareApplication } from 'schema-dts';

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteMetadata.name,
  url: siteMetadata.siteUrl,
  logo: `${siteMetadata.siteUrl}/logo-up.png`,
  description: siteMetadata.description,
  sameAs: [`https://twitter.com/${siteMetadata.twitter.replace('@', '')}`],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'demo@cyqle.in',
    contactType: 'Customer Service',
  },
};

export const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteMetadata.name,
  url: siteMetadata.siteUrl,
  description: siteMetadata.description,
  publisher: {
    '@type': 'Organization',
    name: siteMetadata.name,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}/logo-up.png`,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteMetadata.siteUrl}/?s={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const softwareApplicationSchema: WithContext<SoftwareApplication> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteMetadata.name,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Cloud Computing',
  operatingSystem: 'Web Browser',
  description: siteMetadata.description,
  url: siteMetadata.siteUrl,
  screenshot: `${siteMetadata.siteUrl}${siteMetadata.socialImage}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    description: 'Free tier available with paid plans starting from $0.50 per credit',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'P2P Real-Time Collaboration',
    'AI-Powered Automation',
    'Persistent Cloud Environment',
    'Full Root Access',
    'Instant Provisioning',
    'Session-Scoped Encryption',
  ],
};

export function getSchemaJsonLd() {
  return {
    organization: organizationSchema,
    website: websiteSchema,
    softwareApplication: softwareApplicationSchema,
  };
}
