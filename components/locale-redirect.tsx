'use client';

// Static export has no middleware, so unprefixed URLs have no page to serve.
// Alias routes render this to forward to the visitor's locale.
import { useEffect } from 'react';
import { getPreferredLocale } from '@/lib/preferred-locale';

export default function LocaleRedirect({ path = '' }: { path?: string }) {
  useEffect(() => {
    window.location.replace(`/${getPreferredLocale()}/${path}`);
  }, [path]);

  return null;
}
