'use client';

import { Button } from '@/components/ui/button';
import { trackCTA } from '@/lib/analytics';
import { type ReactNode } from 'react';

interface TrackedButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  trackingKey: 'ctaStartTrial' | 'ctaScheduleDemo';
  href?: string;
}

export default function TrackedButton({
  onClick,
  children,
  className,
  size = 'default',
  trackingKey,
  href,
}: TrackedButtonProps) {
  const handleClick = () => {
    trackCTA[trackingKey]();
    if (onClick) {
      onClick();
    }
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <Button onClick={handleClick} size={size} className={className}>
      {children}
    </Button>
  );
}
