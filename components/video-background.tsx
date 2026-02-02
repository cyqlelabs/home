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

    let scrollTimeout: NodeJS.Timeout;

    const isInHeroSection = () => {
      return window.scrollY < window.innerHeight * 0.5;
    };

    const handleScroll = () => {
      if (!video) return;

      const inHero = isInHeroSection();

      if (video.paused) {
        video.play().catch((err) => console.error('Play failed:', err));
      }

      if (inHero) {
        video.playbackRate = 1.0;
      } else {
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(scrollY / 2000, 1);
        const exponentialProgress = Math.pow(scrollProgress, 1.5);
        const playbackRate = Math.max(0.25, 1.0 - exponentialProgress * 0.75);
        video.playbackRate = playbackRate;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!video) return;

        const inHero = isInHeroSection();
        if (inHero) {
          video.playbackRate = 1.0;
          if (video.paused) {
            video.play().catch((err) => console.error('Play failed:', err));
          }
        } else {
          video.pause();
        }
      }, 150);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const videoBaseName = isMobile ? 'vid3-optimized-mobile' : 'vid3-optimized';

  return (
    <div className={`fixed inset-0 w-screen h-screen -z-20 overflow-hidden ${className}`}>
      <div className="absolute inset-0 w-full h-full opacity-20">
        <video
          ref={videoRef}
          autoPlay={false}
          loop={false}
          muted
          playsInline
          className="min-w-full min-h-full w-auto h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center"
          onEnded={(e) => {
            const inHero = window.scrollY < window.innerHeight * 0.5;
            if (inHero) {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch((err) => console.error('Play failed:', err));
            }
          }}
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
