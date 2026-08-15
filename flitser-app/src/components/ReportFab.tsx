import { useState } from 'react';
import type { CameraType } from '../lib/types';

const OPTIONS: { type: CameraType; label: string; emoji: string; ttlHours: number }[] = [
  { type: 'mobile', label: 'Mobile radar', emoji: '🚓', ttlHours: 4 },
  { type: 'hazard', label: 'Hazard', emoji: '⚠️', ttlHours: 2 },
];

export default function ReportFab({
  disabled,
  onReport,
}: {
  disabled: boolean;
  onReport: (type: CameraType, ttlHours: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}>
      {open && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 10,
            alignItems: 'flex-end',
          }}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                onReport(opt.type, opt.ttlHours);
                setOpen(false);
              }}
              style={{
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 999,
                padding: '8px 14px',
                fontSize: 14,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,.35)',
              }}
            >
              <span>{opt.emoji}</span>
              <span>Report {opt.label} here</span>
            </button>
          ))}
        </div>
      )}
      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        title={disabled ? 'Waiting for GPS fix…' : 'Report'}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: disabled ? '#475569' : '#dc2626',
          color: '#fff',
          fontSize: 26,
          border: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,.4)',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {open ? '×' : '+'}
      </button>
    </div>
  );
}
