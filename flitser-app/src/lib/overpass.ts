import type { CameraPoint, CameraType } from './types';
import { bboxAround, type LatLon } from './geo';

// Public Overpass mirrors, tried in order. Self-hosting is recommended for
// heavy/production use - see README.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

function buildQuery(bbox: { south: number; west: number; north: number; east: number }) {
  const b = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  return `
    [out:json][timeout:25];
    (
      node["highway"="speed_camera"](${b});
      node["enforcement"="maxspeed"](${b});
      node["enforcement"="average_speed"](${b});
      node["highway"="traffic_signals"]["traffic_signals:sensor"="speed_camera"](${b});
    );
    out body;
  `.trim();
}

interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

function classify(tags: Record<string, string> = {}): CameraType {
  if (tags.enforcement === 'average_speed') {
    // OSM tags average-speed sections as relations; individual nodes don't
    // reliably distinguish start/end, so we treat every node as a section marker.
    return 'average_start';
  }
  if (tags.highway === 'speed_camera' || tags.enforcement === 'maxspeed') {
    return 'fixed';
  }
  if (tags['traffic_signals:sensor'] === 'speed_camera') return 'fixed';
  return 'unknown';
}

function parseMaxspeed(tags: Record<string, string> = {}): number | undefined {
  const raw = tags.maxspeed;
  if (!raw) return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseDirection(tags: Record<string, string> = {}): number | undefined {
  const raw = tags.direction;
  if (!raw) return undefined;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
}

export async function fetchCamerasNearby(
  center: LatLon,
  radiusM: number,
  signal?: AbortSignal,
): Promise<CameraPoint[]> {
  const bbox = bboxAround(center, radiusM);
  const query = buildQuery(bbox);
  const body = 'data=' + encodeURIComponent(query);

  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal,
      });
      if (!res.ok) throw new Error(`Overpass ${endpoint} responded ${res.status}`);
      const json = (await res.json()) as { elements: OverpassNode[] };
      return json.elements
        .filter((el) => typeof el.lat === 'number' && typeof el.lon === 'number')
        .map((el) => ({
          id: `osm:${el.id}`,
          lat: el.lat,
          lon: el.lon,
          type: classify(el.tags),
          source: 'osm' as const,
          maxspeed: parseMaxspeed(el.tags),
          direction: parseDirection(el.tags),
        }));
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') throw err;
      lastError = err;
      // try next mirror
    }
  }
  throw lastError ?? new Error('All Overpass endpoints failed');
}
