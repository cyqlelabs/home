'use client';

import { useEffect, useRef } from 'react';
import { GlobeRenderer } from './globe-renderer';

export default function CursorGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GlobeRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const renderer = new GlobeRenderer(isMobile);
    rendererRef.current = renderer;

    renderer.init(canvas).catch((err) => {
      console.error('CursorGlobe init failed:', err);
    });

    const handleScroll = () => {
      renderer.updateScroll(window.scrollY);
    };

    const handleMouse = (e: MouseEvent) => {
      renderer.updateMouse(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        renderer.updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleResize = () => {
      renderer.resize(window.innerWidth, window.innerHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('resize', handleResize);
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen -z-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full opacity-20">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          }}
        />
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
