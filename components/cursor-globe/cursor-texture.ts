const SIZE = 28;
const RES = 2;

function drawArrow(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 22);
  ctx.lineTo(4.5, 17.5);
  ctx.lineTo(8, 26);
  ctx.lineTo(11.5, 24.5);
  ctx.lineTo(8, 16);
  ctx.lineTo(14, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');
  return [c, ctx];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function createCursorImages(): HTMLCanvasElement[] {
  return ['#ff0000', '#00ff00', '#00ffff'].map((color) => {
    const [c, ctx] = makeCanvas(SIZE * RES);
    ctx.scale(RES, RES);
    drawArrow(ctx, color);
    return c;
  });
}

// Soft round dot with a slightly feathered edge.
export function createDotSprite(color: string): HTMLCanvasElement {
  const size = 12;
  const [c, ctx] = makeCanvas(size);
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, hexToRgba(color, 1));
  grad.addColorStop(0.55, hexToRgba(color, 0.9));
  grad.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return c;
}

// Wide radial glow for halos, arc heads and nebula washes.
export function createGlowSprite(color: string, size = 64): HTMLCanvasElement {
  const [c, ctx] = makeCanvas(size);
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, hexToRgba(color, 0.85));
  grad.addColorStop(0.3, hexToRgba(color, 0.32));
  grad.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export const CURSOR_SIZE = SIZE;
