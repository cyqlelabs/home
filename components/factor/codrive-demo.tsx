'use client';

// The signature Factor scene, replayed as UI: Factor fills a portal at its own
// cursor, hits a 2FA wall and asks — the human steps in with their cursor,
// types the code, hands back, and Factor finishes. The run ends recorded.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { CheckCircle2, CircleDot, FileText, Lock } from 'lucide-react';
import CursorIcon from '@/components/about/cursor-icon';

const ORDER = [
  'idle',
  'enter',
  'fill1',
  'fill2',
  'fill3',
  'ask',
  'human',
  'code',
  'handback',
  'submit',
  'done',
] as const;
type Phase = (typeof ORDER)[number];

const DURATION: Partial<Record<Phase, number>> = {
  idle: 700,
  enter: 900,
  fill1: 1000,
  fill2: 1000,
  fill3: 1000,
  ask: 1900,
  human: 1000,
  code: 1400,
  handback: 1100,
  submit: 1200,
  done: 4200,
};

// Waypoints track the portal window's field grid: row 1 values ≈ 20%, row 2
// ≈ 32%, Submit ≈ 39% of container height at the sm aspect. Close enough is
// the goal — the cursor should read as "on that field" at a glance.
const AGENT_POS: Record<Phase, { left: string; top: string }> = {
  idle: { left: '110%', top: '-12%' },
  enter: { left: '44%', top: '27%' },
  fill1: { left: '44%', top: '27%' },
  fill2: { left: '72%', top: '27%' },
  fill3: { left: '44%', top: '43%' },
  ask: { left: '68%', top: '37%' },
  human: { left: '16%', top: '66%' },
  code: { left: '16%', top: '66%' },
  handback: { left: '34%', top: '48%' },
  submit: { left: '39%', top: '53%' },
  done: { left: '39%', top: '53%' },
};

const HUMAN_POS: Record<Phase, { left: string; top: string }> = {
  idle: { left: '-12%', top: '108%' },
  enter: { left: '-12%', top: '108%' },
  fill1: { left: '-12%', top: '108%' },
  fill2: { left: '-12%', top: '108%' },
  fill3: { left: '-12%', top: '108%' },
  ask: { left: '-12%', top: '108%' },
  human: { left: '74%', top: '48%' },
  code: { left: '74%', top: '42%' },
  handback: { left: '58%', top: '62%' },
  submit: { left: '64%', top: '68%' },
  done: { left: '64%', top: '68%' },
};

export interface CodriveLabels {
  agent: string;
  human: string;
  task: string;
  portalTitle: string;
  filesTitle: string;
  fieldVendor: string;
  fieldInvoice: string;
  fieldAmount: string;
  fieldCode: string;
  submit: string;
  success: string;
  statusWorking: string;
  statusAsk: string;
  statusHuman: string;
  statusHandback: string;
  statusDone: string;
  replay: string;
}

