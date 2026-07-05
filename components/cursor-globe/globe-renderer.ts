import { type SpherePoint } from './types';
import { latLngToPoint, rotateX, angleBetween, buildArcPoints } from './sphere-math';
import {
  createCursorImages,
  createDotSprite,
  createGlowSprite,
  CURSOR_SIZE,
} from './cursor-texture';
import { decodeLandDots, LAND_DOT_COUNT } from './land-dots';
import { REGIONS } from './regions';

const DEG = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;
const FIBER_KM_PER_MS = 100; // round-trip: ~200,000 km/s one way

interface RegionRuntime {
  point: SpherePoint;
  live: boolean;
  pulse: number;
  pulsePeriod: number;
  halo: number;
  highlight: number;
  screenX: number;
  screenY: number;
  scale: number;
  depth: number;
  viewX: number;
  viewY: number;
  viewZ: number;
}

interface ArcLink {
  points: Float32Array;
  segs: number;
  shared: boolean;
  state: 'draw' | 'linked' | 'fade';
  t: number;
  fade: number;
  pulseT: number;
  pulseDir: number;
  regionIdx: number;
  latencyMs: number;
  labelT: number;
}

interface UserSession {
  point: SpherePoint;
  state: 'in' | 'live' | 'out';
  t: number;
  liveDur: number;
  wobbleA: number;
  wobbleB: number;
  highlight: number;
  shared: boolean;
  arc: ArcLink | null;
}

interface Star {
  x: number;
  yr: number;
  layer: number;
  size: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

interface Sparkle {
  idx: number;
  amt: number;
}

interface LatencyLabel {
  x: number;
  y: number;
  text: string;
  alpha: number;
  shared: boolean;
}

const ARC_DRAW_DUR = 0.9;
const ARC_FADE_DUR = 0.6;
const USER_IN_DUR = 0.4;
const USER_OUT_DUR = 0.5;
const SAT_ORBIT_RADIUS = 1.3;
const SAT_INCLINATION = 36 * DEG;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

export class GlobeRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private readonly isMobile: boolean;
  private readonly reducedMotion: boolean;

  private landXYZ = new Float32Array(0);
  private dotStride: number;
  private readonly regions: RegionRuntime[] = [];
  private readonly users: UserSession[] = [];
  private readonly arcs: ArcLink[] = [];
  private readonly stars: Star[] = [];
  private readonly sparkles: Sparkle[] = [];
  private readonly labels: LatencyLabel[] = [];

  private cursorImages: HTMLCanvasElement[] = [];
  private dotLand!: HTMLCanvasElement;
  private dotSpark!: HTMLCanvasElement;
  private dotWhite!: HTMLCanvasElement;
  private dotStar!: HTMLCanvasElement;
  private glowTeal!: HTMLCanvasElement;
  private glowOrange!: HTMLCanvasElement;
  private glowWhite!: HTMLCanvasElement;
  private nebulaTeal!: HTMLCanvasElement;
  private nebulaOrange!: HTMLCanvasElement;

  private animId = 0;
  private lastTime = 0;
  private destroyed = false;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private radius = 0;
  private readonly fov = 800;

  private rotationAngle = 30 * DEG;
  private readonly tiltBase = -18 * DEG;

  private rawScroll = 0;
  private prevScroll = 0;
  private scrollSmooth = 0;
  private scrollVel = 0;
  private camSmooth = 0;
  private fade = 1;

  private mouseX = -9999;
  private mouseY = -9999;
  private parallaxX = 0;
  private parallaxY = 0;

  private satAngle = 0;
  private spawnTimer = 0.8;
  private sharedTimer = 5;
  private sparkleTimer = 0.5;

  private frameEma = 16;
  private frameCount = 0;

  private readonly maxUsers: number;
  private readonly arcSegs: number;

  // view-space transform of the current frame
  private cosR = 1;
  private sinR = 0;
  private cosT = 1;
  private sinT = 0;
  private viewRadius = 0;
  private centerX = 0;
  private centerY = 0;

  private readonly proj = { x: 0, y: 0, scale: 1, depth: 0 };
  private readonly arcScratch: Float32Array;

