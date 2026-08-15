import type { AppSettings } from '../lib/types';

export default function SettingsDrawer({
  open,
  settings,
  onChange,
  onClose,
}: {
  open: boolean;
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const update = (patch: Partial<AppSettings>) => onChange({ ...settings, ...patch });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#0f172a',
          color: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 32px',
          boxShadow: '0 -4px 24px rgba(0,0,0,.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Settings</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22 }}
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 13, color: '#94a3b8' }}>
            Alert distance: {settings.alertDistanceM} m
          </label>
          <input
            type="range"
            min={200}
            max={2000}
            step={50}
            value={settings.alertDistanceM}
            onChange={(e) => update({ alertDistanceM: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <ToggleRow
          label="Sound alerts"
          checked={settings.soundEnabled}
          onChange={(v) => update({ soundEnabled: v })}
        />
        <ToggleRow
          label="Voice announcements"
          checked={settings.voiceEnabled}
          onChange={(v) => update({ voiceEnabled: v })}
        />

        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
            Units
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['km', 'mi'] as const).map((u) => (
              <button
                key={u}
                onClick={() => update({ units: u })}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 10,
                  border: 'none',
                  background: settings.units === u ? '#3b82f6' : '#1e293b',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {u === 'km' ? 'km/h' : 'mph'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
      }}
    >
      <span style={{ fontSize: 15 }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          border: 'none',
          background: checked ? '#3b82f6' : '#334155',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .15s',
          }}
        />
      </button>
    </div>
  );
}
