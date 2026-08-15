import type { ActiveAlert } from '../hooks/useCameraAlerts';
import { metersToDisplay } from '../lib/geo';
import type { AppSettings } from '../lib/types';

const STAGE_COLOR: Record<string, string> = {
  far: '#eab308',
  near: '#f97316',
  close: '#dc2626',
};

const TYPE_LABEL: Record<string, string> = {
  fixed: 'Speed camera',
  mobile: 'Mobile radar',
  average_start: 'Average speed check',
  average_end: 'Average speed check',
  redlight: 'Red light camera',
  hazard: 'Hazard',
  unknown: 'Speed camera',
};

export default function AlertBanner({
  alert,
  units,
}: {
  alert: ActiveAlert | null;
  units: AppSettings['units'];
}) {
  if (!alert || !alert.stage) return null;
  const color = STAGE_COLOR[alert.stage] ?? '#eab308';
  const label = TYPE_LABEL[alert.camera.type] ?? 'Speed camera';

  return (
    <div
      role="alert"
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: color,
        color: '#fff',
        padding: '10px 20px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 16,
        boxShadow: '0 4px 14px rgba(0,0,0,.35)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{label}</span>
      <span>·</span>
      <span>{metersToDisplay(alert.distanceM, units)}</span>
      {alert.camera.maxspeed && (
        <>
          <span>·</span>
          <span>{alert.camera.maxspeed} km/h</span>
        </>
      )}
    </div>
  );
}
