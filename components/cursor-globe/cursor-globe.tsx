'use client';

import { useEffect, useRef } from 'react';
import { GlobeRenderer } from './globe-renderer';

export default function CursorGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const isMobile = window.innerWidth < 768;
    const renderer = new GlobeRenderer(canvas, isMobile);
    renderer.init();

    const handleScroll = () => renderer.updateScroll(window.scrollY);
    const handleMouse = (e: MouseEvent) => renderer.updateMouse(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) renderer.updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleResize = () => renderer.resize(window.innerWidth, window.innerHeight);

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
      canvas.remove();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen -z-20 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full opacity-20" />
    </div>
  );
}
