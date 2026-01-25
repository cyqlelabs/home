'use client';

import { trackCTA, trackAndNavigate } from '@/lib/analytics';
import { type ReactNode } from 'react';

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
    | 'navbarAbout'
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
    trackAndNavigate(href, trackCTA[trackingKey], e);
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
