export default function Onboarding({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3000,
        background: '#0f172a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
        gap: 16,
      }}
    >
      <div style={{ fontSize: 52 }}>📷🚫</div>
      <h1 style={{ margin: 0, fontSize: 24 }}>Flitser Alert</h1>
      <p style={{ color: '#94a3b8', maxWidth: 340, lineHeight: 1.5 }}>
        Free, open-source speed camera warnings from OpenStreetMap data. Runs
        entirely in your browser — nothing is sent to a server.
      </p>
      <p style={{ color: '#94a3b8', maxWidth: 340, fontSize: 13, lineHeight: 1.5 }}>
        We'll ask for your location to show nearby cameras, and optionally for
        notification and sound permission for alerts. Keep this tab open and
        your phone unlocked while navigating — see the README for iOS
        background limitations.
      </p>
      <button
        onClick={onStart}
        style={{
          marginTop: 8,
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 999,
          padding: '14px 36px',
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Start driving
      </button>
      <p style={{ color: '#475569', fontSize: 11, maxWidth: 340, marginTop: 8 }}>
        Speed camera warning devices/apps are legal in some countries and
        restricted in others. You're responsible for checking local law and
        for driving within the speed limit regardless of alerts.
      </p>
    </div>
  );
}
