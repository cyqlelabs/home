'use client';

import { motion, useReducedMotion } from 'framer-motion';
import CursorIcon from './cursor-icon';

type Actor = {
  color: string;
  tag: string;
  left: string;
  top: string;
  from: { x: number; y: number };
  delay: number;
  // The hero is narrow on mobile, so the desktop spots would push name tags past
  // the right edge and onto the copy. There the crowd gathers in the padding
  // below the text, anchored to the bottom so longer translations can't reach it.
  mobile: { left: string; bottom: string };
  agent?: boolean;
};

// The hero acts out the headline: cursors fly in and inhabit the page together.
export default function CursorCrowd({ agentLabel }: { agentLabel: string }) {
  const reduce = useReducedMotion();

  const actors: Actor[] = [
    {
      color: '#FF5F56',
      tag: 'ana',
      left: '10%',
      top: '28%',
      from: { x: -340, y: -140 },
      delay: 0.9,
      mobile: { left: '6%', bottom: '96px' },
    },
    {
      color: '#2DD4BF',
      tag: 'leo',
      left: '85%',
      top: '24%',
      from: { x: 320, y: -180 },
      delay: 1.15,
      mobile: { left: '40%', bottom: '112px' },
    },
    {
      color: '#4ADE80',
      tag: 'mia',
      left: '7%',
      top: '74%',
      from: { x: -380, y: 220 },
      delay: 1.3,
      mobile: { left: '71%', bottom: '92px' },
    },
    {
      color: '#A78BFA',
      tag: 'sam',
      left: '88%',
      top: '70%',
      from: { x: 360, y: 240 },
      delay: 1.05,
      mobile: { left: '18%', bottom: '26px' },
    },
    {
      color: '#FF7600',
      tag: agentLabel,
      left: '73%',
      top: '88%',
      from: { x: 280, y: 340 },
      delay: 1.5,
      agent: true,
      mobile: { left: '50%', bottom: '18px' },
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {actors.map((actor, i) => (
        <motion.div
          key={actor.tag + i}
          className="absolute bottom-[var(--cursor-b)] left-[var(--cursor-x)] md:bottom-auto md:left-[var(--cursor-x-md)] md:top-[var(--cursor-y-md)]"
          style={
            {
              '--cursor-x': actor.mobile.left,
              '--cursor-b': actor.mobile.bottom,
              '--cursor-x-md': actor.left,
              '--cursor-y-md': actor.top,
            } as React.CSSProperties
          }
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: actor.from.x, y: actor.from.y }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 55,
            damping: 15,
            delay: actor.delay,
            opacity: { duration: 0.3, delay: actor.delay },
          }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -7, 0], x: [0, 5, 0] }}
            transition={{ duration: 4.5 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CursorIcon
              color={actor.color}
              className="h-7 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            />
            <span
              className={`ml-4 inline-block rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none ${
                actor.agent ? 'text-white' : 'text-black/80'
              }`}
              style={{ backgroundColor: actor.color }}
            >
              {actor.tag}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
