import { useState } from 'react';
import { Link } from 'react-router-dom';

const missionTemplates = [
  {
    id: 'year',
    title: 'Bíblia toda em 1 ano',
    objective: 'Ler toda a Bíblia em 12 meses',
    duration: '1 ano',
    category: 'Toda a Bíblia',
    progress: 18,
    current: 18,
    total: 100,
    color: '#fbbf24',
    featured: true,
    reward: 'Bronze · Prata · Ouro',
    target: '/bible?book=genesis&chapter=1'
  },
  {
    id: 'nt6',
    title: 'Novo Testamento em 6 meses',
    objective: 'Completar os 27 livros do NT',
    duration: '6 meses',
    category: 'Novo Testamento',
    progress: 28,
    current: 28,
    total: 100,
    color: '#0d9488',
    reward: 'Bronze · Prata · Ouro',
    target: '/bible?book=matthew&chapter=1'
  },
  {
    id: 'ot6',
    title: 'Antigo Testamento em 6 meses',
    objective: 'Aprofundar o AT em meio ano',
    duration: '6 meses',
    category: 'Antigo Testamento',
    progress: 12,
    current: 12,
    total: 100,
    color: '#ba3b5b',
    reward: 'Bronze · Prata · Ouro',
    target: '/bible?book=genesis&chapter=1'
  },
  {
    id: 'custom',
    title: 'Leitura livre personalizada',
    objective: 'Defina objetivo e tempo do seu ritmo',
    duration: 'Livre',
    category: 'Escolha livre',
    progress: 34,
    current: 34,
    total: 100,
    color: 'var(--accent)',
    reward: 'Bronze · Prata · Ouro',
    target: '/categories'
  }
];

const categoryOptions = [
  'Toda a Bíblia',
  'Pentateuco',
  'Livros Poéticos',
  'Profetas',
  'Evangelhos',
  'Cartas',
  'Apocalipse',
  'Livre'
];

export default function Missions() {
  const [activeTab, setActiveTab] = useState('padrao');
  const [customGoal, setCustomGoal] = useState('Ler 10 capítulos por semana');
  const [customDuration, setCustomDuration] = useState('90 dias');
  const [customCategory, setCustomCategory] = useState('Livre');
  const [customMissions, setCustomMissions] = useState([
    {
      id: 'personalized-1',
      title: 'Leitura 90 dias - 10 capítulos/semana',
      objective: 'Ler 10 capítulos por semana durante 90 dias',
      duration: '90 dias',
      category: 'Livre',
      progress: 46,
      current: 46,
      total: 100,
      color: '#7c3aed',
      reward: 'Bronze · Prata · Ouro',
      target: '/categories'
    }
  ]);

  const tabs = [
    { id: 'padrao', label: 'Padrão' },
    { id: 'personalizada', label: 'Personalizada' }
  ];

  const missionList = activeTab === 'padrao'
    ? missionTemplates
    : customMissions.length ? customMissions : [
        {
          id: 'empty-personalized',
          title: 'Crie sua missão',
          objective: 'Defina objetivo e tempo de leitura',
          duration: 'Personalizada',
          category: 'Livre',
          progress: 0,
          current: 0,
          total: 100,
          color: 'var(--muted)',
          reward: 'Bronze · Prata · Ouro',
          target: '/categories'
        }
      ];

  const addCustomMission = () => {
    const nextMission = {
      id: `custom-${Date.now()}`,
      title: `${customDuration} · ${customGoal}`,
      objective: customGoal,
      duration: customDuration,
      category: customCategory,
      progress: 12,
      current: 12,
      total: 100,
      color: '#7c3aed',
      reward: 'Bronze · Prata · Ouro',
      target: '/categories'
    };

    setCustomMissions(previous => [nextMission, ...previous]);
    setActiveTab('personalizada');
  };

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>Missões</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Objetivo, tempo e conquistas por categoria
      </p>

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

      {activeTab === 'personalizada' && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
          padding: 14, marginBottom: 14
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)' }}>
            Criar missão individual
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>
              Objetivo
              <input
                value={customGoal}
                onChange={event => setCustomGoal(event.target.value)}
                style={{
                  width: '100%', marginTop: 6, border: '1px solid var(--border)',
                  background: 'var(--bg)', borderRadius: 10, padding: '10px 12px',
                  color: 'var(--text)', fontSize: 13, boxSizing: 'border-box'
                }}
              />
            </label>

            <label style={{ fontSize: 12, color: 'var(--muted)' }}>
              Tempo
              <select
                value={customDuration}
                onChange={event => setCustomDuration(event.target.value)}
                style={{
                  width: '100%', marginTop: 6, border: '1px solid var(--border)',
                  background: 'var(--bg)', borderRadius: 10, padding: '10px 12px',
                  color: 'var(--text)', fontSize: 13
                }}
              >
                <option>30 dias</option>
                <option>60 dias</option>
                <option>90 dias</option>
                <option>6 meses</option>
                <option>1 ano</option>
              </select>
            </label>

            <label style={{ fontSize: 12, color: 'var(--muted)' }}>
              Categoria
              <select
                value={customCategory}
                onChange={event => setCustomCategory(event.target.value)}
                style={{
                  width: '100%', marginTop: 6, border: '1px solid var(--border)',
                  background: 'var(--bg)', borderRadius: 10, padding: '10px 12px',
                  color: 'var(--text)', fontSize: 13
                }}
              >
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={addCustomMission}
              style={{
                border: 'none', borderRadius: 10, padding: '12px 14px', background: 'var(--accent)',
                color: '#fff', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Salvar missão
            </button>
          </div>
        </div>
      )}

      {missionList.map((mission, index) => (
        <Link
          key={mission.id || index}
          to={mission.target || '#'}
          onClick={event => {
            if (!mission.target) event.preventDefault();
          }}
          style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
        >
          <div
            className="card-tap"
            style={{
              background: mission.featured ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'var(--card)',
              border: mission.featured ? 'none' : '1px solid var(--border)',
              borderRadius: mission.featured ? 16 : 14,
              padding: 14, marginBottom: 10,
              color: mission.featured ? '#fff' : 'inherit',
              opacity: mission.locked ? .6 : 1,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: mission.featured ? 'rgba(255,255,255,.25)' : `${mission.color}1a`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18
              }}>🏆</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, margin: 0,
                  color: mission.featured ? '#fff' : 'var(--text)'
                }}>{mission.title}</p>
                <p style={{
                  fontSize: 11, margin: '4px 0 0',
                  color: mission.featured ? 'rgba(255,255,255,.85)' : 'var(--muted)'
                }}>{mission.objective}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 700,
                  background: mission.featured ? 'rgba(255,255,255,.2)' : `${mission.color}1a`,
                  color: mission.featured ? '#fff' : mission.color,
                  padding: '4px 8px', borderRadius: 999
                }}>{mission.duration}</span>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: mission.featured ? '#fff' : mission.color }}>
                  {mission.progress}%
                </div>
              </div>
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

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 8, gap: 8, flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: mission.featured ? 'rgba(255,255,255,.9)' : 'var(--accent2)'
              }}>
                {mission.category}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: mission.featured ? 'rgba(255,255,255,.9)' : 'var(--accent2)'
              }}>
                🏅 {mission.reward}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
