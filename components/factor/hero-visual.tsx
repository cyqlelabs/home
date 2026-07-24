'use client';

// Client boundary for the WebGL hero: loads three.js only in the browser,
// after hydration, and never blocks the hero copy from painting.
import dynamic from 'next/dynamic';

const FactorHeroScene = dynamic(async () => await import('./factor-hero-scene'), {
  ssr: false,
  loading: () => null,
});

export default function HeroVisual() {
  return <FactorHeroScene className="absolute inset-0 h-full w-full" />;
}
