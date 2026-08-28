import { useState } from 'react';
import { Link } from 'react-router-dom';

const missionTypes = {
  mensal: [
    { title: 'Ler 8 capítulos dos Salmos', progress: 62, current: 5, total: 8, reward: 'Medalha + 100 XP', color: 'var(--accent)', target: '/bible?book=psalms&chapter=6' },
    { title: '20 dias de ofensiva', progress: 60, current: 12, total: 20, reward: 'Congelador + 50 XP', color: 'var(--premium)' },
    { title: 'Parabenizar 5 amigos', progress: 40, current: 2, total: 5, reward: '30 XP', color: 'var(--accent2)' }
  ],
  semestral: [
    { title: 'Completar os Evangelhos', progress: 45, current: 45, total: 100, reward: 'Medalha de Ouro + 500 XP', color: '#0d9488', target: '/bible?book=matthew&chapter=1' },
    { title: 'Unidade Teologia: Soteriologia', progress: 0, current: 0, total: 100, reward: 'Desbloqueia em setembro', color: 'var(--muted)', locked: true }
  ],
  anual: [
    { title: 'Bíblia Completa em 1 Ano', progress: 18, current: 18, total: 100, reward: 'Título "Leitor da Bíblia" + 2000 XP', color: '#fbbf24', featured: true, target: '/bible?book=genesis&chapter=1' },
    { title: 'Curso Teologia Básica completo', progress: 10, current: 10, total: 100, reward: 'Título "Teólogo Aprendiz" + 1000 XP', color: 'var(--premium)' }
  ]
};

export default function Missions() {
  const [activeTab, setActiveTab] = useState('mensal');

  const tabs = [
    { id: 'mensal', label: 'Mensal' },
    { id: 'semestral', label: 'Semestral' },
    { id: 'anual', label: 'Anual' }
  ];

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>Missões</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Objetivos mensais, semestrais e anuais
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 14,
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 4
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--muted)'
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Missões */}
      {missionTypes[activeTab].map((mission, i) => (
        <Link
          key={i}
          to={mission.target || '#'}
          onClick={event => {
            if (!mission.target || mission.locked) event.preventDefault();
          }}
          style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
        >
        <div
          className="card-tap"
          style={{
            background: mission.featured
              ? 'linear-gradient(135deg, #fbbf24, #d97706)'
              : 'var(--card)',
            border: mission.featured ? 'none' : '1px solid var(--border)',
            borderRadius: mission.featured ? 16 : 14,
            padding: 14, marginBottom: 10,
            color: mission.featured ? '#fff' : 'inherit',
            opacity: mission.locked ? .6 : 1,
            cursor: mission.locked ? 'not-allowed' : 'pointer'
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: mission.featured
                ? 'rgba(255,255,255,.25)'
                : `${mission.color}1a`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18
            }}>🏆</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 13, fontWeight: 700, margin: 0,
                color: mission.featured ? '#fff' : 'var(--text)'
              }}>{mission.title}</p>
              <p style={{
                fontSize: 11, margin: '2px 0 0',
                color: mission.featured ? 'rgba(255,255,255,.85)' : 'var(--muted)'
              }}>
                {mission.current}/{mission.total}
              </p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: mission.featured ? '#fff' : mission.color
            }}>{mission.progress}%</span>
          </div>

          <div style={{
            height: 6, borderRadius: 3, overflow: 'hidden',
            background: mission.featured ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.06)'
          }}>
            <div style={{
              height: '100%', width: `${mission.progress}%`,
              background: mission.featured ? '#fff' : mission.color,
              borderRadius: 3, transition: 'width .5s ease'
            }} />
          </div>

          <p style={{
            fontSize: 10, fontWeight: 600, margin: '6px 0 0',
            color: mission.featured ? 'rgba(255,255,255,.9)' : 'var(--accent2)'
          }}>🏆 Recompensa: {mission.reward}</p>
        </div>
        </Link>
      ))}

    </div>
  );
}
