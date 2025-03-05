import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./messages/${locale}/index.json`)).default,
    timeZone: 'UTC',
    now: new Date(),
  };
});
