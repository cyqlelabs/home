import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}/index.json`)).default,
    timeZone: 'UTC',
    now: new Date(),
  };
});
