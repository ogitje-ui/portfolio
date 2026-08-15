export type CameraType =
  | 'fixed'
  | 'mobile'
  | 'average_start'
  | 'average_end'
  | 'redlight'
  | 'hazard'
  | 'unknown';

export type CameraSource = 'osm' | 'user';

export interface CameraPoint {
  /** Stable id, e.g. `osm:123456` or `user:<uuid>` */
  id: string;
  lat: number;
  lon: number;
  type: CameraType;
  source: CameraSource;
  /** Speed limit enforced, km/h, if known */
  maxspeed?: number;
  /** Direction the camera faces / traffic is checked, degrees 0-360, if known */
  direction?: number;
  /** epoch ms - when a user report was created */
  createdAt?: number;
  /** epoch ms - when a user report should stop being shown (mobile radars move) */
  expiresAt?: number;
  note?: string;
}

export interface GeoPosition {
  lat: number;
  lon: number;
  accuracy: number;
  heading: number | null;
  speed: number | null; // m/s
  timestamp: number;
}

export type AlertStage = 'far' | 'near' | 'close' | null;

export interface AppSettings {
  alertDistanceM: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  units: 'km' | 'mi';
}

export const DEFAULT_SETTINGS: AppSettings = {
  alertDistanceM: 750,
  soundEnabled: true,
  voiceEnabled: true,
  units: 'km',
};
