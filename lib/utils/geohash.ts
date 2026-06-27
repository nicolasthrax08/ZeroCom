// Lightweight geohash-style coordinate encoding (production would use AMap/Gaode or PostGIS).
// Uses encoded-like string from lat/lng rounded to ~10m precision.

function encodeCoord(n: number, positive: boolean): string {
  return Math.floor((n + (positive ? 90 : 180)) * 10000).toString(36);
}

export function makeGeoHash(lat: number, lng: number): string {
  return `${encodeCoord(lat, true)}.${encodeCoord(lng, false)}`;
}

export function within50m(aLat: number, aLng: number, bLat: number, bLng: number): boolean {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x)) <= 50;
}

export function randomOffset(scale = 0.01): number {
  return (Math.random() - 0.5) * scale;
}
