'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import CursorIcon from './cursor-icon';

const CMD = 'npx playwright test checkout';
const OUT_RUN = 'Running 24 tests across 4 workers';
const OUT_FAIL = '✕ checkout.spec.ts:41 · timeout waiting for #pay-button';
const OUT_PASS = '✓ 24 passed (38s)';

const ORDER = [
  'idle',
  'agentIn',
  'typing',
  'running',
  'failed',
  'humanIn',
  'takeover',
  'fixed',
] as const;
type Phase = (typeof ORDER)[number];

// How long each auto-advancing phase lasts. 'typing' is driven by the keystroke interval.
const DURATION: Partial<Record<Phase, number>> = {
  agentIn: 900,
  running: 1500,
  failed: 1100,
  humanIn: 900,
  takeover: 1400,
  fixed: 3200,
};

const AGENT_POS: Record<Phase, { left: string; top: string }> = {
  idle: { left: '108%', top: '-14%' },
  agentIn: { left: '46%', top: '10%' },
  typing: { left: '46%', top: '10%' },
  running: { left: '30%', top: '32%' },
  failed: { left: '24%', top: '50%' },
  humanIn: { left: '24%', top: '50%' },
  takeover: { left: '10%', top: '76%' },
  fixed: { left: '10%', top: '76%' },
};

const HUMAN_POS: Record<Phase, { left: string; top: string }> = {
  idle: { left: '-14%', top: '112%' },
  agentIn: { left: '-14%', top: '112%' },
  typing: { left: '-14%', top: '112%' },
  running: { left: '-14%', top: '112%' },
  failed: { left: '-14%', top: '112%' },
  humanIn: { left: '64%', top: '54%' },
  takeover: { left: '58%', top: '48%' },
  fixed: { left: '72%', top: '28%' },
};

// A live-ish replay of the undersold moment: the agent works, stalls, and a
// human grabs their own cursor in the very same session.
export default function AgentDemo({
  agentLabel,
  humanLabel,
  takeoverLabel,
}: {
  agentLabel: string;
  humanLabel: string;
  takeoverLabel: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Continuous (not `once`) so the loop's timers pause while scrolled away and resume in place.
  const inView = useInView(rootRef, { amount: 0.4 });
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState(0);
  const [cycle, setCycle] = useState(0);

  const active = inView && !reduce;

  useEffect(() => {
    if (active && phase === 'idle') setPhase('agentIn');
  }, [active, phase]);

  // Keystrokes.
  useEffect(() => {
    if (!active || phase !== 'typing') return;
    const interval = setInterval(() => {
      setTyped((n) => {
        if (n >= CMD.length) return n;
        return n + 1;
      });
    }, 42);
    return () => clearInterval(interval);
  }, [active, phase]);

  useEffect(() => {
    if (phase === 'typing' && typed >= CMD.length) setPhase('running');
  }, [phase, typed]);

  // Auto-advance through the choreography, looping from 'fixed' back to 'typing'.
  useEffect(() => {
    if (!active) return;
    const ms = DURATION[phase];
    if (!ms) return;
    const timeout = setTimeout(() => {
      if (phase === 'agentIn') setPhase('typing');
      else if (phase === 'running') setPhase('failed');
      else if (phase === 'failed') setPhase('humanIn');
      else if (phase === 'humanIn') setPhase('takeover');
      else if (phase === 'takeover') setPhase('fixed');
      else if (phase === 'fixed') {
        setCycle((c) => c + 1);
        setTyped(0);
        setPhase('typing');
      }
    }, ms);
    return () => clearTimeout(timeout);
  }, [active, phase]);

  const stage = reduce ? ORDER.length - 1 : ORDER.indexOf(phase);
  const at = (p: Phase) => stage >= ORDER.indexOf(p);
  const typedText = reduce ? CMD : CMD.slice(0, typed);

  const agentPos = reduce ? AGENT_POS.fixed : AGENT_POS[phase];
  const humanPos = reduce ? HUMAN_POS.fixed : HUMAN_POS[phase];

  return (
    <div ref={rootRef} className="relative">
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0C0C10] shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-gray-800/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          <span className="ml-2 font-mono text-xs text-gray-500">cyqle · session</span>
        </div>

        <div className="relative h-60 px-4 py-3 font-mono text-[12.5px] leading-6 text-gray-300 sm:text-[13px]">
          <div key={cycle}>
            <div className="whitespace-nowrap">
              <span className="text-[#FF7600]">$ </span>
              {typedText}
              {!reduce && phase === 'typing' && (
                <motion.span
                  className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-gray-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}
            </div>
            {at('running') && (
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500"
              >
                {OUT_RUN}
              </motion.div>
            )}
            {at('failed') && (
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-red-400 ${at('takeover') ? 'rounded bg-red-400/10 px-1 -mx-1' : ''}`}
              >
                {OUT_FAIL}
              </motion.div>
            )}
            {at('fixed') && (
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-400"
              >
                {OUT_PASS}
              </motion.div>
            )}
          </div>

          {/* Takeover chip */}
          <AnimatePresence>
            {at('takeover') && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-2 rounded-full border border-[#FF7600]/50 bg-[#FF7600]/10 px-3 py-1 font-mono text-[11px] text-[#FF7600]"
              >
                {takeoverLabel}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Agent cursor */}
          <motion.div
            className="absolute"
            initial={false}
            animate={agentPos}
            transition={{ type: 'spring', stiffness: 70, damping: 16 }}
            aria-hidden="true"
          >
            <CursorIcon
              color="#FF7600"
              className="h-6 w-auto drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
            />
            <span className="ml-3 inline-block rounded-md bg-[#FF7600] px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-white">
              {agentLabel}
            </span>
          </motion.div>

          {/* Human cursor */}
          <motion.div
            className="absolute"
            initial={false}
            animate={humanPos}
            transition={{ type: 'spring', stiffness: 70, damping: 16 }}
            aria-hidden="true"
          >
            <CursorIcon
              color="#2DD4BF"
              className="h-6 w-auto drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
            />
            <span className="ml-3 inline-block rounded-md bg-[#2DD4BF] px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-black/80">
              {humanLabel}
            </span>
            {/* Click ripple on takeover */}
            <AnimatePresence>
              {phase === 'takeover' && !reduce && (
                <motion.span
                  className="absolute -left-2 -top-2 h-6 w-6 rounded-full border-2 border-[#2DD4BF]"
                  initial={{ opacity: 0.7, scale: 0.2 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
