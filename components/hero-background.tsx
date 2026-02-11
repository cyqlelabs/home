'use client';

import dynamic from 'next/dynamic';

const CursorGlobe = dynamic(async () => await import('./cursor-globe/cursor-globe'), {
  ssr: false,
});

export default function HeroBackground() {
  return <CursorGlobe />;
}
