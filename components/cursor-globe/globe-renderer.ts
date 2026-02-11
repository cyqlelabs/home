import { Application, Container, Sprite, type RenderTexture } from 'pixi.js';
import { type SpherePoint } from './types';
import { fibonacciSphere, rotateY, rotateX, project } from './sphere-math';
import { createCursorTexture } from './cursor-texture';

interface CursorGroup {
  container: Container;
  spriteR: Sprite;
  spriteG: Sprite;
  spriteB: Sprite;
  basePoint: SpherePoint;
  highlightAmount: number;
}

export class GlobeRenderer {
  app: Application;
  private readonly stage: Container;
  private readonly cursors: CursorGroup[] = [];
  private texture!: RenderTexture;
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
  private initialized = false;

  constructor(isMobile: boolean) {
    this.app = new Application();
    this.stage = new Container();
    this.stage.sortableChildren = true;
    this.isMobile = isMobile;
    this.cursorCount = isMobile ? 60 : 120;
  }

  async init(canvas: HTMLCanvasElement) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    await this.app.init({
      canvas,
      width,
      height,
      preference: 'webgl',
      backgroundAlpha: 0,
      resolution: this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
      autoDensity: true,
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
    });

    if (this.destroyed) {
      this.app.destroy({ removeView: false });
      return;
    }

    this.app.stage.addChild(this.stage);
    this.texture = createCursorTexture(this.app);
    this.radius = Math.min(width, height) * 0.35;
    this.createCursors();
    this.app.ticker.add(this.tick);
    this.initialized = true;
  }

  private createCursors() {
    const points = fibonacciSphere(this.cursorCount);

    for (let i = 0; i < this.cursorCount; i++) {
      const container = new Container();
      container.sortableChildren = false;

      const spriteR = new Sprite(this.texture);
      spriteR.tint = 0xff0000;
      spriteR.blendMode = 'add';
      spriteR.anchor.set(0, 0);

      const spriteG = new Sprite(this.texture);
      spriteG.tint = 0x00ff00;
      spriteG.blendMode = 'add';
      spriteG.anchor.set(0, 0);

      const spriteB = new Sprite(this.texture);
      spriteB.tint = 0x00ffff;
      spriteB.blendMode = 'add';
      spriteB.anchor.set(0, 0);

      container.addChild(spriteR, spriteG, spriteB);
      this.stage.addChild(container);

      this.cursors.push({
        container,
        spriteR,
        spriteG,
        spriteB,
        basePoint: points[i],
        highlightAmount: 0,
      });
    }
  }

  private readonly tick = () => {
    if (this.destroyed) return;
    if (this.scrollMultiplier < 0.01) {
      this.stage.visible = false;
      return;
    }
    this.stage.visible = true;

    const dt = this.app.ticker.deltaTime;
    this.rotationAngle += 0.004 * dt * this.scrollMultiplier;

    const centerX = this.app.screen.width / 2;
    const centerY = this.app.screen.height / 2;

    for (let i = 0; i < this.cursors.length; i++) {
      const cursor = this.cursors[i];

      let pt = rotateY(cursor.basePoint, this.rotationAngle);
      pt = rotateX(pt, this.tiltX);

      const projected = project(pt, this.radius, centerX, centerY, this.fov);

      const dx = projected.screenX - this.mouseX;
      const dy = projected.screenY - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hoverRadius = this.isMobile ? 80 : 60;
      const isNear = dist < hoverRadius;

      const targetHighlight = isNear ? 1 : 0;
      cursor.highlightAmount += (targetHighlight - cursor.highlightAmount) * 0.1 * dt;

      const h = cursor.highlightAmount;
      const baseScale = projected.scale * 0.8;
      const scale = baseScale * (1 + h * 0.5);
      const alpha = projected.alpha * this.scrollMultiplier;

      cursor.container.position.set(projected.screenX, projected.screenY);
      cursor.container.zIndex = Math.round(projected.depth * 1000);

      const distFromCenter = Math.sqrt(
        Math.pow(projected.screenX - centerX, 2) + Math.pow(projected.screenY - centerY, 2),
      );
      const maxDist = this.radius * 1.2;
      const aberrationStrength = Math.min(distFromCenter / maxDist, 1);
      const offset = aberrationStrength * 3 * scale;

      cursor.spriteR.position.set(-offset, -offset * 0.5);
      cursor.spriteR.scale.set(scale);
      cursor.spriteR.alpha = alpha;

      cursor.spriteG.position.set(offset * 0.5, offset);
      cursor.spriteG.scale.set(scale);
      cursor.spriteG.alpha = alpha;

      cursor.spriteB.position.set(offset * 0.3, -offset * 0.8);
      cursor.spriteB.scale.set(scale);
      cursor.spriteB.alpha = alpha;

      if (h > 0.01) {
        cursor.spriteG.alpha = alpha + h * 0.6;
        cursor.spriteR.alpha = alpha * (1 - h * 0.3);
        cursor.spriteB.alpha = alpha * (1 - h * 0.3);
      }
    }
  };

  updateScroll(scrollY: number) {
    const heroHeight = window.innerHeight;
    if (scrollY < heroHeight * 0.5) {
      this.scrollMultiplier = 1;
    } else {
      const progress = Math.min(scrollY / 2000, 1);
      const exponential = Math.pow(progress, 1.5);
      this.scrollMultiplier = Math.max(0, 1 - exponential);
    }
  }

  updateMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  resize(width: number, height: number) {
    if (this.destroyed || !this.initialized) return;
    this.app.renderer.resize(width, height);
    this.radius = Math.min(width, height) * 0.35;
  }

  destroy() {
    this.destroyed = true;
    if (!this.initialized) return;
    this.app.ticker.remove(this.tick);
    this.texture?.destroy(true);
    this.app.destroy({ removeView: false }, { children: true });
  }
}
