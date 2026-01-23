'use client';

import { Power } from 'lucide-react';
import TrackedLink from '@/components/tracked-link';

export default function PowerOnButton() {
  return (
    <TrackedLink
      href="https://app.cyqle.in"
      trackingKey="powerOnButton"
      className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#FF7600] via-[#FF8C00] to-[#d66300] text-white shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,118,0,0.7)] hover:scale-110 flex items-center justify-center group"
    >
      <Power
        className="h-16 w-16 transition-transform group-hover:rotate-180 duration-500"
        strokeWidth={2.5}
      />
    </TrackedLink>
  );
}
