import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Community() {
  const { user, updateUser } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [celebrated, setCelebrated] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/community/leaderboard');
        setRanking(data.map((person, index) => ({
          ...person,
          rank: index + 1,
          avatar: person.name.charAt(0).toUpperCase(),
          color: index < 3 ? ['#d4af37', '#c0c0c0', '#cd7f32'][index] : 'var(--accent2)',
          isMe: person._id === user?._id
        })));
      } catch {
        setRanking([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [user?._id]);

  const celebrate = async (friendId, friendName, activityIdx) => {
    if (celebrated[activityIdx]) return;

    try {
      const { data } = await api.post(`/community/friends/${friendId}/celebrate`);
      setCelebrated(prev => ({ ...prev, [activityIdx]: true }));
      updateUser({ xp: data.newXp });
      setToast(`+${data.xpEarned} XP! Você parabenizou ${friendName}`);
      setTimeout(() => setToast(null), 2500);
    } catch {
      setToast('Não foi possível registrar o parabéns.');
    }
  };

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>Comunidade</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Cresçam juntos na fé
      </p>

      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>
        🏆 Ranking semanal
      </h3>

      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden', marginBottom: 16
      }}>
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Carregando ranking...
          </div>
        ) : ranking.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Nenhum dado de comunidade disponível no momento.
          </div>
        ) : (
          ranking.map((person, i) => (
            <div
              key={person._id || i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                borderBottom: i < ranking.length - 1 ? '1px solid var(--border)' : 'none',
                background: person?.isMe ? 'var(--accent-soft)' : 'transparent'
              }}
            >
              <span style={{
                fontSize: 14, fontWeight: 700, width: 20,
                color: 'var(--text)'
              }}>{person.rank}</span>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${person.color}, ${person.color}aa)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13
              }}>{person.avatar}</div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 13, fontWeight: person.isMe ? 700 : 600, margin: 0,
                  color: person.isMe ? 'var(--accent)' : 'var(--text)'
                }}>{person.name}</p>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: person.isMe ? 'var(--accent)' : 'var(--text)'
              }}>{(person.xp || 0).toLocaleString('pt-BR')} XP</span>
            </div>
          ))
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--accent)', color: '#fff',
          padding: '14px 20px', borderRadius: 14, fontSize: 14, fontWeight: 600,
          zIndex: 1000, boxShadow: '0 10px 40px rgba(41,122,46,.4)',
          animation: 'bounceIn .3s ease'
        }}>{toast}</div>
      )}

    </div>
  );
}
