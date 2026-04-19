'use client';

import { trackCTA, trackAndNavigate } from '@/lib/analytics';
import { type ReactNode } from 'react';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

function appendUtmParams(href: string): string {
  try {
    const pageParams = new URLSearchParams(window.location.search);
    const utms = new URLSearchParams();
    let hasUtm = false;
    for (const param of UTM_PARAMS) {
      const value = pageParams.get(param);
      if (value) {
        utms.set(param, value);
        hasUtm = true;
      }
    }
    if (!hasUtm) return href;
    const separator = href.includes('?') ? '&' : '?';
    return `${href}${separator}${utms.toString()}`;
  } catch {
    return href;
  }
}

interface TrackedLinkProps {
  href: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  trackingKey:
    | 'bookDemo'
    | 'ctaStartTrial'
    | 'ctaScheduleDemo'
    | 'aboutPageCTA'
    | 'powerOnButton'
    | 'navbarTryForFree'
    | 'exploreFeatures'
    | 'footerApiDocs'
    | 'footerContactSupport'
    | 'navbarFeatures'
    | 'navbarUseCases'
    | 'navbarPricing'
    | 'navbarApi'
    | 'navbarAbout'
    | 'apiTeaserCta'
    | 'footerHome'
    | 'footerAbout'
    | 'footerPrivacy'
    | 'footerTerms'
    | 'footerCookies';
}

export default function TrackedLink({
  href,
  onClick,
  children,
  className,
  target,
  rel,
  trackingKey,
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const destination = appendUtmParams(href);
    trackAndNavigate(destination, trackCTA[trackingKey], e);
    if (onClick) {
      onClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} target={target} rel={rel}>
      {children}
    </a>
  );
}
