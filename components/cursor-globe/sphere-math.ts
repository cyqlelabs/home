import { type SpherePoint } from './types';

const DEG = Math.PI / 180;

export function latLngToPoint(lat: number, lng: number): SpherePoint {
  const la = lat * DEG;
  const lo = lng * DEG;
  const cosLa = Math.cos(la);
  return {
    x: cosLa * Math.sin(lo),
    y: -Math.sin(la),
    z: -cosLa * Math.cos(lo),
  };
}

export function rotateX(point: SpherePoint, angle: number): SpherePoint {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

export function angleBetween(a: SpherePoint, b: SpherePoint): number {
  const dot = a.x * b.x + a.y * b.y + a.z * b.z;
  return Math.acos(Math.min(1, Math.max(-1, dot)));
}

// Great-circle arc between two unit vectors, lifted above the surface.
// Returns segs+1 points as xyz triples in globe-local space (radius multiples).
export function buildArcPoints(a: SpherePoint, b: SpherePoint, segs: number): Float32Array {
  const omega = angleBetween(a, b);
  const sinOmega = Math.sin(omega);
  const pts = new Float32Array((segs + 1) * 3);
  const maxLift = 0.05 + omega * 0.18;

  for (let k = 0; k <= segs; k++) {
    const t = k / segs;
    let w1: number;
    let w2: number;
    if (sinOmega < 1e-4) {
      w1 = 1 - t;
      w2 = t;
    } else {
      w1 = Math.sin((1 - t) * omega) / sinOmega;
      w2 = Math.sin(t * omega) / sinOmega;
    }
    let x = a.x * w1 + b.x * w2;
    let y = a.y * w1 + b.y * w2;
    let z = a.z * w1 + b.z * w2;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const r = (1 + Math.sin(Math.PI * t) * maxLift) / len;
    x *= r;
    y *= r;
    z *= r;
    pts[k * 3] = x;
    pts[k * 3 + 1] = y;
    pts[k * 3 + 2] = z;
  }
  return pts;
}
