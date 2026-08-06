import { getRequestConfig } from 'next-intl/server';

import { getContent } from '@/content';

import { isLocale } from './routing';
import { defaultLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: getContent(locale),
    // Saudi Arabia has no daylight saving, so a fixed zone is safe and keeps
    // date formatting identical between server and client renders.
    timeZone: 'Asia/Riyadh',
  };
});
