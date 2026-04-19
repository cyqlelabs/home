'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface Props {
  label: string;
}

export default function BackToTop({ label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-[#FF7600]/40 bg-black/70 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-300 hover:border-[#FF7600] hover:bg-[#FF7600] hover:text-white ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
