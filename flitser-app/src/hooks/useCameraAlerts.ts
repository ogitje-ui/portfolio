import { useEffect, useRef, useState } from 'react';
import { bearingDegrees, bearingDiff, distanceMeters } from '../lib/geo';
import { playCloseAlert, playFarAlert, playNearAlert } from '../lib/sound';
import { announceCamera } from '../lib/voice';
import type { AlertStage, AppSettings, CameraPoint, GeoPosition } from '../lib/types';

export interface ActiveAlert {
  camera: CameraPoint;
  distanceM: number;
  stage: AlertStage;
}

const AHEAD_CONE_DEGREES = 100; // ignore cameras well behind the direction of travel
const CLOSE_DISTANCE_M = 150;
const MIN_SPEED_FOR_HEADING_FILTER = 2; // m/s, below this we can't trust heading

function stageFor(distanceM: number, alertDistanceM: number): AlertStage {
  if (distanceM <= CLOSE_DISTANCE_M) return 'close';
  if (distanceM <= alertDistanceM * 0.4) return 'near';
  if (distanceM <= alertDistanceM) return 'far';
  return null;
}

function fireAlert(stage: AlertStage, camera: CameraPoint, distanceM: number, settings: AppSettings) {
  if (settings.soundEnabled) {
    if (stage === 'far') playFarAlert();
    else if (stage === 'near') playNearAlert();
    else if (stage === 'close') playCloseAlert();
  }
  if (settings.voiceEnabled && stage) {
    announceCamera(camera.type, distanceM, settings.units);
  }
  if (
    stage === 'near' &&
    'Notification' in window &&
    Notification.permission === 'granted' &&
    document.hidden
  ) {
    new Notification('Speed camera ahead', {
      body: `${Math.round(distanceM)} m`,
      tag: camera.id,
    });
  }
}

export function useCameraAlerts(
  cameras: CameraPoint[],
  position: GeoPosition | null,
  settings: AppSettings,
): ActiveAlert | null {
  const [active, setActive] = useState<ActiveAlert | null>(null);
  const triggeredStages = useRef<Map<string, AlertStage>>(new Map());

  useEffect(() => {
    if (!position || cameras.length === 0) {
      setActive(null);
      return;
    }

    const canFilterByHeading =
      position.heading != null &&
      position.speed != null &&
      position.speed >= MIN_SPEED_FOR_HEADING_FILTER;

    let nearest: ActiveAlert | null = null;
    const seenThisTick = new Set<string>();

    for (const camera of cameras) {
      const distanceM = distanceMeters(position, camera);
      if (distanceM > settings.alertDistanceM) continue;

      if (canFilterByHeading) {
        const bearingToCamera = bearingDegrees(position, camera);
        const diff = bearingDiff(position.heading as number, bearingToCamera);
        if (diff > AHEAD_CONE_DEGREES) continue;
      }

      seenThisTick.add(camera.id);
      const stage = stageFor(distanceM, settings.alertDistanceM);
      if (!nearest || distanceM < nearest.distanceM) {
        nearest = { camera, distanceM, stage };
      }

      const lastStage = triggeredStages.current.get(camera.id) ?? null;
      if (stage && stage !== lastStage) {
        const stageRank = { far: 1, near: 2, close: 3 } as const;
        const lastRank = lastStage ? stageRank[lastStage] : 0;
        if (stageRank[stage] > lastRank) {
          fireAlert(stage, camera, distanceM, settings);
        }
        triggeredStages.current.set(camera.id, stage);
      }
    }

    // Forget cameras we've driven away from so a future approach can re-alert.
    for (const id of triggeredStages.current.keys()) {
      if (!seenThisTick.has(id)) triggeredStages.current.delete(id);
    }

    setActive(nearest);
  }, [cameras, position, settings]);

  return active;
}
