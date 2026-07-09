import createMiddleware from 'next-intl/middleware';
import { siteMetadata } from './lib/site-metadata';

export default createMiddleware({
  // A list of all locales that are supported
  locales: [...siteMetadata.locales],

  // Used when no locale matches
  defaultLocale: siteMetadata.defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
