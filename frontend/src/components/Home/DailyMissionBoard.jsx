import { useAuth } from '../../context/AuthContext';

export default function DailyMissionBoard() {
  const { user } = useAuth();

  if (!user) return null;

  const missionLabels = {
    free: 'Acesso Livre',
    monthly: 'Missão Mensal: 1 livro',
    semiannual: 'Missão Semestral: Novo Testamento',
    annual: 'Missão Anual: Bíblia Completa'
  };

  const missionIcons = {
    free: '📖',
    monthly: '🎯',
    semiannual: '📚',
    annual: '👑'
  };

  const currentPlan = user.selectedMissionPlan || 'free';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0fdf4, #dbeafe)',
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      border: '2px solid var(--accent)'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 28 }}>{missionIcons[currentPlan]}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            {missionLabels[currentPlan]}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            Ganhe XP completando tarefas
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: 12,
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>📖</div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
            Devocional
          </div>
          <div style={{ fontSize: 11, color: '#10b981' }}>
            +10 XP
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: 12,
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>❓</div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
            Revisão
          </div>
          <div style={{ fontSize: 11, color: '#10b981' }}>
            +15 XP
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 12,
        fontSize: 11,
        color: 'var(--muted)',
        padding: '8px 10px',
        background: '#f3f4f6',
        borderRadius: 8,
        textAlign: 'center'
      }}>
        Complete todas as tarefas para desbloquear conquistas especiais
      </div>
    </div>
  );
}
