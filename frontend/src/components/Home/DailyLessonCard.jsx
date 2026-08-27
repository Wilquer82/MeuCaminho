export default function DailyLessonCard({ lesson, onStart, loading }) {
  if (!lesson) {
    return (
      <div style={{
        background: 'var(--card)',
        border: '2px dashed var(--border)',
        borderRadius: 16,
        padding: 20,
        textAlign: 'center',
        color: 'var(--muted)'
      }}>
        Carregando lição de hoje...
      </div>
    );
  }

  return (
    <div
      onClick={!loading ? onStart : undefined}
      className="card-tap"
      style={{
        background: 'var(--card)',
        border: '2px solid var(--border)',
        borderRadius: 16,
        padding: 14,
        cursor: loading ? 'wait' : 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'var(--accent-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            {lesson.title}
          </p>
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: '3px 0 0' }}>
            {lesson.reference} · +{lesson.xpReward} XP
          </p>
        </div>

        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>

      {/* Dica de Hebraico/Grego */}
      {(lesson.hebrewTip || lesson.greekTip) && (
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px dashed var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: lesson.hebrewTip ? 'rgba(124,58,237,.12)' : 'rgba(13,148,136,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 700,
            color: lesson.hebrewTip ? 'var(--premium)' : '#0d9488'
          }}>
            {lesson.hebrewTip ? 'א' : 'Λ'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 10,
              fontWeight: 600,
              margin: '0 0 2px',
              color: lesson.hebrewTip ? 'var(--premium)' : '#0d9488'
            }}>
              DICA DE {lesson.hebrewTip ? 'HEBRAICO' : 'GREGO'}
            </p>
            {lesson.hebrewTip && (
              <>
                <p className="hebrew-text" style={{ fontSize: 14, margin: '0 0 2px' }}>
                  {lesson.hebrewTip.word}
                </p>
                <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  <strong>{lesson.hebrewTip.transliteration}</strong> — {lesson.hebrewTip.meaning}
                </p>
              </>
            )}
            {lesson.greekTip && (
              <>
                <p style={{ fontSize: 14, fontStyle: 'italic', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>
                  {lesson.greekTip.word}
                </p>
                <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                  <strong>{lesson.greekTip.transliteration}</strong> — {lesson.greekTip.meaning}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
