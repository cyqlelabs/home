'use client';

import { useEffect, useState } from 'react';

interface ResponsiveVideoProps {
  desktopSrc: string;
  mobileSrc: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function ResponsiveVideo({
  desktopSrc,
  mobileSrc,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
}: ResponsiveVideoProps) {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(desktopSrc);

  useEffect(() => {
    const checkMobilePortrait = () => {
      const isMobile = window.innerWidth <= 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      const shouldUseMobile = isMobile && isPortrait;

      setIsMobilePortrait(shouldUseMobile);
      setCurrentSrc(shouldUseMobile ? mobileSrc : desktopSrc);
    };

    checkMobilePortrait();
    window.addEventListener('resize', checkMobilePortrait);
    window.addEventListener('orientationchange', checkMobilePortrait);

    return () => {
      window.removeEventListener('resize', checkMobilePortrait);
      window.removeEventListener('orientationchange', checkMobilePortrait);
    };
  }, [desktopSrc, mobileSrc]);

  useEffect(() => {
    const preloadVideo = (src: string) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = src;
    };

    preloadVideo(desktopSrc);
    preloadVideo(mobileSrc);
  }, [desktopSrc, mobileSrc]);

  return (
    <video
      key={currentSrc}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
      className={className}
    >
      <source src={currentSrc} type="video/mp4" />
    </video>
  );
}
