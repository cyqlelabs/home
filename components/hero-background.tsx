'use client';

import { useIsMobile } from '@/hooks/use-mobile';

export default function HeroBackground() {
  const isMobile = useIsMobile();
  const imgSrc = isMobile ? '/bg2-m.png' : '/bg2.png';

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-20 opacity-[.2]">
      <img
        src={imgSrc}
        alt="Hero Background"
        className={`w-full h-full object-cover ${isMobile ? 'object-left' : 'object-center'}`}
      />
      <div
        className="absolute top-0 left-0 w-full h-full backdrop-blur-sm"
        style={{
          maskImage: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
        }}
      />
    </div>
  );
}
