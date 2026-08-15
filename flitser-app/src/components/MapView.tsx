import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { CameraPoint, GeoPosition } from '../lib/types';

import 'leaflet/dist/leaflet.css';

const CAMERA_STYLE: Record<string, { emoji: string; color: string }> = {
  fixed: { emoji: '📷', color: '#f97316' },
  mobile: { emoji: '🚓', color: '#ef4444' },
  average_start: { emoji: '⏱️', color: '#a855f7' },
  average_end: { emoji: '⏱️', color: '#a855f7' },
  redlight: { emoji: '🚦', color: '#ef4444' },
  hazard: { emoji: '⚠️', color: '#eab308' },
  unknown: { emoji: '📷', color: '#94a3b8' },
};

function cameraIcon(camera: CameraPoint) {
  const style = CAMERA_STYLE[camera.type] ?? CAMERA_STYLE.unknown;
  const ring = camera.source === 'user' ? '2px dashed #fff' : '2px solid #fff';
  return L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:${style.color};border:${ring};
      display:flex;align-items:center;justify-content:center;
      font-size:15px;box-shadow:0 1px 4px rgba(0,0,0,.4);
    ">${style.emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function userIcon(heading: number | null) {
  const arrow = heading != null;
  return L.divIcon({
    className: '',
    html: arrow
      ? `<div style="transform: rotate(${heading}deg); width:34px;height:34px;">
           <div style="
             width:0;height:0;margin:7px auto 0;
             border-left:9px solid transparent;border-right:9px solid transparent;
             border-bottom:18px solid #3b82f6;
             filter: drop-shadow(0 1px 2px rgba(0,0,0,.5));
           "></div>
         </div>`
      : `<div style="
           width:18px;height:18px;border-radius:50%;background:#3b82f6;
           border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.5);
           margin:8px;
         "></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function FollowController({
  position,
  followMe,
  onUserPan,
}: {
  position: GeoPosition | null;
  followMe: boolean;
  onUserPan: () => void;
}) {
  const map = useMap();
  const programmaticMove = useRef(false);

  useEffect(() => {
    if (followMe && position) {
      programmaticMove.current = true;
      map.setView([position.lat, position.lon], Math.max(map.getZoom(), 16), {
        animate: true,
      });
    }
  }, [followMe, position, map]);

  useMapEvents({
    dragstart() {
      if (!programmaticMove.current) onUserPan();
      programmaticMove.current = false;
    },
    zoomstart() {
      programmaticMove.current = false;
    },
  });

  return null;
}

interface MapViewProps {
  position: GeoPosition | null;
  cameras: CameraPoint[];
  alertDistanceM: number;
  followMe: boolean;
  onUserPan: () => void;
  onDeleteReport: (id: string) => void;
}

export default function MapView({
  position,
  cameras,
  alertDistanceM,
  followMe,
  onUserPan,
  onDeleteReport,
}: MapViewProps) {
  const initialCenter: [number, number] = position
    ? [position.lat, position.lon]
    : [52.132633, 5.291266]; // Netherlands, sensible default before GPS locks

  return (
    <MapContainer
      center={initialCenter}
      zoom={position ? 16 : 7}
      zoomControl={false}
      attributionControl={true}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      <FollowController position={position} followMe={followMe} onUserPan={onUserPan} />

      {position && (
        <>
          <Marker position={[position.lat, position.lon]} icon={userIcon(position.heading)} />
          <Circle
            center={[position.lat, position.lon]}
            radius={alertDistanceM}
            pathOptions={{ color: '#3b82f6', weight: 1, fillOpacity: 0.03, dashArray: '4 6' }}
          />
        </>
      )}

      {cameras.map((camera) => (
        <Marker key={camera.id} position={[camera.lat, camera.lon]} icon={cameraIcon(camera)}>
          <Popup>
            <div style={{ fontSize: 13 }}>
              <strong>{labelFor(camera)}</strong>
              {camera.maxspeed && <div>Limit: {camera.maxspeed} km/h</div>}
              {camera.source === 'user' && (
                <button
                  onClick={() => onDeleteReport(camera.id)}
                  style={{ marginTop: 6, color: '#dc2626', cursor: 'pointer' }}
                >
                  Remove my report
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function labelFor(camera: CameraPoint): string {
  switch (camera.type) {
    case 'fixed':
      return 'Fixed speed camera';
    case 'mobile':
      return 'Mobile radar (community report)';
    case 'average_start':
    case 'average_end':
      return 'Average speed check section';
    case 'redlight':
      return 'Red light camera';
    case 'hazard':
      return 'Reported hazard';
    default:
      return 'Speed camera';
  }
}
