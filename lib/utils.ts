import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocaleFromCookie(): string {
  if (typeof window === 'undefined') return 'en'; // Default to English on server

  const cookies = document.cookie.split(';');
  const localeCookie = cookies.find((cookie) => cookie.trim().startsWith('NEXT_LOCALE='));

  if (localeCookie) {
    const locale = localeCookie.split('=')[1];
    if (['en', 'es'].includes(locale)) {
      return locale;
    }
  }

  return 'en'; // Default fallback
}
