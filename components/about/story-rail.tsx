'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

// A timeline rail that draws itself as the origin story is read.
export default function StoryRail({
  children,
  yearLabel,
}: {
  children: ReactNode;
  yearLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <div ref={ref} className="relative pl-8 md:pl-12">
      <div className="absolute bottom-0 left-0 top-1 w-px bg-gray-800" />
      <motion.div
        className="absolute bottom-0 left-0 top-1 w-px origin-top bg-[#FF7600]"
        style={reduce ? undefined : { scaleY }}
      />
      <div className="absolute -left-[3.5px] -top-7 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#FF7600]" />
        <span className="font-mono text-xs text-[#FF7600]">{yearLabel}</span>
      </div>
      {children}
    </div>
  );
}
