'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const IDS = ['4f2a', '9c1e', 'b7d3', '52aa'];

const W = 340;
const H = 210;
const CARD = { x: 30, y: 25, w: 280, h: 160, r: 12 };

// Phase timings (ms)
const BOOT = 700;
const RUN = 2600;
const DISSOLVE = 1700;
const GONE = 900;

type Particle = { x: number; y: number; vx: number; vy: number; color: string };

function drawCard(ctx: CanvasRenderingContext2D, id: string, alpha: number, rise: number) {
  const { x, y, w, h, r } = CARD;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, rise);

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = '#101015';
  ctx.fill();
  ctx.strokeStyle = '#2A2A33';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Header: status dot + session id
  ctx.beginPath();
  ctx.arc(x + 20, y + 24, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FF7600';
  ctx.fill();
  ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(`session-${id}`, x + 32, y + 28);

  ctx.strokeStyle = '#1F2937';
  ctx.beginPath();
  ctx.moveTo(x + 1, y + 42);
  ctx.lineTo(x + w - 1, y + 42);
  ctx.stroke();

  // Abstract content bars
  const bars: Array<[number, number, string]> = [
    [58, 180, '#374151'],
    [76, 220, '#374151'],
    [94, 140, '#374151'],
    [122, 90, 'rgba(255,118,0,0.55)'],
  ];
  for (const [dy, bw, color] of bars) {
    ctx.beginPath();
    ctx.roundRect(x + 20, y + dy, bw, 9, 4);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
}

// Cryptographic erasure, literally: the session card dissolves into particles
// the moment its key is destroyed. A new session boots fresh — the old one is gone.
export default function ErasureCard({
  statusRunning,
  statusDestroyed,
}: {
  statusRunning: string;
  statusDestroyed: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [destroyed, setDestroyed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    if (reduce || !inView) {
      ctx.clearRect(0, 0, W, H);
      drawCard(ctx, IDS[0], 1, 0);
      setDestroyed(false);
      return;
    }

    let raf = 0;
    let start = performance.now();
    let idIndex = 0;
    let particles: Particle[] | null = null;

    const buildParticles = () => {
      // Sample the fully drawn card into particles.
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const octx = off.getContext('2d');
      if (!octx) return [];
      drawCard(octx, IDS[idIndex], 1, 0);
      const data = octx.getImageData(0, 0, W, H).data;
      const out: Particle[] = [];
      const step = 4;
      for (let py = 0; py < H; py += step) {
        for (let px = 0; px < W; px += step) {
          const a = data[(py * W + px) * 4 + 3];
          if (a < 60) continue;
          const i = (py * W + px) * 4;
          out.push({
            x: px,
            y: py,
            vx: (px - W / 2) * (0.2 + Math.sin(px * 13.37 + py) * 0.1),
            vy: -30 - ((px * 7 + py * 3) % 40),
            color: `rgba(${data[i]},${data[i + 1]},${data[i + 2]},`,
          });
        }
      }
      return out;
    };

    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);

      if (t < BOOT) {
        const p = t / BOOT;
        drawCard(ctx, IDS[idIndex], p, (1 - p) * 10);
      } else if (t < BOOT + RUN) {
        drawCard(ctx, IDS[idIndex], 1, 0);
      } else if (t < BOOT + RUN + DISSOLVE) {
        if (!particles) {
          particles = buildParticles();
          setDestroyed(true);
        }
        const p = (t - BOOT - RUN) / DISSOLVE;
        const eased = p * p;
        for (const pt of particles) {
          const alpha = Math.max(0, 1 - p * 1.15);
          ctx.fillStyle = pt.color + alpha + ')';
          ctx.fillRect(pt.x + pt.vx * eased, pt.y + pt.vy * eased - 20 * eased * eased, 2, 2);
        }
      } else if (t < BOOT + RUN + DISSOLVE + GONE) {
        // empty — the session is gone
      } else {
        idIndex = (idIndex + 1) % IDS.length;
        particles = null;
        setDestroyed(false);
        start = now;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: W, aspectRatio: `${W} / ${H}`, height: 'auto' }}
        aria-hidden="true"
      />
      <p
        className={`flex items-center gap-2 font-mono text-xs transition-colors duration-500 ${
          destroyed ? 'text-[#FF7600]' : 'text-gray-500'
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            destroyed ? 'bg-[#FF7600]' : 'bg-emerald-500'
          }`}
        />
        {destroyed ? statusDestroyed : statusRunning}
      </p>
    </div>
  );
}
