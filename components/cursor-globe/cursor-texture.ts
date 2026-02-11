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

export function createCursorImages(): HTMLCanvasElement[] {
  return ['#ff0000', '#00ff00', '#00ffff'].map((color) => {
    const c = document.createElement('canvas');
    c.width = SIZE * RES;
    c.height = SIZE * RES;
    const ctx = c.getContext('2d');
    if (!ctx) return c;
    ctx.scale(RES, RES);
    drawArrow(ctx, color);
    return c;
  });
}

export const CURSOR_SIZE = SIZE;
