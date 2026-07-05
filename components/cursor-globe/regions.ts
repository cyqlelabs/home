import { type Region } from './types';

// Datacenter nodes shown on the globe. lat/lng are approximate city coordinates;
// update when nodes are added or moved.
export const REGIONS: Region[] = [
  { id: 'eu-frankfurt', lat: 50.11, lng: 8.68, status: 'live' },
  { id: 'eu-amsterdam', lat: 52.37, lng: 4.9, status: 'live' },
  { id: 'us-east', lat: 39.04, lng: -77.49, status: 'live' },
  { id: 'ap-singapore', lat: 1.35, lng: 103.82, status: 'soon' },
  { id: 'sa-saopaulo', lat: -23.55, lng: -46.63, status: 'soon' },
];
