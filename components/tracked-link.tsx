'use client';

import { trackCTA, trackAndNavigate } from '@/lib/analytics';
import { type ReactNode } from 'react';

interface TrackedLinkProps {
  href: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  trackingKey:
    | 'bookDemo'
    | 'ctaStartTrial'
    | 'ctaScheduleDemo'
    | 'aboutPageCTA'
    | 'powerOnButton'
    | 'navbarTryForFree'
    | 'exploreFeatures';
}

export default function TrackedLink({
  href,
  onClick,
  children,
  className,
  trackingKey,
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackAndNavigate(href, trackCTA[trackingKey], e);
    if (onClick) {
      onClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
