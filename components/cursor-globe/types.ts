export interface SpherePoint {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedCursor {
  screenX: number;
  screenY: number;
  scale: number;
  alpha: number;
  depth: number;
}

export interface GlobeConfig {
  cursorCount: number;
  radius: number;
  fov: number;
  tiltX: number;
  rotationSpeed: number;
  resolution: number;
}
