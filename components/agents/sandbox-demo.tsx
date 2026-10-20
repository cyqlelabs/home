'use client';

// The page's thesis, replayed as UI: your own agent works inside a fenced,
// isolated desktop at its own cursor, stops at a 2FA wall, a person steps in
// and hands back, the agent saves its file — then the same snapshot boots
// three parallel runs, each in its own fence.
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, CircleDot, Lock } from 'lucide-react';
import CursorIcon from '@/components/about/cursor-icon';

const ORDER = [
  'idle',
  'boot',
  'open',
  'fill',
  'fill2',
  'ask',
  'human',
  'code',
  'handback',
  'export',
  'saved',
  'clone',
] as const;
type Phase = (typeof ORDER)[number];

const DURATION: Record<Phase, number> = {
  idle: 600,
  boot: 1300,
  open: 1000,
  fill: 1000,
  fill2: 900,
  ask: 1900,
  human: 1000,
  code: 1300,
  handback: 1000,
  export: 1100,
  saved: 1700,
  clone: 3600,
};

type Pos = { left: number; top: number };
type Track = Record<Phase, Pos>;

export interface SandboxLabels {
  agent: string;
  human: string;
  task: string;
  boundary: string;
  network: string;
  disk: string;
  browserUrl: string;
  signIn: string;
  fieldEmail: string;
  fieldPassword: string;
  fieldCode: string;
  export: string;
  ordersTitle: string;
  terminalTitle: string;
  logReady: string;
  logOpen: string;
  logSignIn: string;
  logWait: string;
  logResumed: string;
  logExport: string;
  logSaved: string;
  statusBoot: string;
  statusWorking: string;
  statusAsk: string;
  statusHuman: string;
  statusHandback: string;
  statusDone: string;
  statusClone: string;
  run: string;
}

const SNAPSHOT = 'snap-7f3a';
const ORDERS: Array<[string, string, string]> = [
  ['#4821', '38%', '$1,240.00'],
  ['#4822', '52%', '$318.50'],
  ['#4823', '30%', '$2,075.00'],
  ['#4824', '44%', '$96.20'],
];
const AGENT = '#2dd4bf';
const HUMAN = '#FF7600';

