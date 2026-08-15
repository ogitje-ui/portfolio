const EARTH_RADIUS_M = 6371000;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export interface LatLon {
  lat: number;
  lon: number;
}

/** Great-circle distance between two points, in meters. */
export function distanceMeters(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

/** Initial bearing from a to b, in degrees 0-360 (0 = north). */
export function bearingDegrees(a: LatLon, b: LatLon): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLon = toRad(b.lon - a.lon);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Smallest absolute difference between two bearings, 0-180 degrees. */
export function bearingDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/** Bounding box [south, west, north, east] expanded by radiusM around a center point. */
export function bboxAround(center: LatLon, radiusM: number) {
  const latDelta = radiusM / 111320; // meters per degree latitude
  const lonDelta =
    radiusM / (111320 * Math.max(0.1, Math.cos(toRad(center.lat))));
  return {
    south: center.lat - latDelta,
    west: center.lon - lonDelta,
    north: center.lat + latDelta,
    east: center.lon + lonDelta,
  };
}

export function metersToDisplay(meters: number, units: 'km' | 'mi'): string {
  if (units === 'mi') {
    const feet = meters * 3.28084;
    if (feet < 1000) return `${Math.round(feet)} ft`;
    return `${(meters / 1609.344).toFixed(1)} mi`;
  }
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function speedToDisplay(
  metersPerSecond: number | null,
  units: 'km' | 'mi',
): number {
  if (metersPerSecond == null || Number.isNaN(metersPerSecond)) return 0;
  const kmh = metersPerSecond * 3.6;
  return Math.max(0, Math.round(units === 'mi' ? kmh * 0.621371 : kmh));
}
