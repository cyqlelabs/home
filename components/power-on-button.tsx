'use client';

import { Power } from 'lucide-react';
import { trackCTA, trackAndNavigate } from '@/lib/analytics';

export default function PowerOnButton() {
  return (
    <a
      href="https://app.cyqle.in"
      onClick={(e) => trackAndNavigate('https://app.cyqle.in', trackCTA.powerOnButton, e)}
      className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#FF7600] via-[#FF8C00] to-[#d66300] text-white shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,118,0,0.7)] hover:scale-110 flex items-center justify-center group"
    >
      <Power
        className="h-16 w-16 transition-transform group-hover:rotate-180 duration-500"
        strokeWidth={2.5}
      />
    </a>
  );
}
