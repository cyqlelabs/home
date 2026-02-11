'use client';

import { useEffect, useRef } from 'react';

export default function ParallaxBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{ height: '150%', width: '100%' }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>
    </div>
  );
}
