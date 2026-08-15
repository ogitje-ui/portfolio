import { speedToDisplay } from '../lib/geo';
import type { AppSettings, GeoPosition } from '../lib/types';

export default function SpeedHud({
  position,
  units,
}: {
  position: GeoPosition | null;
  units: AppSettings['units'];
}) {
  const speed = speedToDisplay(position?.speed ?? null, units);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 1000,
        background: 'rgba(15,23,42,.85)',
        color: '#fff',
        borderRadius: 16,
        padding: '10px 16px',
        minWidth: 90,
        textAlign: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,.35)',
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{speed}</div>
      <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
        {units === 'mi' ? 'mph' : 'km/h'}
      </div>
    </div>
  );
}
