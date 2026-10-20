'use client';

// The signature Factor scene, replayed as UI: Factor fills a portal at its own
// cursor, hits a 2FA wall and asks — the human steps in with their cursor,
// types the code, hands back, and Factor finishes. The run ends recorded.
import { useEffect, useRef, useState, type Ref } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
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

type Pos = { left: number | string; top: number | string };

// Pre-measurement fallback only, tuned for the sm 2/1 aspect. Once mounted,
// cursor waypoints are measured off the real field rects (see the
// ResizeObserver effect below) so they track every breakpoint.
const AGENT_POS: Record<Phase, Pos> = {
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

const HUMAN_POS: Record<Phase, Pos> = {
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
  boxRef,
}: {
  label: string;
  value: string;
  filled: boolean;
  active: boolean;
  boxRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 truncate text-[0.5rem] uppercase tracking-wider text-gray-500 sm:text-[0.6rem]">
        {label}
      </p>
      <div
        ref={boxRef}
        className={`flex h-6 items-center rounded-md border px-1.5 text-[0.6rem] transition-colors duration-300 sm:h-7 sm:px-2 sm:text-xs ${
          active ? 'border-sky-400/70 bg-sky-500/5' : 'border-gray-700/80 bg-gray-900/60'
        }`}
      >
        <AnimatePresence>
          {filled && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="truncate text-gray-200"
            >
              {value}
            </motion.span>
          )}
        </AnimatePresence>
        {active && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="ml-0.5 inline-block h-3 w-[1.5px] shrink-0 bg-sky-300 sm:h-3.5"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export default function CodriveDemo({ labels }: { labels: CodriveLabels }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const vendorRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [measured, setMeasured] = useState<{
    agent: Record<Phase, Pos>;
    human: Record<Phase, Pos>;
  } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const vendor = vendorRef.current;
      const invoice = invoiceRef.current;
      const amount = amountRef.current;
      const code = codeRef.current;
      const submit = submitRef.current;
      if (!s.width || !vendor || !invoice || !amount || !code || !submit) return;
      // Cursor tip lands inside the target box, dx/dy in fractions of it.
      const on = (el: HTMLElement, dx: number, dy: number) => {
        const b = el.getBoundingClientRect();
        return { left: b.left - s.left + b.width * dx, top: b.top - s.top + b.height * dy };
      };
      const park = (x: number, y: number) => ({ left: s.width * x, top: s.height * y });
      const offstage = { agentIdle: park(1.1, -0.12), humanIdle: park(-0.12, 1.08) };
      setMeasured({
        agent: {
          idle: offstage.agentIdle,
          enter: on(vendor, 0.3, 0.55),
          fill1: on(vendor, 0.3, 0.55),
          fill2: on(invoice, 0.3, 0.55),
          fill3: on(amount, 0.3, 0.55),
          ask: on(code, 0.25, 0.35),
          human: park(0.16, 0.66),
          code: park(0.16, 0.66),
          handback: on(amount, 0.55, 1.6),
          submit: on(submit, 0.35, 0.55),
          done: on(submit, 0.35, 0.55),
        },
        human: {
          idle: offstage.humanIdle,
          enter: offstage.humanIdle,
          fill1: offstage.humanIdle,
          fill2: offstage.humanIdle,
          fill3: offstage.humanIdle,
          ask: offstage.humanIdle,
          human: on(code, 0.5, 0.7),
          code: on(code, 0.5, 0.55),
          handback: on(code, 0.2, 1.9),
          submit: park(0.64, 0.68),
          done: park(0.64, 0.68),
        },
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

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
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative">
        {/* task + live status */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-1.5 text-xs text-gray-300">
            <span className="mr-2 font-semibold text-sky-400">▸</span>
            {labels.task}
          </span>
          <AnimatePresence mode="wait">{status}</AnimatePresence>
        </div>

        <div
          ref={stageRef}
          className="relative aspect-[16/11] select-none overflow-hidden rounded-xl border border-gray-800 bg-[#08182b] shadow-2xl shadow-sky-900/20 sm:aspect-[2/1]"
        >
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
            <div className="truncate border-b border-gray-800 px-2 py-1 text-[0.55rem] font-medium text-gray-400 sm:px-3 sm:py-1.5 sm:text-[0.65rem]">
              {labels.filesTitle}
            </div>
            <ul className="space-y-1 p-1.5 sm:p-2">
              {['invoices_q3.csv', 'vendor_list.ods', 'receipts/'].map((file) => (
                <li
                  key={file}
                  className="flex items-center gap-1 text-[0.55rem] text-gray-400 sm:gap-1.5 sm:text-[0.65rem]"
                >
                  <FileText
                    className="h-2.5 w-2.5 shrink-0 text-gray-600 sm:h-3 sm:w-3"
                    aria-hidden="true"
                  />
                  <span className="truncate">{file}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* portal window */}
          <div className="absolute left-[34%] top-[10%] w-[58%] rounded-lg border border-gray-700/80 bg-gray-950/80 backdrop-blur-sm">
            <div className="flex items-center gap-1 border-b border-gray-800 px-2 py-1.5 sm:gap-1.5 sm:px-3 sm:py-2">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70 sm:h-2 sm:w-2"
                aria-hidden="true"
              />
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500/70 sm:h-2 sm:w-2"
                aria-hidden="true"
              />
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500/70 sm:h-2 sm:w-2"
                aria-hidden="true"
              />
              <span className="ml-1 truncate text-[0.55rem] text-gray-500 sm:ml-2 sm:text-[0.65rem]">
                {labels.portalTitle}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2 sm:gap-2.5 sm:p-3 md:gap-4 md:p-5">
              <Field
                label={labels.fieldVendor}
                value="Acme Logistics GmbH"
                filled={phaseAtLeast(phase, 'fill1')}
                active={phase === 'fill1'}
                boxRef={vendorRef}
              />
              <Field
                label={labels.fieldInvoice}
                value="INV-2026-0713"
                filled={phaseAtLeast(phase, 'fill2')}
                active={phase === 'fill2'}
                boxRef={invoiceRef}
              />
              <Field
                label={labels.fieldAmount}
                value="€ 4,820.00"
                filled={phaseAtLeast(phase, 'fill3')}
                active={phase === 'fill3'}
                boxRef={amountRef}
              />
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-1 text-[0.5rem] uppercase tracking-wider text-gray-500 sm:text-[0.6rem]">
                  <Lock className="h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5" aria-hidden="true" />
                  <span className="truncate">{labels.fieldCode}</span>
                </p>
                <div
                  ref={codeRef}
                  className={`flex h-6 items-center rounded-md border px-1.5 text-[0.6rem] transition-colors duration-300 sm:h-7 sm:px-2 sm:text-xs ${
                    phase === 'ask'
                      ? 'border-[#FF7600]/70 bg-[#FF7600]/5'
                      : phase === 'code'
                        ? 'border-[#FF7600]/70 bg-[#FF7600]/10'
                        : 'border-gray-700/80 bg-gray-900/60'
                  }`}
                >
                  {phaseAtLeast(phase, 'code') && (
                    <span className="truncate tracking-[0.3em] text-gray-200">••••••</span>
                  )}
                  {phase === 'code' && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                      className="ml-0.5 inline-block h-3 w-[1.5px] shrink-0 bg-[#FF9A47] sm:h-3.5"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-2 pt-1">
                <AnimatePresence>
                  {phaseAtLeast(phase, 'done') && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex min-w-0 items-center gap-1 text-[0.6rem] text-emerald-400 sm:gap-1.5 sm:text-[0.7rem]"
                    >
                      <CheckCircle2
                        className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
                        aria-hidden="true"
                      />
                      <span className="truncate">{labels.success}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
                <span
                  ref={submitRef}
                  className={`ml-auto shrink-0 rounded-md px-2 py-1 text-[0.6rem] font-medium transition-colors duration-300 sm:px-3 sm:text-[0.7rem] ${
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
                className="absolute bottom-[6%] left-[4%] max-w-[92%] truncate rounded-full border border-gray-700 bg-gray-950/80 px-2 py-1 text-[0.55rem] text-gray-300 sm:px-3 sm:text-[0.65rem]"
              >
                ⏺ {labels.replay}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Factor cursor */}
          <motion.div
            className="absolute z-10"
            initial={false}
            animate={measured?.agent[phase] ?? AGENT_POS[phase]}
            transition={cursorSpring}
          >
            <CursorIcon
              color="#38bdf8"
              className="h-4 w-3 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)] sm:h-5 sm:w-4"
            />
            <span className="ml-2 mt-0.5 inline-block whitespace-nowrap rounded bg-sky-600 px-1 py-px text-[0.45rem] font-semibold text-white sm:ml-3 sm:px-1.5 sm:py-0.5 sm:text-[0.6rem]">
              {labels.agent}
            </span>
          </motion.div>

          {/* human cursor */}
          <motion.div
            className="absolute z-10"
            initial={false}
            animate={measured?.human[phase] ?? HUMAN_POS[phase]}
            transition={cursorSpring}
          >
            <CursorIcon
              color="#FF7600"
              className="h-4 w-3 drop-shadow-[0_0_6px_rgba(255,118,0,0.6)] sm:h-5 sm:w-4"
            />
            <span className="ml-2 mt-0.5 inline-block whitespace-nowrap rounded bg-[#c25a00] px-1 py-px text-[0.45rem] font-semibold text-white sm:ml-3 sm:px-1.5 sm:py-0.5 sm:text-[0.6rem]">
              {labels.human}
            </span>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
