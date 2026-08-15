import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppSettings, CameraPoint } from './types';

interface FlitserDB extends DBSchema {
  cameraCache: {
    key: string;
    value: CameraPoint;
  };
  reports: {
    key: string;
    value: CameraPoint;
  };
  meta: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<FlitserDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<FlitserDB>('flitser-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cameraCache')) {
          db.createObjectStore('cameraCache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      },
    });
  }
  return dbPromise;
}

export async function cacheCameras(cameras: CameraPoint[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('cameraCache', 'readwrite');
  await Promise.all(cameras.map((c) => tx.store.put(c)));
  await tx.done;
}

export async function getCachedCameras(): Promise<CameraPoint[]> {
  const db = await getDb();
  return db.getAll('cameraCache');
}

export async function addReport(report: CameraPoint): Promise<void> {
  const db = await getDb();
  await db.put('reports', report);
}

export async function deleteReport(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('reports', id);
}

export async function getReports(): Promise<CameraPoint[]> {
  const db = await getDb();
  const all = await db.getAll('reports');
  const now = Date.now();
  const expired = all.filter((r) => r.expiresAt && r.expiresAt < now);
  if (expired.length) {
    const tx = db.transaction('reports', 'readwrite');
    await Promise.all(expired.map((r) => tx.store.delete(r.id)));
    await tx.done;
  }
  return all.filter((r) => !r.expiresAt || r.expiresAt >= now);
}

export async function getSettings(): Promise<Partial<AppSettings> | undefined> {
  const db = await getDb();
  return db.get('meta', 'settings') as Promise<Partial<AppSettings> | undefined>;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDb();
  await db.put('meta', settings, 'settings');
}

export async function getLastFetchCenter(): Promise<{ lat: number; lon: number } | undefined> {
  const db = await getDb();
  return db.get('meta', 'lastFetchCenter') as Promise<{ lat: number; lon: number } | undefined>;
}

export async function setLastFetchCenter(center: { lat: number; lon: number }): Promise<void> {
  const db = await getDb();
  await db.put('meta', center, 'lastFetchCenter');
}