const phaseAtLeast = (phase: Phase, target: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(target);

function Chip({ color, children }: { color: 'sky' | 'orange' | 'emerald'; children: string }) {
  const palette = {
    sky: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    orange: 'border-[#FF7600]/40 bg-[#FF7600]/10 text-[#FF9A47]',
    emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  }[color];
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${palette}`}
    >
      <CircleDot className="h-3 w-3" aria-hidden="true" />
      {children}
    </motion.span>
  );
}

function Field({
  label,
  value,
  filled,
  active,
}: {
  label: string;
  value: string;
  filled: boolean;
  active: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-[0.6rem] uppercase tracking-wider text-gray-500">{label}</p>
      <div
        className={`flex h-7 items-center rounded-md border px-2 text-xs transition-colors duration-300 ${
          active ? 'border-sky-400/70 bg-sky-500/5' : 'border-gray-700/80 bg-gray-900/60'
        }`}
      >
        <AnimatePresence>
          {filled && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="text-gray-200"
            >
              {value}
            </motion.span>
          )}
        </AnimatePresence>
        {active && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="ml-0.5 inline-block h-3.5 w-[1.5px] bg-sky-300"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export default function CodriveDemo({ labels }: { labels: CodriveLabels }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (reduce) {
      setPhase('done');
      return;
    }
    if (!inView) return;
    const ms = DURATION[phase] ?? 1000;
    const next = ORDER[(ORDER.indexOf(phase) + 1) % ORDER.length];
    const timer = setTimeout(() => setPhase(next === 'idle' ? 'enter' : next), ms);
    return () => clearTimeout(timer);
  }, [phase, inView, reduce]);

  const cursorSpring = { type: 'spring', stiffness: 60, damping: 16 } as const;
  const humanDriving = phase === 'human' || phase === 'code';
  const status =
    phase === 'ask' ? (
      <Chip color="orange" key="ask">
        {labels.statusAsk}
      </Chip>
    ) : humanDriving ? (
      <Chip color="orange" key="human">
        {labels.statusHuman}
      </Chip>
    ) : phase === 'handback' ? (
      <Chip color="sky" key="handback">
        {labels.statusHandback}
      </Chip>
    ) : phase === 'done' ? (
      <Chip color="emerald" key="done">
        {labels.statusDone}
      </Chip>
    ) : phaseAtLeast(phase, 'enter') ? (
      <Chip color="sky" key="working">
        {labels.statusWorking}
      </Chip>
    ) : null;

  return (
    <div ref={rootRef} className="relative">
      {/* task + live status */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-1.5 text-xs text-gray-300">
          <span className="mr-2 font-semibold text-sky-400">▸</span>
          {labels.task}
        </span>
        <AnimatePresence mode="wait">{status}</AnimatePresence>
      </div>

      <div className="relative aspect-[16/11] select-none overflow-hidden rounded-xl border border-gray-800 bg-[#08182b] shadow-2xl shadow-sky-900/20 sm:aspect-[2/1]">
        {/* desktop wallpaper glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 75% 15%, rgba(14,165,233,0.14) 0%, rgba(8,24,43,0) 60%)',
          }}
        />

        {/* files panel */}
        <div className="absolute left-[4%] top-[18%] w-[26%] rounded-lg border border-gray-800 bg-gray-950/70 backdrop-blur-sm">
          <div className="border-b border-gray-800 px-3 py-1.5 text-[0.65rem] font-medium text-gray-400">
            {labels.filesTitle}
          </div>
          <ul className="space-y-1 p-2">
            {['invoices_q3.csv', 'vendor_list.ods', 'receipts/'].map((file) => (
              <li key={file} className="flex items-center gap-1.5 text-[0.65rem] text-gray-400">
                <FileText className="h-3 w-3 text-gray-600" aria-hidden="true" />
                {file}
              </li>
            ))}
          </ul>
        </div>

        {/* portal window */}
        <div className="absolute left-[34%] top-[10%] w-[58%] rounded-lg border border-gray-700/80 bg-gray-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 border-b border-gray-800 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500/70" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/70" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-green-500/70" aria-hidden="true" />
            <span className="ml-2 truncate text-[0.65rem] text-gray-500">{labels.portalTitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 p-3 md:gap-4 md:p-5">
            <Field
              label={labels.fieldVendor}
              value="Acme Logistics GmbH"
              filled={phaseAtLeast(phase, 'fill1')}
              active={phase === 'fill1'}
            />
            <Field
              label={labels.fieldInvoice}
              value="INV-2026-0713"
              filled={phaseAtLeast(phase, 'fill2')}
              active={phase === 'fill2'}
            />
            <Field
              label={labels.fieldAmount}
              value="€ 4,820.00"
              filled={phaseAtLeast(phase, 'fill3')}
              active={phase === 'fill3'}
            />
            <div>
              <p className="mb-1 flex items-center gap-1 text-[0.6rem] uppercase tracking-wider text-gray-500">
                <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                {labels.fieldCode}
              </p>
              <div
                className={`flex h-7 items-center rounded-md border px-2 text-xs transition-colors duration-300 ${
                  phase === 'ask'
                    ? 'border-[#FF7600]/70 bg-[#FF7600]/5'
                    : phase === 'code'
                      ? 'border-[#FF7600]/70 bg-[#FF7600]/10'
                      : 'border-gray-700/80 bg-gray-900/60'
                }`}
              >
                {phaseAtLeast(phase, 'code') && (
                  <span className="tracking-[0.3em] text-gray-200">••••••</span>
                )}
                {phase === 'code' && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="ml-0.5 inline-block h-3.5 w-[1.5px] bg-[#FF9A47]"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between pt-1">
              <AnimatePresence>
                {phaseAtLeast(phase, 'done') && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-1.5 text-[0.7rem] text-emerald-400"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {labels.success}
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                className={`rounded-md px-3 py-1 text-[0.7rem] font-medium transition-colors duration-300 ${
                  phase === 'submit' || phase === 'done'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {labels.submit}
              </span>
            </div>
          </div>
        </div>

        {/* taskbar */}
        <div className="absolute bottom-0 left-0 right-0 flex h-9 items-center justify-between border-t border-gray-800/80 bg-gray-950/70 px-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm bg-gradient-to-br from-sky-400 to-sky-700"
              aria-hidden="true"
            />
            <span className="h-2 w-14 rounded-sm bg-gray-800" aria-hidden="true" />
            <span className="h-2 w-10 rounded-sm bg-gray-800" aria-hidden="true" />
          </div>
          <span className="font-mono text-[0.6rem] text-gray-600">14:07</span>
        </div>

        {/* replay ribbon */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-[6%] left-[4%] rounded-full border border-gray-700 bg-gray-950/80 px-3 py-1 text-[0.65rem] text-gray-300"
            >
              ⏺ {labels.replay}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Factor cursor */}
        <motion.div
          className="absolute z-10"
          initial={false}
          animate={AGENT_POS[phase]}
          transition={cursorSpring}
        >
          <CursorIcon
            color="#38bdf8"
            className="h-5 w-4 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
          />
          <span className="ml-3 mt-0.5 inline-block rounded bg-sky-600 px-1.5 py-0.5 text-[0.6rem] font-semibold text-white">
            {labels.agent}
          </span>
        </motion.div>

        {/* human cursor */}
        <motion.div
          className="absolute z-10"
          initial={false}
          animate={HUMAN_POS[phase]}
          transition={cursorSpring}
        >
          <CursorIcon
            color="#FF7600"
            className="h-5 w-4 drop-shadow-[0_0_6px_rgba(255,118,0,0.6)]"
          />
          <span className="ml-3 mt-0.5 inline-block rounded bg-[#c25a00] px-1.5 py-0.5 text-[0.6rem] font-semibold text-white">
            {labels.human}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
