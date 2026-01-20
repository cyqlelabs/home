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
}

export default function TrackedButton({
  onClick,
  children,
  className,
  size = 'default',
  trackingKey,
}: TrackedButtonProps) {
  const handleClick = () => {
    trackCTA[trackingKey]();
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button onClick={handleClick} size={size} className={className}>
      {children}
    </Button>
  );
}
