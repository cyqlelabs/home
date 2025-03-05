import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocaleFromURL(): string {
  if (typeof window === 'undefined') return 'en'; // Default to English on server
  
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length > 0 && ['en', 'es'].includes(parts[0])) {
    return parts[0];
  }
  
  return 'en'; // Default fallback
}

