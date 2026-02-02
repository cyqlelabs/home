'use client';

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoBackgroundProps {
  className?: string;
}

export default function VideoBackground({ className = '' }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((error) => {
      console.error('Video autoplay failed:', error);
    });
  }, []);

  const videoBaseName = isMobile ? 'vid3-optimized-mobile' : 'vid3-optimized';

  return (
    <div className={`fixed inset-0 w-screen h-screen -z-20 overflow-hidden ${className}`}>
      <div className="absolute inset-0 w-full h-full opacity-20">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="min-w-full min-h-full w-auto h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center"
        >
          <source src={`/${videoBaseName}.webm`} type="video/webm" />
          <source src={`/${videoBaseName}.mp4`} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 w-full h-full backdrop-blur-sm"
          style={{
            maskImage: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
          }}
        />
      </div>
    </div>
  );
}