  constructor(canvas: HTMLCanvasElement, isMobile: boolean, reducedMotion = false) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    this.ctx = ctx;
    this.isMobile = isMobile;
    this.reducedMotion = reducedMotion;
    this.dotStride = isMobile ? 3 : 1;
    this.maxUsers = isMobile ? 5 : 9;
    this.arcSegs = isMobile ? 20 : 30;
    this.arcScratch = new Float32Array((this.arcSegs + 1) * 4);
  }

  init() {
    this.cursorImages = createCursorImages();
    this.dotLand = createDotSprite('#94a8c4');
    this.dotSpark = createDotSprite('#8ff1ff');
    this.dotWhite = createDotSprite('#ffffff');
    this.dotStar = createDotSprite('#cfe2ff');
    this.glowTeal = createGlowSprite('#2ec5e6');
    this.glowOrange = createGlowSprite('#ff7600');
    this.glowWhite = createGlowSprite('#eaf6ff');
    this.nebulaTeal = createGlowSprite('#1d7f9c', 128);
    this.nebulaOrange = createGlowSprite('#b4560f', 128);

    const raw = decodeLandDots();
    this.landXYZ = new Float32Array(LAND_DOT_COUNT * 3);
    for (let i = 0; i < LAND_DOT_COUNT; i++) {
      const p = latLngToPoint(raw[i * 2] / 100, raw[i * 2 + 1] / 100);
      this.landXYZ[i * 3] = p.x;
      this.landXYZ[i * 3 + 1] = p.y;
      this.landXYZ[i * 3 + 2] = p.z;
    }

    for (const region of REGIONS) {
      this.regions.push({
        point: latLngToPoint(region.lat, region.lng),
        live: region.status === 'live',
        pulse: Math.random(),
        pulsePeriod: region.status === 'live' ? 2.6 : 4.5,
        halo: 0,
        highlight: 0,
        screenX: 0,
        screenY: 0,
        scale: 1,
        depth: 0,
        viewX: 0,
        viewY: 0,
        viewZ: 0,
      });
    }

    const starCount = this.isMobile ? 60 : 130;
    for (let i = 0; i < starCount; i++) {
      const layer = i % 3;
      this.stars.push({
        x: Math.random(),
        yr: Math.random(),
        layer,
        size: 0.7 + Math.random() * 1.1 + layer * 0.25,
        baseAlpha: 0.2 + layer * 0.14 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0006 + Math.random() * 0.0012,
      });
    }

    this.dpr = this.isMobile
      ? Math.min(window.devicePixelRatio, 1.5)
      : Math.min(window.devicePixelRatio, 2);
    this.updateSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.satAngle = Math.random() * Math.PI * 2;

    if (this.reducedMotion) {
      this.renderFrame(0, 0);
      return;
    }
    this.lastTime = performance.now();
    this.animId = requestAnimationFrame(this.tick);
  }

  private updateSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.radius = Math.min(w, h) * (this.isMobile ? 0.46 : 0.36);
  }

  private readonly tick = (now: number) => {
    if (this.destroyed) return;
    const rawMs = now - this.lastTime;
    const dt = Math.min(rawMs / 16.667, 3);
    this.lastTime = now;

    this.updateFade();
    if (this.fade < 0.01) {
      this.prevScroll = this.rawScroll;
      this.animId = requestAnimationFrame(this.tick);
      return;
    }

    this.frameEma = this.frameEma * 0.95 + Math.min(rawMs, 100) * 0.05;
    this.frameCount++;
    if (
      this.frameCount % 240 === 0 &&
      this.frameEma > 23 &&
      this.dotStride < (this.isMobile ? 5 : 3)
    ) {
      this.dotStride++;
    }

    this.renderFrame(dt, now);
    this.animId = requestAnimationFrame(this.tick);
  };

  private updateFade() {
    const heroHeight = this.height || window.innerHeight;
    if (this.rawScroll < heroHeight * 0.5) {
      this.fade = 1;
    } else {
      const progress = Math.min(this.rawScroll / 2400, 1);
      this.fade = Math.max(0, 1 - Math.pow(progress, 1.5));
    }
  }

  private renderFrame(dt: number, now: number) {
    const dtSec = dt * 0.016667;

    // scroll velocity drives spin, star streaks and session activity
    const instVel = dtSec > 0 ? clamp((this.rawScroll - this.prevScroll) / dtSec, -6000, 6000) : 0;
    this.prevScroll = this.rawScroll;
    this.scrollVel += (instVel - this.scrollVel) * Math.min(1, 0.14 * dt);
    const velBoost = Math.min(Math.abs(this.scrollVel) / 800, 2.5);

    this.scrollSmooth += (this.rawScroll - this.scrollSmooth) * Math.min(1, 0.2 * dt);
    const camTarget = clamp(this.rawScroll / ((this.height || 1) * 1.6), 0, 1);
    this.camSmooth += (camTarget - this.camSmooth) * Math.min(1, 0.1 * dt);
    const cam = smoothstep(this.camSmooth);

    this.rotationAngle += 0.0038 * dt * (1 + velBoost * 0.9);
    this.satAngle += 0.004 * dt;

    if (this.mouseX > -9000) {
      this.parallaxX +=
        ((this.mouseX - this.width / 2) * 0.014 - this.parallaxX) * Math.min(1, 0.06 * dt);
      this.parallaxY +=
        ((this.mouseY - this.height / 2) * 0.01 - this.parallaxY) * Math.min(1, 0.06 * dt);
    }

    const tilt = this.tiltBase - 13 * DEG * cam;
    this.cosR = Math.cos(this.rotationAngle);
    this.sinR = Math.sin(this.rotationAngle);
    this.cosT = Math.cos(tilt);
    this.sinT = Math.sin(tilt);
    this.viewRadius = this.radius * (1 - 0.2 * cam);
    this.centerX = this.width / 2 + this.parallaxX;
    this.centerY = this.height * 0.52 + this.height * 0.03 * cam + this.parallaxY;

    if (!this.reducedMotion) this.updateSimulation(dtSec, velBoost);

    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'lighter';

    this.labels.length = 0;
    this.drawNebula(cam);
    this.drawStars(now);
    this.drawLandDots(dtSec);
    this.computeRegionViews();
    this.drawSatellite();
    this.drawArcs(dtSec);
    this.drawRegions(dtSec);
    this.drawUsers(dt, dtSec);
    this.drawLabels();
  }

  // Rotate (globe spin, inverted for eastward drift) + tilt + perspective project.
  private project3(x: number, y: number, z: number) {
    const x1 = x * this.cosR - z * this.sinR;
    const z1 = x * this.sinR + z * this.cosR;
    const y2 = y * this.cosT - z1 * this.sinT;
    const z2 = y * this.sinT + z1 * this.cosT;
    const s = this.fov / (this.fov + z2 * this.viewRadius);
    this.proj.x = this.centerX + x1 * this.viewRadius * s;
    this.proj.y = this.centerY + y2 * this.viewRadius * s;
    this.proj.scale = s;
    this.proj.depth = z2;
  }

  // Tilt + project without globe spin (satellite orbits in inertial space).
  private projectStatic(x: number, y: number, z: number) {
    const y2 = y * this.cosT - z * this.sinT;
    const z2 = y * this.sinT + z * this.cosT;
    const s = this.fov / (this.fov + z2 * this.viewRadius);
    this.proj.x = this.centerX + x * this.viewRadius * s;
    this.proj.y = this.centerY + y2 * this.viewRadius * s;
    this.proj.scale = s;
    this.proj.depth = z2;
  }

  private updateSimulation(dtSec: number, velBoost: number) {
    this.spawnTimer -= dtSec * (1 + velBoost * 0.7);
    if (this.spawnTimer <= 0) {
      this.spawnTimer = 1.1 + Math.random() * 1.6;
      if (this.users.length < this.maxUsers) this.spawnUser(false, -1, null);
    }

    this.sharedTimer -= dtSec;
    if (this.sharedTimer <= 0) {
      this.sharedTimer = 9 + Math.random() * 8;
      this.spawnSharedSession();
    }

    this.sparkleTimer -= dtSec;
    if (this.sparkleTimer <= 0) {
      this.sparkleTimer = 0.7 + Math.random() * 0.9;
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        this.sparkles.push({ idx: Math.floor(Math.random() * LAND_DOT_COUNT), amt: 1 });
      }
    }
  }

  private pickLandPoint(avoid: SpherePoint | null): SpherePoint {
    for (let attempt = 0; attempt < 6; attempt++) {
      const idx = Math.floor(Math.random() * LAND_DOT_COUNT) * 3;
      const p = {
        x: this.landXYZ[idx],
        y: this.landXYZ[idx + 1],
        z: this.landXYZ[idx + 2],
      };
      if (avoid && p.x * avoid.x + p.y * avoid.y + p.z * avoid.z > 0.5) continue;
      return p;
    }
    const idx = Math.floor(Math.random() * LAND_DOT_COUNT) * 3;
    return { x: this.landXYZ[idx], y: this.landXYZ[idx + 1], z: this.landXYZ[idx + 2] };
  }

  private nearestLiveRegion(p: SpherePoint): number {
    let best = -1;
    let bestDot = -2;
    for (let i = 0; i < this.regions.length; i++) {
      const r = this.regions[i];
      if (!r.live) continue;
      const d = p.x * r.point.x + p.y * r.point.y + p.z * r.point.z;
      if (d > bestDot) {
        bestDot = d;
        best = i;
      }
    }
    return best;
  }

  private spawnUser(shared: boolean, regionIdx: number, avoid: SpherePoint | null) {
    const point = this.pickLandPoint(avoid);
    const region = regionIdx >= 0 ? regionIdx : this.nearestLiveRegion(point);
    if (region < 0) return;
    this.spawnUserAt(point, shared, region);
  }

  private spawnSharedSession() {
    if (this.users.length + 2 > this.maxUsers + 1) return;
    const liveIndices = this.regions.map((r, i) => (r.live ? i : -1)).filter((i) => i >= 0);
    if (liveIndices.length === 0) return;
    const regionIdx = liveIndices[Math.floor(Math.random() * liveIndices.length)];
    const first = this.pickLandPoint(null);
    this.spawnUserAt(first, true, regionIdx);
    this.spawnUser(true, regionIdx, first);
  }

  private spawnUserAt(point: SpherePoint, shared: boolean, regionIdx: number) {
    const angle = angleBetween(point, this.regions[regionIdx].point);
    const latencyMs = Math.max(6, Math.round(6 + (angle * EARTH_RADIUS_KM) / FIBER_KM_PER_MS));
    const arc: ArcLink = {
      points: buildArcPoints(point, this.regions[regionIdx].point, this.arcSegs),
      segs: this.arcSegs,
      shared,
      state: 'draw',
      t: 0,
      fade: 1,
      pulseT: 0,
      pulseDir: 1,
      regionIdx,
      latencyMs,
      labelT: 0,
    };
    this.arcs.push(arc);
    this.users.push({
      point,
      state: 'in',
      t: 0,
      liveDur: shared ? 10 + Math.random() * 3 : 5 + Math.random() * 6,
      wobbleA: 1.5 + Math.random() * 1.5,
      wobbleB: 1.2 + Math.random() * 1.8,
      highlight: 0,
      shared,
      arc,
    });
  }

  private depthAlpha(depth: number): number {
    return (1 - depth) * 0.5;
  }

  private drawNebula(cam: number) {
    const ctx = this.ctx;
    const base = Math.min(this.width, this.height);
    const size1 = base * (1.1 + cam * 0.15);
    const size2 = base * (1.25 + cam * 0.15);
    ctx.globalAlpha = 0.055 * this.fade;
    ctx.drawImage(
      this.nebulaTeal,
      this.width * 0.22 - size1 / 2,
      this.height * 0.3 - size1 / 2,
      size1,
      size1,
    );
    ctx.globalAlpha = 0.05 * this.fade;
    ctx.drawImage(
      this.nebulaOrange,
      this.width * 0.78 - size2 / 2,
      this.height * 0.62 - size2 / 2,
      size2,
      size2,
    );
  }

  private drawStars(now: number) {
    const ctx = this.ctx;
    const wrap = this.height * 1.3;
    const streakBase = clamp(this.scrollVel * 0.02, -26, 26);
    for (const star of this.stars) {
      const layerF = 0.025 + star.layer * 0.03;
      let y = (star.yr * wrap - this.scrollSmooth * layerF) % wrap;
      if (y < 0) y += wrap;
      y -= this.height * 0.15;
      const x = star.x * this.width;
      const twinkle = this.reducedMotion
        ? 0.75
        : 0.55 + 0.45 * Math.sin(now * star.speed + star.phase);
      const alpha = star.baseAlpha * twinkle * this.fade;
      const streak = streakBase * (0.5 + star.layer * 0.35);
      if (Math.abs(streak) > 3) {
        ctx.globalAlpha = alpha * 0.7;
        ctx.strokeStyle = '#cfe2ff';
        ctx.lineWidth = star.size * 0.7;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + streak);
        ctx.stroke();
      } else {
        const size = star.size * 3;
        ctx.globalAlpha = alpha;
        ctx.drawImage(this.dotStar, x - size / 2, y - size / 2, size, size);
      }
    }
  }

  private drawLandDots(dtSec: number) {
    const ctx = this.ctx;
    const data = this.landXYZ;
    const stride = this.dotStride * 3;
    const img = this.dotLand;
    for (let i = 0; i < data.length; i += stride) {
      this.project3(data[i], data[i + 1], data[i + 2]);
      const depth = this.proj.depth;
      if (depth > 0.85) continue;
      const da = this.depthAlpha(depth);
      const alpha = (0.05 + 0.72 * da * da) * this.fade;
      if (alpha < 0.02) continue;
      const size = 2.6 * this.proj.scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, this.proj.x - size / 2, this.proj.y - size / 2, size, size);
    }

    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.amt *= Math.pow(0.955, dtSec * 60);
      if (sp.amt < 0.02) {
        this.sparkles.splice(i, 1);
        continue;
      }
      const idx = sp.idx * 3;
      this.project3(data[idx], data[idx + 1], data[idx + 2]);
      if (this.proj.depth > 0.6) continue;
      const da = this.depthAlpha(this.proj.depth);
      const alpha = sp.amt * da * this.fade;
      const size = 3.6 * this.proj.scale;
      const glowSize = 12 * this.proj.scale;
      ctx.globalAlpha = alpha * 0.9;
      ctx.drawImage(this.dotSpark, this.proj.x - size / 2, this.proj.y - size / 2, size, size);
      ctx.globalAlpha = alpha * 0.35;
      ctx.drawImage(
        this.glowTeal,
        this.proj.x - glowSize / 2,
        this.proj.y - glowSize / 2,
        glowSize,
        glowSize,
      );
    }
  }

  private computeRegionViews() {
    for (const region of this.regions) {
      const p = region.point;
      const x1 = p.x * this.cosR - p.z * this.sinR;
      const z1 = p.x * this.sinR + p.z * this.cosR;
      const y2 = p.y * this.cosT - z1 * this.sinT;
      const z2 = p.y * this.sinT + z1 * this.cosT;
      const s = this.fov / (this.fov + z2 * this.viewRadius);
      region.viewX = x1;
      region.viewY = y2;
      region.viewZ = z2;
      region.screenX = this.centerX + x1 * this.viewRadius * s;
      region.screenY = this.centerY + y2 * this.viewRadius * s;
      region.scale = s;
      region.depth = z2;
    }
  }

  private drawSatellite() {
    const ctx = this.ctx;
    const orbit = (angle: number) => {
      const p = rotateX(
        { x: Math.cos(angle) * SAT_ORBIT_RADIUS, y: 0, z: Math.sin(angle) * SAT_ORBIT_RADIUS },
        SAT_INCLINATION,
      );
      this.projectStatic(p.x, p.y, p.z);
      return p;
    };

    const satLocal = orbit(this.satAngle);
    const satX = this.proj.x;
    const satY = this.proj.y;
    const satScale = this.proj.scale;
    const satDepth = this.proj.depth;

    const distFromCenter = Math.hypot(satX - this.centerX, satY - this.centerY);
    const occluded = satDepth > 0.1 && distFromCenter < this.viewRadius * 0.95;
    const vis = (occluded ? 0.08 : 0.35 + 0.65 * this.depthAlpha(satDepth)) * this.fade;
    if (vis < 0.02) return;

    for (let k = 7; k >= 1; k--) {
      orbit(this.satAngle - k * 0.055);
      const trailAlpha = vis * 0.3 * (1 - k / 8);
      const size = 4 * this.proj.scale;
      ctx.globalAlpha = trailAlpha;
      ctx.drawImage(this.dotStar, this.proj.x - size / 2, this.proj.y - size / 2, size, size);
    }

    const glowSize = 16 * satScale;
    ctx.globalAlpha = vis * 0.5;
    ctx.drawImage(this.glowTeal, satX - glowSize / 2, satY - glowSize / 2, glowSize, glowSize);
    const coreSize = 5 * satScale;
    ctx.globalAlpha = vis;
    ctx.drawImage(this.dotWhite, satX - coreSize / 2, satY - coreSize / 2, coreSize, coreSize);

    // downlink beam when passing near a live region
    if (occluded) return;
    const inv = 1 / SAT_ORBIT_RADIUS;
    const sx = satLocal.x * inv;
    const sy0 = satLocal.y * inv;
    const sz = satLocal.z * inv;
    const sy2 = sy0 * this.cosT - sz * this.sinT;
    const sz2 = sy0 * this.sinT + sz * this.cosT;
    for (const region of this.regions) {
      if (!region.live || region.depth > 0.25) continue;
      const dot = sx * region.viewX + sy2 * region.viewY + sz2 * region.viewZ;
      if (dot < 0.88) continue;
      const alpha = ((dot - 0.88) / 0.12) * 0.45 * this.fade;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#2ec5e6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(region.screenX, region.screenY);
      ctx.lineTo(satX, satY);
      ctx.stroke();
      const endGlow = 10 * region.scale;
      ctx.globalAlpha = alpha * 0.6;
      ctx.drawImage(
        this.glowTeal,
        region.screenX - endGlow / 2,
        region.screenY - endGlow / 2,
        endGlow,
        endGlow,
      );
    }
  }

  private drawArcs(dtSec: number) {
    const ctx = this.ctx;
    for (let a = this.arcs.length - 1; a >= 0; a--) {
      const arc = this.arcs[a];
      arc.t += dtSec;

      if (arc.state === 'draw' && arc.t >= ARC_DRAW_DUR) {
        arc.state = 'linked';
        arc.t = 0;
        if (arc.shared) this.regions[arc.regionIdx].halo = 1;
      }
      if (arc.state === 'fade') {
        arc.fade = Math.max(0, 1 - arc.t / ARC_FADE_DUR);
        if (arc.fade <= 0) {
          this.arcs.splice(a, 1);
          continue;
        }
      }
      if (arc.state === 'linked') {
        arc.labelT += dtSec;
        arc.pulseT += dtSec * 0.6 * arc.pulseDir;
        if (arc.pulseT > 1) {
          arc.pulseT = 1;
          arc.pulseDir = -1;
        } else if (arc.pulseT < 0) {
          arc.pulseT = 0;
          arc.pulseDir = 1;
        }
      }

      const headT = arc.state === 'draw' ? easeInOutCubic(Math.min(arc.t / ARC_DRAW_DUR, 1)) : 1;
      const lastIdx = Math.max(1, Math.ceil(headT * arc.segs));

      const pts = arc.points;
      const scratch = this.arcScratch;
      for (let k = 0; k <= lastIdx; k++) {
        this.project3(pts[k * 3], pts[k * 3 + 1], pts[k * 3 + 2]);
        scratch[k * 4] = this.proj.x;
        scratch[k * 4 + 1] = this.proj.y;
        scratch[k * 4 + 2] = this.proj.scale;
        scratch[k * 4 + 3] = this.proj.depth;
      }

      const rgb = arc.shared ? '255,150,64' : '64,203,232';
      const stateAlpha =
        (arc.state === 'draw' ? 0.85 : arc.state === 'linked' ? 0.55 : 0.55 * arc.fade) * this.fade;

      for (let k = 1; k <= lastIdx; k++) {
        const segT = k / arc.segs;
        if (segT > headT) break;
        const depth = (scratch[k * 4 + 3] + scratch[(k - 1) * 4 + 3]) / 2;
        const depthA = 0.15 + 0.85 * this.depthAlpha(depth);
        const ramp = arc.state === 'draw' ? 0.3 + 0.7 * Math.pow(segT / headT, 2) : 1;
        ctx.globalAlpha = stateAlpha * depthA * ramp;
        ctx.strokeStyle = `rgba(${rgb},1)`;
        ctx.lineWidth = (0.8 + 0.8 * segT) * scratch[k * 4 + 2];
        ctx.beginPath();
        ctx.moveTo(scratch[(k - 1) * 4], scratch[(k - 1) * 4 + 1]);
        ctx.lineTo(scratch[k * 4], scratch[k * 4 + 1]);
        ctx.stroke();
      }

      // comet head while drawing on
      if (arc.state === 'draw') {
        const exact = headT * arc.segs;
        const i0 = Math.min(Math.floor(exact), arc.segs - 1);
        const frac = exact - i0;
        const hx = scratch[i0 * 4] + (scratch[(i0 + 1) * 4] - scratch[i0 * 4]) * frac;
        const hy = scratch[i0 * 4 + 1] + (scratch[(i0 + 1) * 4 + 1] - scratch[i0 * 4 + 1]) * frac;
        const hs = scratch[i0 * 4 + 2];
        const glow = arc.shared ? this.glowOrange : this.glowTeal;
        const glowSize = 18 * hs;
        ctx.globalAlpha = 0.9 * this.fade;
        ctx.drawImage(glow, hx - glowSize / 2, hy - glowSize / 2, glowSize, glowSize);
        const coreSize = 4 * hs;
        ctx.drawImage(this.dotWhite, hx - coreSize / 2, hy - coreSize / 2, coreSize, coreSize);
      }

      // ping pulse traveling the link
      if (arc.state === 'linked') {
        const exact = arc.pulseT * arc.segs;
        const i0 = Math.min(Math.floor(exact), arc.segs - 1);
        const frac = exact - i0;
        const px = scratch[i0 * 4] + (scratch[(i0 + 1) * 4] - scratch[i0 * 4]) * frac;
        const py = scratch[i0 * 4 + 1] + (scratch[(i0 + 1) * 4 + 1] - scratch[i0 * 4 + 1]) * frac;
        const ps = scratch[i0 * 4 + 2];
        const depthA = 0.15 + 0.85 * this.depthAlpha(scratch[i0 * 4 + 3]);
        const size = 5 * ps;
        ctx.globalAlpha = 0.9 * depthA * this.fade;
        ctx.drawImage(this.dotWhite, px - size / 2, py - size / 2, size, size);
      }

      // latency readout near the region end, shortly after linking
      if (!this.isMobile && arc.state === 'linked' && arc.labelT < 2.6) {
        const t = arc.labelT;
        const alpha = t < 0.25 ? t / 0.25 : t > 2.0 ? Math.max(0, 1 - (t - 2.0) / 0.6) : 1;
        const region = this.regions[arc.regionIdx];
        if (region.depth < 0.2) {
          this.labels.push({
            x: region.screenX + 10,
            y: region.screenY - 12 - t * 3,
            text: `${arc.latencyMs} ms`,
            alpha: alpha * 0.85 * this.fade,
            shared: arc.shared,
          });
        }
      }
    }
  }

  private drawRegions(dtSec: number) {
    const ctx = this.ctx;
    for (const region of this.regions) {
      region.pulse = (region.pulse + dtSec / region.pulsePeriod) % 1;

      const dx = region.screenX - this.mouseX;
      const dy = region.screenY - this.mouseY;
      const hover = dx * dx + dy * dy < 46 * 46 ? 1 : 0;
      region.highlight += (hover - region.highlight) * Math.min(1, dtSec * 8);

      const da = this.depthAlpha(region.depth);
      const alpha = (0.2 + 0.8 * da) * this.fade;
      if (alpha < 0.03) continue;
      const s = region.scale;
      const hl = region.highlight;

      if (region.live) {
        const glowSize = (26 + hl * 12) * s;
        ctx.globalAlpha = alpha * (0.55 + hl * 0.3);
        ctx.drawImage(
          this.glowOrange,
          region.screenX - glowSize / 2,
          region.screenY - glowSize / 2,
          glowSize,
          glowSize,
        );
        const coreSize = 6 * s;
        ctx.globalAlpha = alpha * 0.95;
        ctx.drawImage(
          this.dotWhite,
          region.screenX - coreSize / 2,
          region.screenY - coreSize / 2,
          coreSize,
          coreSize,
        );
        const pr = region.pulse;
        ctx.globalAlpha = (1 - pr) * 0.45 * alpha;
        ctx.strokeStyle = 'rgba(255,150,80,1)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(region.screenX, region.screenY, (4 + pr * 24 * (1 + hl * 0.3)) * s, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const pr = region.pulse;
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = 'rgba(148,168,196,1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(region.screenX, region.screenY, 3.5 * s, 0, Math.PI * 2);
        ctx.stroke();
        const coreSize = 3 * s;
        ctx.globalAlpha = alpha * 0.4;
        ctx.drawImage(
          this.dotStar,
          region.screenX - coreSize / 2,
          region.screenY - coreSize / 2,
          coreSize,
          coreSize,
        );
        ctx.globalAlpha = (1 - pr) * 0.2 * alpha;
        ctx.strokeStyle = 'rgba(148,168,196,1)';
        ctx.beginPath();
        ctx.arc(region.screenX, region.screenY, (4 + pr * 16) * s, 0, Math.PI * 2);
        ctx.stroke();
      }

      // multiplayer halo burst
      if (region.halo > 0) {
        const halo = region.halo;
        const flashSize = 60 * s * (1.2 - halo * 0.2);
        ctx.globalAlpha = halo * 0.8 * alpha;
        ctx.drawImage(
          this.glowOrange,
          region.screenX - flashSize / 2,
          region.screenY - flashSize / 2,
          flashSize,
          flashSize,
        );
        ctx.strokeStyle = 'rgba(255,150,64,1)';
        ctx.lineWidth = 1.4;
        for (const ringMax of [44, 30]) {
          ctx.globalAlpha = halo * 0.7 * alpha;
          ctx.beginPath();
          ctx.arc(region.screenX, region.screenY, (1 - halo) * ringMax * s + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        region.halo = Math.max(0, region.halo - dtSec / 1.1);
      }
    }
  }

  private drawUsers(dt: number, dtSec: number) {
    const ctx = this.ctx;
    const hoverRadius = this.isMobile ? 80 : 70;

    for (let i = this.users.length - 1; i >= 0; i--) {
      const user = this.users[i];
      user.t += dtSec;

      if (user.state === 'in' && user.t >= USER_IN_DUR) {
        user.state = 'live';
        user.t = 0;
      } else if (user.state === 'live' && user.t >= user.liveDur) {
        user.state = 'out';
        user.t = 0;
        if (user.arc && user.arc.state !== 'fade') {
          user.arc.state = 'fade';
          user.arc.t = 0;
        }
      } else if (user.state === 'out' && user.t >= USER_OUT_DUR) {
        this.users.splice(i, 1);
        continue;
      }

      this.project3(user.point.x, user.point.y, user.point.z);
      const depth = this.proj.depth;
      const da = this.depthAlpha(depth);
      const depthFactor = da * da;
      if (depthFactor < 0.04) continue;

      let pop = 1;
      if (user.state === 'in') pop = easeOutBack(user.t / USER_IN_DUR);
      else if (user.state === 'out') pop = 1 - user.t / USER_OUT_DUR;

      const wobbleX = Math.sin(user.t * user.wobbleA) * 2.2 * this.proj.scale;
      const wobbleY = Math.cos(user.t * user.wobbleB) * 2 * this.proj.scale;
      const sx = this.proj.x + wobbleX;
      const sy = this.proj.y + wobbleY;

      const dx = sx - this.mouseX;
      const dy = sy - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetHighlight = dist < hoverRadius ? 1 : 0;
      user.highlight += (targetHighlight - user.highlight) * 0.1 * dt;
      const glow = user.highlight;

      const scale = this.proj.scale * 0.55 * pop * (1 + glow * 0.45);
      const alpha = depthFactor * this.fade * Math.min(1, pop);
      const size = CURSOR_SIZE * scale;

      // anchor glow where the session lives
      const groundGlow = 12 * this.proj.scale * pop;
      ctx.globalAlpha = alpha * (user.shared ? 0.4 : 0.28);
      ctx.drawImage(
        user.shared ? this.glowOrange : this.glowTeal,
        this.proj.x - groundGlow / 2,
        this.proj.y - groundGlow / 2,
        groundGlow,
        groundGlow,
      );

      // spawn ring
      if (user.state === 'in') {
        const rt = user.t / USER_IN_DUR;
        ctx.globalAlpha = (1 - rt) * 0.6 * this.fade;
        ctx.strokeStyle = user.shared ? 'rgba(255,150,64,1)' : 'rgba(64,203,232,1)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.proj.x, this.proj.y, rt * 20 * this.proj.scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      const offset = (1.4 + glow * 3) * scale * 4;
      ctx.globalAlpha = alpha * (glow > 0.01 ? 1 - glow * 0.3 : 1);
      ctx.drawImage(this.cursorImages[0], sx - offset, sy - offset * 0.5, size, size);
      ctx.globalAlpha = Math.min(1, alpha * (1 + glow * 0.6));
      ctx.drawImage(this.cursorImages[1], sx + offset * 0.5, sy + offset, size, size);
      ctx.globalAlpha = alpha;
      ctx.drawImage(this.cursorImages[2], sx + offset * 0.3, sy - offset * 0.8, size, size);

      if (glow > 0.01) {
        const hSize = 30 * scale * 4;
        ctx.globalAlpha = glow * 0.35 * this.fade;
        ctx.drawImage(this.glowWhite, sx - hSize / 2, sy - hSize / 2, hSize, hSize);
      }
    }
  }

  private drawLabels() {
    if (this.labels.length === 0) return;
    const ctx = this.ctx;
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    for (const label of this.labels) {
      ctx.globalAlpha = label.alpha;
      ctx.fillStyle = label.shared ? '#ffb27a' : '#9fe4f5';
      ctx.fillText(label.text, label.x, label.y);
    }
  }

  updateScroll(scrollY: number) {
    this.rawScroll = scrollY;
    if (this.reducedMotion) return;
    this.updateFade();
  }

  updateMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  resize(width: number, height: number) {
    if (this.destroyed) return;
    this.updateSize(width, height);
    if (this.reducedMotion) this.renderFrame(0, 0);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animId);
  }
}
