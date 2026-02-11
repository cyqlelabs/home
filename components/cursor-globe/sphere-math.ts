import { type SpherePoint, type ProjectedCursor } from './types';

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export function fibonacciSphere(count: number): SpherePoint[] {
  const points: SpherePoint[] = [];
  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / GOLDEN_RATIO;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
    });
  }
  return points;
}

export function rotateY(point: SpherePoint, angle: number): SpherePoint {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
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

export function project(
  point: SpherePoint,
  radius: number,
  centerX: number,
  centerY: number,
  fov: number,
): ProjectedCursor {
  const z = point.z * radius;
  const scaleFactor = fov / (fov + z);
  const screenX = centerX + point.x * radius * scaleFactor;
  const screenY = centerY + point.y * radius * scaleFactor;
  const alpha = 0.3 + 0.7 * ((point.z + 1) / 2);

  return {
    screenX,
    screenY,
    scale: scaleFactor,
    alpha,
    depth: point.z,
  };
}