const at = (phase: Phase, target: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(target);

function Chip({ tone, children }: { tone: 'agent' | 'human' | 'plain'; children: string }) {
  const palette = {
    agent: 'border-teal-400/40 bg-teal-400/10 text-teal-200',
    human: 'border-[#FF7600]/40 bg-[#FF7600]/10 text-[#FF9A47]',
    plain: 'border-gray-700 bg-gray-900/70 text-gray-200',
  }[tone];
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
  state,
  boxRef,
  icon,
}: {
  label: string;
  value: string;
  filled: boolean;
  state: 'idle' | 'agent' | 'human' | 'wait';
  boxRef?: Ref<HTMLDivElement>;
  icon?: boolean;
}) {
  const box = {
    idle: 'border-gray-700/80 bg-gray-900/60',
    agent: 'border-teal-400/70 bg-teal-400/5',
    wait: 'border-[#FF7600]/60 bg-[#FF7600]/5',
    human: 'border-[#FF7600]/80 bg-[#FF7600]/10',
  }[state];
  const caret = state === 'agent' ? 'bg-teal-300' : state === 'human' ? 'bg-[#FF9A47]' : null;
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1 truncate text-[0.55rem] uppercase tracking-wider text-gray-500 sm:text-[0.6rem]">
        {icon && <Lock className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />}
        <span className="truncate">{label}</span>
      </p>
      <div
        ref={boxRef}
        className={`flex h-6 items-center rounded-md border px-2 text-[0.65rem] transition-colors duration-300 sm:h-7 sm:text-xs ${box}`}
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
        {caret && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className={`ml-0.5 inline-block h-3 w-[1.5px] shrink-0 sm:h-3.5 ${caret}`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

function Cursor({
  color,
  label,
  pos,
  hidden,
}: {
  color: string;
  label: string;
  pos: Pos;
  hidden: boolean;
}) {
  return (
    <motion.div
      className="absolute left-0 top-0 z-20"
      initial={false}
      animate={{ x: pos.left, y: pos.top, opacity: hidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 16, opacity: { duration: 0.3 } }}
    >
      <CursorIcon color={color} className="h-4 w-3 sm:h-5 sm:w-4" />
      <span
        className="ml-2 mt-0.5 inline-block whitespace-nowrap rounded px-1.5 py-px font-mono text-[0.55rem] font-semibold text-gray-950 sm:ml-3 sm:text-[0.6rem]"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function Fence({
  children,
  tags,
  compact = false,
}: {
  children: ReactNode;
  tags: { top: string; corner?: string; bottom?: string[] };
  compact?: boolean;
}) {
  const tag = `whitespace-nowrap bg-[#08182b] px-1.5 font-mono ${
    compact ? 'text-[0.5rem] sm:text-[0.55rem]' : 'text-[0.6rem] sm:text-[0.65rem]'
  }`;
  return (
    <div
      className={`relative h-full rounded-xl border border-dashed border-teal-400/45 ${
        compact ? 'p-1.5 sm:p-2' : 'p-2.5 sm:p-3'
      }`}
    >
      <span className={`absolute -top-2 left-3 text-teal-300 ${tag}`}>{tags.top}</span>
      {tags.corner && (
        <span className={`absolute -top-2 right-3 text-gray-400 ${tag}`}>{tags.corner}</span>
      )}
      {tags.bottom && (
        <span className="absolute -bottom-2 right-3 flex gap-2">
          {tags.bottom.map((t) => (
            <span key={t} className={`text-gray-400 ${tag}`}>
              {t}
            </span>
          ))}
        </span>
      )}
      {children}
    </div>
  );
}

export default function SandboxDemo({ labels }: { labels: SandboxLabels }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [track, setTrack] = useState<{ agent: Track; human: Track } | null>(null);

  // Cursor waypoints are measured off the real element rects so they land on
  // their targets at every breakpoint.
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const measure = () => {
      const s = screen.getBoundingClientRect();
      const targets = [urlRef, emailRef, passwordRef, codeRef, exportRef].map((r) => r.current);
      if (!s.width || targets.some((t) => !t)) return;
      const [url, email, password, code, exp] = targets as HTMLElement[];
      const on = (el: HTMLElement, dx: number, dy: number) => {
        const b = el.getBoundingClientRect();
        return { left: b.left - s.left + b.width * dx, top: b.top - s.top + b.height * dy };
      };
      const park = (x: number, y: number) => ({ left: s.width * x, top: s.height * y });
      const agentOff = park(1.05, -0.1);
      const humanOff = park(-0.08, 1.05);
      const agentWait = on(code, 0.92, -0.6);
      setTrack({
        agent: {
          idle: agentOff,
          boot: agentOff,
          open: on(url, 0.45, 0.5),
          fill: on(email, 0.35, 0.55),
          fill2: on(password, 0.35, 0.55),
          ask: agentWait,
          human: agentWait,
          code: agentWait,
          handback: on(exp, 0.3, 3.4),
          export: on(exp, 0.4, 0.55),
          saved: on(exp, 0.1, 7.2),
          clone: on(exp, 0.1, 7.2),
        },
        human: {
          idle: humanOff,
          boot: humanOff,
          open: humanOff,
          fill: humanOff,
          fill2: humanOff,
          ask: humanOff,
          human: on(code, 0.5, 0.7),
          code: on(code, 0.45, 0.55),
          handback: park(0.08, 0.9),
          export: park(0.08, 0.9),
          saved: park(0.08, 0.9),
          clone: park(0.08, 0.9),
        },
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) {
      setPhase('saved');
      return;
    }
    if (!inView) return;
    const next = ORDER[(ORDER.indexOf(phase) + 1) % ORDER.length];
    const timer = setTimeout(() => setPhase(next === 'idle' ? 'boot' : next), DURATION[phase]);
    return () => clearTimeout(timer);
  }, [phase, inView, reduce]);

  const status =
    phase === 'boot' ? (
      <Chip tone="plain" key="boot">
        {labels.statusBoot}
      </Chip>
    ) : phase === 'ask' ? (
      <Chip tone="human" key="ask">
        {labels.statusAsk}
      </Chip>
    ) : phase === 'human' || phase === 'code' ? (
      <Chip tone="human" key="human">
        {labels.statusHuman}
      </Chip>
    ) : phase === 'handback' ? (
      <Chip tone="agent" key="handback">
        {labels.statusHandback}
      </Chip>
    ) : phase === 'saved' ? (
      <Chip tone="plain" key="saved">
        {labels.statusDone}
      </Chip>
    ) : phase === 'clone' ? (
      <Chip tone="agent" key="clone">
        {labels.statusClone}
      </Chip>
    ) : at(phase, 'open') ? (
      <Chip tone="agent" key="working">
        {labels.statusWorking}
      </Chip>
    ) : null;

  const log: Array<{ from: Phase; text: string; tone: string; mark: string }> = [
    { from: 'boot', text: labels.logReady, tone: 'text-gray-400', mark: '●' },
    { from: 'open', text: labels.logOpen, tone: 'text-gray-300', mark: '→' },
    { from: 'fill', text: labels.logSignIn, tone: 'text-gray-300', mark: '→' },
    { from: 'ask', text: labels.logWait, tone: 'text-[#FF9A47]', mark: '‖' },
    { from: 'handback', text: labels.logResumed, tone: 'text-teal-300', mark: '→' },
    { from: 'export', text: labels.logExport, tone: 'text-gray-300', mark: '→' },
    { from: 'saved', text: labels.logSaved, tone: 'text-emerald-300', mark: '✓' },
  ];

  const humanDriving = phase === 'human' || phase === 'code';
  const signedIn = at(phase, 'handback');
  const codeState = phase === 'ask' ? 'wait' : humanDriving ? 'human' : 'idle';
  const fallback: Pos = { left: -100, top: -100 };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative">
        <div aria-hidden="true">
          {/* task + live status */}
          <div className="mb-5 flex min-h-[1.75rem] flex-wrap items-center justify-between gap-3">
            <span className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-1.5 text-xs text-gray-300">
              <span className="mr-2 font-semibold text-teal-300">▸</span>
              {labels.task}
            </span>
            <AnimatePresence mode="wait">{status}</AnimatePresence>
          </div>

          <div className="aspect-[4/5] sm:aspect-[16/11]">
            <Fence
              tags={{
                top: labels.boundary,
                corner: SNAPSHOT,
                bottom: [labels.network, labels.disk],
              }}
            >
              <div
                ref={screenRef}
                className="relative h-full select-none overflow-hidden rounded-lg border border-gray-800 bg-[#08182b] shadow-2xl shadow-black/40"
              >
                {/* browser */}
                <motion.div
                  initial={false}
                  animate={{ opacity: at(phase, 'boot') ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-[4%] right-[4%] top-[4%] h-[56%] rounded-lg border border-gray-700/80 bg-gray-950/85 sm:right-auto sm:top-[6%] sm:h-[78%] sm:w-[60%]"
                >
                  <div className="flex items-center gap-1.5 border-b border-gray-800 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70 sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500/70 sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500/70 sm:h-2 sm:w-2" />
                    <div
                      ref={urlRef}
                      className="ml-1.5 min-w-0 flex-1 truncate rounded bg-gray-900 px-2 py-0.5 font-mono text-[0.55rem] text-gray-400 sm:text-[0.65rem]"
                    >
                      {at(phase, 'open') ? labels.browserUrl : ''}
                      &nbsp;
                    </div>
                  </div>
                  <div className="relative">
                    {/* page 1: sign-in, until the agent is through the 2FA wall */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: signedIn ? 0 : 1 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-2 p-2.5 sm:space-y-2.5 sm:p-4"
                    >
                      <p className="text-[0.7rem] font-semibold text-gray-200 sm:text-sm">
                        {labels.signIn}
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Field
                          label={labels.fieldEmail}
                          value="ops@acme.example"
                          filled={at(phase, 'fill')}
                          state={phase === 'fill' ? 'agent' : 'idle'}
                          boxRef={emailRef}
                        />
                        <Field
                          label={labels.fieldPassword}
                          value="••••••••"
                          filled={at(phase, 'fill2')}
                          state={phase === 'fill2' ? 'agent' : 'idle'}
                          boxRef={passwordRef}
                        />
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ opacity: at(phase, 'ask') ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-1/2 pr-1 sm:pr-1.5"
                      >
                        <Field
                          label={labels.fieldCode}
                          value="•••  •••"
                          filled={at(phase, 'code')}
                          state={codeState}
                          boxRef={codeRef}
                          icon
                        />
                      </motion.div>
                    </motion.div>

                    {/* page 2: the portal behind the login */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: signedIn ? 1 : 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 p-2.5 sm:p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                        <p className="truncate text-[0.7rem] font-semibold text-gray-200 sm:text-sm">
                          {labels.ordersTitle}
                        </p>
                        <span
                          ref={exportRef}
                          className={`shrink-0 rounded-md px-2.5 py-1 text-[0.6rem] font-medium transition-colors duration-300 sm:text-[0.7rem] ${
                            phase === 'export'
                              ? 'bg-teal-400 text-gray-950'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                        >
                          {labels.export}
                        </span>
                      </div>
                      <ul className="divide-y divide-gray-800/80 border-y border-gray-800/80">
                        {ORDERS.map(([id, width, total]) => (
                          <li
                            key={id}
                            className="flex items-center gap-2 py-1.5 font-mono text-[0.55rem] text-gray-400 sm:gap-3 sm:py-2 sm:text-[0.65rem]"
                          >
                            <span className="text-gray-300">{id}</span>
                            <span className="h-1.5 rounded-full bg-gray-800" style={{ width }} />
                            <span className="ml-auto">{total}</span>
                          </li>
                        ))}
                      </ul>
                      <AnimatePresence>
                        {at(phase, 'saved') && (
                          <motion.p
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-2 inline-flex items-center gap-1 font-mono text-[0.55rem] text-emerald-300 sm:mt-3 sm:text-[0.65rem]"
                          >
                            <Check className="h-3 w-3 shrink-0" />
                            orders-sep.csv
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>

                {/* agent log */}
                <motion.div
                  initial={false}
                  animate={{ opacity: at(phase, 'boot') ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="absolute bottom-[10%] left-[4%] right-[4%] top-[63%] flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-black/70 sm:bottom-[14%] sm:left-auto sm:right-[3%] sm:top-[42%] sm:w-[31%]"
                >
                  <div className="border-b border-gray-800 px-2.5 py-1 font-mono text-[0.55rem] text-gray-500 sm:text-[0.6rem]">
                    {labels.terminalTitle}
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-0.5 overflow-hidden p-2 font-mono text-[0.55rem] leading-snug sm:text-[0.6rem]">
                    {log
                      .filter((line) => at(phase, line.from))
                      .map((line) => (
                        <motion.p
                          key={line.from}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`break-words ${line.tone}`}
                        >
                          <span className="mr-1.5 text-gray-600">{line.mark}</span>
                          {line.text}
                        </motion.p>
                      ))}
                  </div>
                </motion.div>

                {/* taskbar */}
                <div className="absolute bottom-0 left-0 right-0 flex h-[7%] max-h-8 items-center justify-between border-t border-gray-800/80 bg-gray-950/70 px-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#FF7600]/80" />
                    <span className="h-1.5 w-12 rounded-sm bg-gray-800" />
                    <span className="h-1.5 w-8 rounded-sm bg-gray-800" />
                  </div>
                  <span className="font-mono text-[0.55rem] text-gray-600">09:41</span>
                </div>

                {/* one snapshot, three runs */}
                <AnimatePresence>
                  {phase === 'clone' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 z-30 flex flex-col justify-center gap-4 bg-[#08182b] p-4 sm:p-6"
                    >
                      <p className="text-center font-mono text-[0.65rem] text-gray-400 sm:text-xs">
                        {SNAPSHOT} <span className="text-teal-300">→ 3</span>
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((n, i) => (
                          <motion.div
                            key={n}
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.18, duration: 0.4 }}
                          >
                            <Fence compact tags={{ top: `${labels.run} ${n}` }}>
                              <div className="space-y-1.5 rounded-md border border-gray-800 bg-gray-950/80 p-2 sm:p-2.5">
                                {[0.9, 0.65, 0.8].map((w, j) => (
                                  <div
                                    key={j}
                                    className="h-1.5 overflow-hidden rounded-full bg-gray-800"
                                  >
                                    <motion.div
                                      className="h-full rounded-full bg-teal-400/70"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${w * 100}%` }}
                                      transition={{
                                        delay: 0.5 + i * 0.25 + j * 0.2,
                                        duration: 0.9,
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </Fence>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Cursor
                  color={AGENT}
                  label={labels.agent}
                  pos={track?.agent[phase] ?? fallback}
                  hidden={!track || phase === 'clone'}
                />
                <Cursor
                  color={HUMAN}
                  label={labels.human}
                  pos={track?.human[phase] ?? fallback}
                  hidden={!track || phase === 'clone'}
                />
              </div>
            </Fence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
