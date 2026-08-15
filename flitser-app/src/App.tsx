import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from './components/MapView';
import AlertBanner from './components/AlertBanner';
import SpeedHud from './components/SpeedHud';
import TopBar from './components/TopBar';
import ReportFab from './components/ReportFab';
import SettingsDrawer from './components/SettingsDrawer';
import Onboarding from './components/Onboarding';
import { useGeolocation } from './hooks/useGeolocation';
import { useCameraAlerts } from './hooks/useCameraAlerts';
import { fetchCamerasNearby } from './lib/overpass';
import {
  addReport,
  cacheCameras,
  deleteReport,
  getCachedCameras,
  getLastFetchCenter,
  getReports,
  getSettings,
  saveSettings,
  setLastFetchCenter,
} from './lib/db';
import { distanceMeters } from './lib/geo';
import { primeAudio } from './lib/sound';
import { DEFAULT_SETTINGS, type AppSettings, type CameraPoint, type CameraType } from './lib/types';

const FETCH_RADIUS_M = 3000;
const REFETCH_TRIGGER_M = 1200; // re-query Overpass once we've drifted this far from the last query center
const MIN_REFETCH_INTERVAL_MS = 45_000;

export default function App() {
  const [started, setStarted] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [followMe, setFollowMe] = useState(true);
  const [osmCameras, setOsmCameras] = useState<CameraPoint[]>([]);
  const [reports, setReports] = useState<CameraPoint[]>([]);

  const { position, error: geoError } = useGeolocation(started);
  const lastFetchRef = useRef<{ center: { lat: number; lon: number } | null; at: number }>({
    center: null,
    at: 0,
  });

  // Load persisted settings + cached cameras + reports once.
  useEffect(() => {
    (async () => {
      const [savedSettings, cached, savedReports, lastCenter] = await Promise.all([
        getSettings(),
        getCachedCameras(),
        getReports(),
        getLastFetchCenter(),
      ]);
      if (savedSettings) setSettings((s) => ({ ...s, ...savedSettings }));
      setOsmCameras(cached);
      setReports(savedReports);
      if (lastCenter) lastFetchRef.current.center = lastCenter;
    })();
  }, []);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const updateSettings = useCallback((next: AppSettings) => {
    setSettings(next);
    void saveSettings(next);
  }, []);

  const handleStart = useCallback(() => {
    primeAudio();
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
    setStarted(true);
  }, []);

  // Fetch/refresh nearby cameras from OSM as the user moves.
  useEffect(() => {
    if (!position) return;
    const { center, at } = lastFetchRef.current;
    const movedFar = !center || distanceMeters(center, position) > REFETCH_TRIGGER_M;
    const longEnoughSince = Date.now() - at > MIN_REFETCH_INTERVAL_MS;
    if (!movedFar || !longEnoughSince) return;

    lastFetchRef.current = { center: { lat: position.lat, lon: position.lon }, at: Date.now() };
    const controller = new AbortController();

    fetchCamerasNearby(position, FETCH_RADIUS_M, controller.signal)
      .then((cams) => {
        setOsmCameras(cams);
        void cacheCameras(cams);
        void setLastFetchCenter({ lat: position.lat, lon: position.lon });
      })
      .catch((err) => {
        if ((err as { name?: string }).name !== 'AbortError') {
          console.warn('Camera fetch failed, using cached data:', err);
        }
      });

    return () => controller.abort();
  }, [position]);

  const cameras = useMemo(() => [...osmCameras, ...reports], [osmCameras, reports]);
  const activeAlert = useCameraAlerts(cameras, position, settings);

  const handleReport = useCallback(
    (type: CameraType, ttlHours: number) => {
      if (!position) return;
      const now = Date.now();
      const report: CameraPoint = {
        id: `user:${now}-${Math.round(Math.random() * 1e6)}`,
        lat: position.lat,
        lon: position.lon,
        type,
        source: 'user',
        createdAt: now,
        expiresAt: now + ttlHours * 3600_000,
      };
      setReports((r) => [...r, report]);
      void addReport(report);
    },
    [position],
  );

  const handleDeleteReport = useCallback((id: string) => {
    setReports((r) => r.filter((c) => c.id !== id));
    void deleteReport(id);
  }, []);

  if (!started) return <Onboarding onStart={handleStart} />;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0f172a' }}>
      <MapView
        position={position}
        cameras={cameras}
        alertDistanceM={settings.alertDistanceM}
        followMe={followMe}
        onUserPan={() => setFollowMe(false)}
        onDeleteReport={handleDeleteReport}
      />

      <AlertBanner alert={activeAlert} units={settings.units} />

      <TopBar
        onOpenSettings={() => setSettingsOpen(true)}
        followMe={followMe}
        onRecenter={() => setFollowMe(true)}
        gpsAccuracy={position?.accuracy ?? null}
      />

      <SpeedHud position={position} units={settings.units} />

      <ReportFab disabled={!position} onReport={handleReport} />

      <SettingsDrawer
        open={settingsOpen}
        settings={settings}
        onChange={updateSettings}
        onClose={() => setSettingsOpen(false)}
      />

      {geoError && (
        <div
          style={{
            position: 'absolute',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#7f1d1d',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 13,
            zIndex: 1000,
            maxWidth: '85%',
            textAlign: 'center',
          }}
        >
          Location error: {geoError}. Allow location access to get alerts.
        </div>
      )}
    </div>
  );
}
