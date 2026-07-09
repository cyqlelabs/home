'use client';

import { useEffect } from 'react';

// Reveals the styled scrollbar while the user is scrolling, then fades it out
// after a short idle pause. Capture phase catches scroll on nested containers too.
export default function ScrollbarReveal() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      root.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove('is-scrolling'), 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      clearTimeout(timer);
      root.classList.remove('is-scrolling');
    };
  }, []);

  return null;
}
