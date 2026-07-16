'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: '0px 0px -80px 0px' } as const;

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  depth = false,
}: {
  children: ReactNode;
  className?: string;
  depth?: boolean;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : depth
      ? {
          hidden: { opacity: 0, y: 24, rotateX: 14, transformPerspective: 600 },
          show: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transformPerspective: 600,
            transition: { duration: 0.6, ease: EASE },
          },
        }
      : {
          hidden: { opacity: 0, x: -18 },
          show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
        };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
