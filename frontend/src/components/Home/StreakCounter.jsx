export default function StreakCounter({ streak, bestStreak }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--accent2-soft)',
      padding: '6px 12px',
      borderRadius: 20,
      border: '1px solid var(--accent2)'
    }}>
      <span className="flicker" style={{ fontSize: 16 }}>🔥</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent2)' }}>
        {streak} dias
      </span>
      {bestStreak && bestStreak > streak && (
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>
          (recorde: {bestStreak})
        </span>
      )}
    </div>
  );
}
