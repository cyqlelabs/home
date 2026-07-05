export interface SpherePoint {
  x: number;
  y: number;
  z: number;
}

export type RegionStatus = 'live' | 'soon';

export interface Region {
  id: string;
  lat: number;
  lng: number;
  status: RegionStatus;
}
