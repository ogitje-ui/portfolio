export default function TopBar({
  onOpenSettings,
  followMe,
  onRecenter,
  gpsAccuracy,
}: {
  onOpenSettings: () => void;
  followMe: boolean;
  onRecenter: () => void;
  gpsAccuracy: number | null;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1000,
        display: 'flex',
        gap: 8,
      }}
    >
      {!followMe && (
        <IconButton onClick={onRecenter} title="Recenter">
          🎯
        </IconButton>
      )}
      <IconButton onClick={onOpenSettings} title="Settings">
        ⚙️
      </IconButton>
      {gpsAccuracy != null && gpsAccuracy > 50 && (
        <span
          style={{
            alignSelf: 'center',
            background: 'rgba(15,23,42,.85)',
            color: '#eab308',
            fontSize: 11,
            padding: '4px 8px',
            borderRadius: 999,
          }}
        >
          Weak GPS
        </span>
      )}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        width: 42,
        height: 42,
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(15,23,42,.85)',
        fontSize: 18,
        boxShadow: '0 4px 14px rgba(0,0,0,.35)',
      }}
    >
      {children}
    </button>
  );
}
