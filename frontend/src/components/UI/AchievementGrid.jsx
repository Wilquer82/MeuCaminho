import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AchievementGrid() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data } = await api.get('/achievements/me');
      setAchievements(data);
    } catch (err) {
      console.error('Erro ao carregar conquistas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 20 }}>Carregando...</div>;
  }

  const tiers = {
    bronze: { color: '#CD7F32', label: 'Bronze' },
    prata: { color: '#C0C0C0', label: 'Prata' },
    ouro: { color: '#FFD700', label: 'Ouro' },
    diamante: { color: '#00FFFF', label: 'Diamante' }
  };

  const grouped = achievements.reduce((acc, ach) => {
    const tier = ach.tier || 'bronze';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(ach);
    return acc;
  }, {});

  return (
    <div style={{ marginTop: 20 }}>
      {Object.entries(grouped).map(([tier, achs]) => (
        <div key={tier} style={{ marginBottom: 24 }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 700,
            color: tiers[tier].color,
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '.1em'
          }}>
            {tiers[tier].label}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: 12
          }}>
            {achs.map(ach => (
              <div
                key={ach.id}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: ach.unlocked ? 'var(--card)' : 'var(--bg)',
                  border: `2px solid ${ach.unlocked ? tiers[tier].color : 'var(--border)'}`,
                  textAlign: 'center',
                  position: 'relative',
                  opacity: ach.unlocked ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  fontSize: 32,
                  marginBottom: 6,
                  filter: !ach.unlocked ? 'grayscale(100%)' : 'none'
                }}>
                  {ach.icon}
                </div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  marginBottom: 4
                }}>
                  {ach.title}
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'var(--muted)',
                  marginBottom: 4
                }}>
                  {ach.progress}%
                </div>
                <div style={{
                  width: '100%',
                  height: 4,
                  background: 'var(--border)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${ach.progress}%`,
                    background: tiers[tier].color,
                    borderRadius: 2,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {achievements.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 40,
          color: 'var(--muted)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <p>Nenhuma conquista desbloqueada ainda.</p>
          <p style={{ fontSize: 12 }}>Complete tarefas para desbloquear conquistas!</p>
        </div>
      )}
    </div>
  );
}
