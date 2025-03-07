import { getRequestConfig } from 'next-intl/server';
import { getLocaleFromURL } from '../lib/utils';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    locale = getLocaleFromURL();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}/index.json`)).default,
    timeZone: 'UTC',
    now: new Date(),
  };
});
