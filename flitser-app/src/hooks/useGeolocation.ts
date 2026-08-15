import { useEffect, useRef, useState } from 'react';
import { bearingDegrees, distanceMeters } from '../lib/geo';
import type { GeoPosition } from '../lib/types';

interface GeolocationState {
  position: GeoPosition | null;
  error: string | null;
  supported: boolean;
}

export function useGeolocation(active: boolean): GeolocationState {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prevRef = useRef<GeoPosition | null>(null);

  useEffect(() => {
    if (!active) return;
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading, speed } = pos.coords;
        let resolvedHeading = heading;

        // iOS Safari rarely reports heading while stationary; derive it from
        // successive fixes once the device has moved enough to be reliable.
        const prev = prevRef.current;
        if (
          (resolvedHeading == null || Number.isNaN(resolvedHeading)) &&
          prev
        ) {
          const moved = distanceMeters(prev, { lat: latitude, lon: longitude });
          if (moved > 5) {
            resolvedHeading = bearingDegrees(prev, { lat: latitude, lon: longitude });
          } else {
            resolvedHeading = prev.heading;
          }
        }

        const next: GeoPosition = {
          lat: latitude,
          lon: longitude,
          accuracy,
          heading: resolvedHeading ?? null,
          speed,
          timestamp: pos.timestamp,
        };
        prevRef.current = next;
        setPosition(next);
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [active]);

  return { position, error, supported: 'geolocation' in navigator };
}
