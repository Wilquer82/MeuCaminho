import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const leaderboard = [
  { rank: 1, name: 'Mateus', xp: 2340, avatar: 'M', color: '#d4af37' },
  { rank: 2, name: 'Ana', xp: 1890, avatar: 'A', color: '#c0c0c0' },
  { rank: 3, name: 'Você', xp: 1240, avatar: 'D', color: '#cd7f32', isMe: true },
  { rank: 4, name: 'Priscila', xp: 980, avatar: 'P', color: '#0d9488' },
  { rank: 5, name: 'João', xp: 756, avatar: 'J', color: '#ea580c' },
  { rank: 6, name: 'Sarah', xp: 640, avatar: 'S', color: 'var(--premium)' }
];

const activities = [
  { name: 'Sarah', avatar: 'S', color: 'var(--accent2)', action: 'completou Salmos 23', time: 'há 2 horas', xp: 20 },
  { name: 'Mateus', avatar: 'M', color: '#d4af37', action: 'atingiu 30 dias de streak! 🔥', time: 'há 5 horas', xp: 0 },
  { name: 'Priscila', avatar: 'P', color: '#0d9488', action: 'completou a unidade de Teologia', time: 'ontem', xp: 50 }
];

export default function Community() {
  const { user, updateUser } = useAuth();
  const [celebrated, setCelebrated] = useState({});
  const [toast, setToast] = useState(null);

  const celebrate = async (friendName, activityIdx) => {
    if (celebrated[activityIdx]) return;

    setCelebrated(prev => ({ ...prev, [activityIdx]: true }));
    updateUser({ xp: (user?.xp || 0) + 5 });
    setToast(`+5 XP! Você parabenizou ${friendName}`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>Comunidade</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Cresçam juntos na fé
      </p>

      {/* Missão em dupla */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent2-soft), #fff)',
        border: '1px solid var(--accent2)', borderRadius: 16,
        padding: 14, marginBottom: 14
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10
        }}>
          <span style={{ fontSize: 16 }}>🤝</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent2)' }}>
            MISSÃO EM DUPLA
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #4caf50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700
          }}>{user?.name?.charAt(0) || 'D'}</div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 4px' }}>
              Ler João 3 juntos
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <div style={{
                flex: 1, height: 5, background: 'rgba(217,119,6,.2)', borderRadius: 3, overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%', width: '60%', background: 'var(--accent2)', borderRadius: 3
                }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent2)' }}>60%</span>
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent2), #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700
          }}>S</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => celebrate('Sarah', 'duo')}
            disabled={celebrated['duo']}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 10,
              border: celebrated['duo'] ? '1px solid var(--border)' : '1px solid var(--accent2)',
              background: celebrated['duo'] ? 'var(--bg)' : '#fff',
              color: celebrated['duo'] ? 'var(--muted)' : 'var(--accent2)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
            }}
          >{celebrated['duo'] ? '✓ Parabenizado' : '🎉 Parabenizar'}</button>
          <button style={{
            flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none',
            background: 'var(--accent2)', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
          }}>Continuar</button>
        </div>
      </div>

      {/* Ranking */}
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>
        🏆 Ranking semanal · Liga Prata
      </h3>

      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden', marginBottom: 16
      }}>
        {leaderboard.map((user, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              borderBottom: i < leaderboard.length - 1 ? '1px solid var(--border)' : 'none',
              background: user?.isMe ? 'var(--accent-soft)' : 'transparent'
            }}
          >
            <span style={{
              fontSize: 14, fontWeight: 700, width: 20,
              color: user.color
            }}>{user.rank}</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${user.color}, ${user.color}aa)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13
            }}>{user.avatar}</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 13, fontWeight: user.isMe ? 700 : 600, margin: 0,
                color: user.isMe ? 'var(--accent)' : 'var(--text)'
              }}>{user.name}</p>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: user.isMe ? 'var(--accent)' : 'var(--text)'
            }}>{user.xp.toLocaleString('pt-BR')} XP</span>
          </div>
        ))}
      </div>

      {/* Atividade recente */}
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>
        📢 Atividade recente
      </h3>

      {activities.map((activity, i) => (
        <div
          key={i}
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 12, marginBottom: 8
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: activity.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13
            }}>{activity.avatar}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, margin: 0 }}>
                <strong>{activity.name}</strong> {activity.action}
              </p>
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>
                {activity.time}
              </p>
            </div>
          </div>
          <button
            onClick={() => celebrate(activity.name, i)}
            disabled={celebrated[i]}
            style={{
              padding: '5px 12px', borderRadius: 10, border: 'none',
              background: celebrated[i] ? 'var(--bg)' : 'var(--accent-soft)',
              color: celebrated[i] ? 'var(--muted)' : 'var(--accent)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            {celebrated[i] ? '✓ Parabenizado' : '🎉 Parabenizar +5 XP'}
          </button>
        </div>
      ))}

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
