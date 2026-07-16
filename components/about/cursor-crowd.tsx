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
  mobile?: boolean;
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
      mobile: true,
    },
    {
      color: '#2DD4BF',
      tag: 'leo',
      left: '85%',
      top: '24%',
      from: { x: 320, y: -180 },
      delay: 1.15,
    },
    { color: '#4ADE80', tag: 'mia', left: '7%', top: '74%', from: { x: -380, y: 220 }, delay: 1.3 },
    {
      color: '#A78BFA',
      tag: 'sam',
      left: '88%',
      top: '70%',
      from: { x: 360, y: 240 },
      delay: 1.05,
      mobile: true,
    },
    {
      color: '#FF7600',
      tag: agentLabel,
      left: '73%',
      top: '88%',
      from: { x: 280, y: 340 },
      delay: 1.5,
      agent: true,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {actors.map((actor, i) => (
        <motion.div
          key={actor.tag + i}
          className={actor.mobile ? 'absolute' : 'absolute hidden md:block'}
          style={{ left: actor.left, top: actor.top }}
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
