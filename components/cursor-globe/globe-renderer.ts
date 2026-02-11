import { type SpherePoint } from './types';
import { fibonacciSphere, rotateY, rotateX, project } from './sphere-math';
import { createCursorImages, CURSOR_SIZE } from './cursor-texture';

interface Cursor {
  basePoint: SpherePoint;
  highlightAmount: number;
  neonAmount: number;
}

export class GlobeRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private readonly cursors: Cursor[] = [];
  private images: HTMLCanvasElement[] = [];
  private animId = 0;
  private lastTime = 0;
  private rotationAngle = 0;
  private scrollMultiplier = 1;
  private mouseX = -9999;
  private mouseY = -9999;
  private readonly isMobile: boolean;
  private readonly cursorCount: number;
  private radius = 0;
  private readonly fov = 800;
  private readonly tiltX = (-15 * Math.PI) / 180;
  private destroyed = false;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private neonTimer = 0;
  private neonInterval = 80;

  constructor(canvas: HTMLCanvasElement, isMobile: boolean) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    this.ctx = ctx;
    this.isMobile = isMobile;
    this.cursorCount = isMobile ? 60 : 120;
  }

  init() {
    this.images = createCursorImages();
    this.dpr = this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    this.updateSize(this.canvas.clientWidth, this.canvas.clientHeight);

    const points = fibonacciSphere(this.cursorCount);
    for (let i = 0; i < this.cursorCount; i++) {
      this.cursors.push({ basePoint: points[i], highlightAmount: 0, neonAmount: 0 });
    }

    this.lastTime = performance.now();
    this.animId = requestAnimationFrame(this.tick);
  }

  private updateSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.radius = Math.min(w, h) * (this.isMobile ? 0.48 : 0.35);
  }

  private readonly tick = (now: number) => {
    if (this.destroyed) return;
    if (this.scrollMultiplier < 0.01) {
      this.animId = requestAnimationFrame(this.tick);
      return;
    }
    const dt = Math.min((now - this.lastTime) / 16.667, 3);
    this.lastTime = now;

    this.rotationAngle += 0.004 * dt * this.scrollMultiplier;

    // Neon trigger
    this.neonTimer += dt;
    if (this.neonTimer > this.neonInterval) {
      this.neonTimer = 0;
      this.neonInterval = 60 + Math.random() * 120;
      const count = 2 + Math.floor(Math.random() * 4);
      for (let j = 0; j < count; j++) {
        const idx = Math.floor(Math.random() * this.cursors.length);
        this.cursors[idx].neonAmount = 1;
      }
    }

    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'lighter';

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const hoverRadius = this.isMobile ? 80 : 60;

    for (let i = 0; i < this.cursors.length; i++) {
      const cursor = this.cursors[i];

      cursor.neonAmount *= Math.pow(0.96, dt);
      if (cursor.neonAmount < 0.01) cursor.neonAmount = 0;

      let pt = rotateY(cursor.basePoint, this.rotationAngle);
      pt = rotateX(pt, this.tiltX);
      const projected = project(pt, this.radius, centerX, centerY, this.fov);

      const dx = projected.screenX - this.mouseX;
      const dy = projected.screenY - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetHighlight = dist < hoverRadius ? 1 : 0;
      cursor.highlightAmount += (targetHighlight - cursor.highlightAmount) * 0.1 * dt;

      const h = cursor.highlightAmount;
      const n = cursor.neonAmount;
      const glow = Math.max(h, n);

      const baseScale = projected.scale * 0.8;
      const scale = baseScale * (1 + glow * 0.5);
      const alpha = projected.alpha * this.scrollMultiplier;
      const size = CURSOR_SIZE * scale;

      const distFromCenter = Math.sqrt(
        (projected.screenX - centerX) ** 2 + (projected.screenY - centerY) ** 2,
      );
      const maxDist = this.radius * 1.2;
      const aberrationStrength = Math.min(distFromCenter / maxDist, 1);
      const offset = (aberrationStrength * 3 + n * 5) * scale;

      // Red channel
      let rAlpha = alpha;
      // Green channel
      let gAlpha = alpha;
      // Cyan channel
      let bAlpha = alpha;

      if (n > 0.01) {
        const neonAlpha = alpha + n * 1.2;
        gAlpha = neonAlpha;
        bAlpha = neonAlpha * 0.8;
        rAlpha = alpha * (1 - n * 0.6);
      } else if (h > 0.01) {
        gAlpha = alpha + h * 0.6;
        rAlpha = alpha * (1 - h * 0.3);
        bAlpha = alpha * (1 - h * 0.3);
      }

      const sx = projected.screenX;
      const sy = projected.screenY;

      ctx.globalAlpha = rAlpha;
      ctx.drawImage(this.images[0], sx - offset, sy - offset * 0.5, size, size);

      ctx.globalAlpha = gAlpha;
      ctx.drawImage(this.images[1], sx + offset * 0.5, sy + offset, size, size);

      ctx.globalAlpha = bAlpha;
      ctx.drawImage(this.images[2], sx + offset * 0.3, sy - offset * 0.8, size, size);
    }

    this.animId = requestAnimationFrame(this.tick);
  };

  updateScroll(scrollY: number) {
    const heroHeight = window.innerHeight;
    if (scrollY < heroHeight * 0.5) {
      this.scrollMultiplier = 1;
    } else {
      const progress = Math.min(scrollY / 2000, 1);
      this.scrollMultiplier = Math.max(0, 1 - Math.pow(progress, 1.5));
    }
  }

  updateMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  resize(width: number, height: number) {
    if (this.destroyed) return;
    this.updateSize(width, height);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animId);
  }
}
