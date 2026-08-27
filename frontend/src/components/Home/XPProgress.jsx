export default function XPProgress({ xp, level, nextLevelXp = 2000 }) {
  // Calcula XP dentro do nível atual (simplificado)
  const xpInLevel = xp % nextLevelXp;
  const percentage = Math.min((xpInLevel / nextLevelXp) * 100, 100);
  const remaining = nextLevelXp - xpInLevel;

  const levelNames = [
    'Iniciante', 'Aprendiz', 'Discípulo', 'Seguidor', 'Servo',
    'Mestre', 'Guia', 'Pastor', 'Doutor', 'Apóstolo'
  ];
  const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)];

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--accent), #1a5c20)',
      borderRadius: 18,
      padding: 16,
      color: '#fff',
      marginBottom: 14
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }}>
        <div>
          <p style={{ fontSize: 11, opacity: .8, margin: 0 }}>
            Nível {level} · {levelName}
          </p>
          <p style={{ fontSize: 22, fontWeight: 700, margin: '2px 0 0' }}>
            {xp.toLocaleString('pt-BR')} XP
          </p>
        </div>

        {/* Círculo de progresso */}
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="4" />
            <circle
              cx="28" cy="28" r="24" fill="none" stroke="#fff" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={151}
              strokeDashoffset={151 - (151 * percentage / 100)}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700
          }}>
            {Math.round(percentage)}%
          </div>
        </div>
      </div>

      {/* Barra */}
      <div style={{
        background: 'rgba(255,255,255,.2)',
        height: 6, borderRadius: 3, overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: '#fff',
          borderRadius: 3,
          transition: 'width .5s ease'
        }} />
      </div>

      <p style={{ fontSize: 10, opacity: .8, margin: '5px 0 0' }}>
        Faltam {remaining.toLocaleString('pt-BR')} XP para o Nível {level + 1}
      </p>
    </div>
  );
}
