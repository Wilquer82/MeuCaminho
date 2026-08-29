import { useState } from 'react';

export default function MissionSelectionModal({ onSelect, isOpen }) {
  const [selected, setSelected] = useState('monthly');

  if (!isOpen) return null;

  const missions = [
    {
      id: 'free',
      label: 'Acesso Livre',
      description: 'Leia sem compromisso, no seu ritmo',
      duration: '∞',
      icon: '📖',
      color: '#6b7280'
    },
    {
      id: 'monthly',
      label: 'Missão Mensal',
      description: '1 livro por mês',
      duration: '30 dias',
      icon: '🎯',
      color: '#3b82f6'
    },
    {
      id: 'semiannual',
      label: 'Missão Semestral',
      description: 'Novo Testamento',
      duration: '6 meses',
      icon: '📚',
      color: '#8b5cf6'
    },
    {
      id: 'annual',
      label: 'Missão Anual',
      description: 'Bíblia Completa',
      duration: '12 meses',
      icon: '👑',
      color: '#f59e0b'
    }
  ];

  const handleSelect = () => {
    onSelect(selected);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 16
    }}>
      <div style={{
        background: 'var(--bg)',
        borderRadius: 20,
        padding: 24,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Escolha sua Missão
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Selecione um plano de leitura personalizado para sua jornada
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {missions.map(mission => (
            <div
              key={mission.id}
              onClick={() => setSelected(mission.id)}
              style={{
                padding: 14,
                borderRadius: 12,
                border: `2px solid ${selected === mission.id ? mission.color : 'var(--border)'}`,
                background: selected === mission.id ? `${mission.color}15` : 'var(--card)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24 }}>{mission.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                    {mission.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
                    {mission.description}
                  </div>
                  <div style={{ fontSize: 11, color: mission.color, fontWeight: 600 }}>
                    {mission.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSelect}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Começar Missão
        </button>
      </div>
    </div>
  );
}
