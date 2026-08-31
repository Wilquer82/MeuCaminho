import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import api from '../services/api';
import { requestNotificationPermission, scheduleDailyReadingReminder } from '../utils/mobileNotifications';

export default function Profile() {
  const { user, logout, theme, setTheme } = useAuth();
  const { subscriptionStatus, cancelSubscription } = useSubscription();
  const [readingStats, setReadingStats] = useState({ totalChaptersRead: 0, readingXp: 0 });
  const [bibleVersion, setBibleVersion] = useState(() => localStorage.getItem('bibleTranslation') || 'nvi');
  const [bibleVersions, setBibleVersions] = useState([]);
  const [savedReadings, setSavedReadings] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('readingReminderEnabled') === 'true');

  async function loadPublicTranslations() {
    const fallbackList = [
      { id: 'nvi', name: 'Nova Versão Internacional', language: 'pt-BR' },
      { id: 'ra', name: 'Almeida Revista e Atualizada', language: 'pt-BR' },
      { id: 'acf', name: 'Almeida Corrigida Fiel', language: 'pt-BR' },
      { id: 'ara', name: 'Almeida Revista e Atualizada (ARA)', language: 'pt-BR' },
      { id: 'tb', name: 'Tradução Brasileira', language: 'pt-BR' },
      { id: 'tbsi', name: 'Tradução Brasileira (TBSI)', language: 'pt-BR' },
      { id: 'bb', name: 'Bíblia do Brasil', language: 'pt-BR' },
      { id: 'blh', name: 'Bíblia Livre de Herança', language: 'pt-BR' },
      { id: 'nvt', name: 'Nova Versão Transformadora', language: 'pt-BR' },
      { id: 'rvr', name: 'Reina-Valera Revisada', language: 'pt-BR' },
      { id: 'rv1960', name: 'Reina-Valera 1960', language: 'pt-BR' },
      { id: 'vdl', name: 'Versão de Dom Lucas', language: 'pt-BR' },
      { id: 'tr', name: 'Tradução de João Ferreira de Almeida', language: 'pt-BR' },
      { id: 'pt', name: 'Português Tradicional', language: 'pt-BR' },
      { id: 'jfa', name: 'João Ferreira de Almeida', language: 'pt-BR' },
      { id: 'bpt', name: 'Bíblia Popular Traduzida', language: 'pt-BR' },
      { id: 'bv', name: 'Bíblia Viva', language: 'pt-BR' },
      { id: 'sbt', name: 'Sociedade Bíblica do Brasil', language: 'pt-BR' },
      { id: 'capa', name: 'Capa da Bíblia', language: 'pt-BR' },
      { id: 'gospel', name: 'Gospel Edition', language: 'pt-BR' },
      { id: 'kjv', name: 'King James Version', language: 'en' }
    ];

    const candidateUrls = [
      'https://api.midvash.com/v1/versions?language=pt-BR',
      'https://api.midvash.com/v1/versions?language=pt-br',
      'https://api.midvash.com/v1/versions?language=pt',
      'https://api.midvash.com/v1/versions'
    ];

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const payload = await response.json();
        const rawVersions = Array.isArray(payload) ? payload : payload.data || [];
        const normalized = rawVersions
          .map(version => ({
            id: version.slug || version.id || version.name,
            name: version.name || version.title || 'Versão',
            language: version.language || version.lang || 'pt-BR'
          }))
          .filter(version => version.id && version.name)
          .filter(version => /pt|portuguese/i.test(version.language) || /pt|portuguese/i.test(version.name));

        if (normalized.length) {
          const unique = Object.values(normalized.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {}));
          return unique.length ? unique : fallbackList;
        }
      } catch {
        // Continua para a próxima fonte.
      }
    }

    return fallbackList;
  }

  useEffect(() => {
    api.get('/progress/summary')
      .then(({ data }) => setReadingStats(data))
      .catch(() => {});

    loadPublicTranslations().then(setBibleVersions);

    const syncSavedReadings = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('meucaminho_bible_favorites') || '[]');
        const sorted = [...stored].sort((a, b) => {
          if (a.bookName === b.bookName) {
            if (a.chapter === b.chapter) return a.verse - b.verse;
            return a.chapter - b.chapter;
          }
          return a.bookName.localeCompare(b.bookName, 'pt-BR');
        });
        setSavedReadings(sorted);
      } catch {
        setSavedReadings([]);
      }
    };

    syncSavedReadings();
    window.addEventListener('storage', syncSavedReadings);
    return () => window.removeEventListener('storage', syncSavedReadings);
  }, []);

  useEffect(() => {
    localStorage.setItem('bibleTranslation', bibleVersion);
  }, [bibleVersion]);

  const handleNotificationsToggle = async () => {
    const nextValue = !notificationsEnabled;
    setNotificationsEnabled(nextValue);
    localStorage.setItem('readingReminderEnabled', String(nextValue));

    if (nextValue) {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        scheduleDailyReadingReminder();
      }
    }
  };

  if (!user) return null;

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const categoryBadges = Object.entries(readingStats.categories || {})
    .filter(([, stats]) => stats?.completed > 0)
    .slice(0, 4)
    .map(([category, stats]) => ({
      icon: '📚',
      name: category.charAt(0).toUpperCase() + category.slice(1),
      unlocked: true,
      detail: `${stats.completed}/${stats.total}`
    }));

  const achievements = [
    { icon: '🏆', name: '1ª Semana', unlocked: (user.streak || 0) >= 7, detail: `${user.streak || 0} dias` },
    { icon: '📖', name: 'Leitor Constante', unlocked: (readingStats.totalChaptersRead || 0) >= 10, detail: `${readingStats.totalChaptersRead || 0} capítulos` },
    { icon: '🎓', name: 'Teólogo Iniciante', unlocked: (user.level || 1) >= 5, detail: `Nível ${(user.level || 1)}` },
    { icon: '🔥', name: 'Streak 30', unlocked: (user.streak || 0) >= 30, detail: `${user.streak || 0} dias` },
    { icon: '📘', name: 'Gênesis', unlocked: (readingStats.totalChaptersRead || 0) >= 15, detail: 'Livro inicial' },
    { icon: '📙', name: 'Salmos', unlocked: (readingStats.totalChaptersRead || 0) >= 25, detail: 'Poemas e louvor' },
    { icon: '📗', name: 'João', unlocked: (readingStats.totalChaptersRead || 0) >= 35, detail: 'Evangelho central' },
    { icon: '👑', name: 'Bíblia Completa', unlocked: false, detail: 'Em progresso' },
    ...categoryBadges,
    { icon: '🧭', name: 'Total de livros', unlocked: (readingStats.uniqueBooksRead || 0) >= 5, detail: `${readingStats.uniqueBooksRead || 0} livros` },
    { icon: '📅', name: 'Dias totais', unlocked: (user.streak || 0) >= 3, detail: `${user.streak || 0} dias` }
  ];

  return (
    <div style={{ padding: '0 16px 100px' }} className="fade-in">

      {/* Cabeçalho do perfil */}
      <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #4caf50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', color: '#fff', fontSize: 28, fontWeight: 700
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>{user.name}</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Nível {user.level || 1} · {user.plan === 'free' ? 'Plano Gratuito' : 'Plano Premium 💎'}
        </p>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 32,
          marginTop: 16
        }}>
          <Stat label="XP" value={(user.xp || 0).toLocaleString('pt-BR')} />
          <Stat label="Capítulos" value={readingStats.totalChaptersRead} />
          <Stat label="Streak" value={`${user.streak || 0} dias`} color="var(--accent2)" />
          <Stat label="Congeladores" value={user.streakFreezes || 2} />
        </div>
      </div>

      {/* Status Premium */}
      {user.plan === 'free' ? (
        <div className="card-tap" style={{
          borderRadius: 16, padding: 16, marginBottom: 20, color: '#fff',
          cursor: 'default', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.9), rgba(34, 197, 94, 0.8))'
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            Versão de Teste
          </p>
          <p style={{ fontSize: 12, opacity: .9, margin: '4px 0 0' }}>
            Experimente a jornada atual com recursos em evolução.
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--premium-soft)', border: '1px solid var(--premium)',
          borderRadius: 16, padding: 16, marginBottom: 20, textAlign: 'center'
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--premium)', margin: '0 0 4px' }}>
            💎 Premium Ativo
          </p>
          {subscriptionStatus.subscriptionExpires && (
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 8px' }}>
              Válido até {new Date(subscriptionStatus.subscriptionExpires).toLocaleDateString('pt-BR')}
            </p>
          )}
          {user.plan !== 'lifetime' && (
            <button
              onClick={cancelSubscription}
              style={{
                padding: '8px 16px', borderRadius: 10, border: '1px solid var(--danger)',
                background: 'transparent', color: 'var(--danger)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Cancelar assinatura
            </button>
          )}
        </div>
      )}

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Minhas leituras salvas</h3>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{savedReadings.length}</span>
        </div>

        {savedReadings.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            Nenhum versículo salvo ainda. Marque um texto na Bíblia para guardar sua leitura.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {savedReadings.map(item => (
              <Link
                key={item.key}
                to={`/bible?book=${item.bookId}&chapter=${item.chapter}`}
                style={{
                  display: 'block',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  textDecoration: 'none',
                  color: 'var(--text)'
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                  {item.bookName} {item.chapter}:{item.verse}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--muted)' }}>
                  {item.text.length > 110 ? `${item.text.slice(0, 110)}...` : item.text}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Conquistas */}
      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px' }}>Conquistas</h3>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 10, marginBottom: 20
      }}>
        {achievements.map((a, i) => (
          <div
            key={`${a.name}-${i}`}
            style={{
              textAlign: 'center',
              opacity: a.unlocked ? 1 : .4,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 8px'
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: a.unlocked
                ? 'linear-gradient(135deg, #fbbf24, #d97706)'
                : 'var(--bg)',
              border: a.unlocked ? 'none' : '2px dashed var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 6px', fontSize: 18
            }}>
              {a.unlocked ? a.icon : '🔒'}
            </div>
            <p style={{
              fontSize: 10, fontWeight: 700, margin: '0 0 4px',
              lineHeight: 1.2, color: a.unlocked ? 'var(--text)' : 'var(--muted)'
            }}>
              {a.name}
            </p>
            {a.detail && (
              <p style={{
                fontSize: 9, margin: 0,
                color: 'var(--muted)', lineHeight: 1.2
              }}>
                {a.detail}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Menu de configurações */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18 }}>📖</span>
          <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>Versão da Bíblia</span>
          <select
            value={bibleVersion}
            onChange={event => setBibleVersion(event.target.value)}
            style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', padding: '6px 8px' }}
          >
            {bibleVersions.length > 0 ? (
              bibleVersions.map(version => (
                <option key={version.id} value={version.id}>
                  {version.name}
                </option>
              ))
            ) : (
              <>
                <option value="nvi">NVI</option>
                <option value="ara">ARA</option>
                <option value="acf">ACF</option>
                <option value="kjv">KJV</option>
              </>
            )}
          </select>
        </div>

        <div
          onClick={handleNotificationsToggle}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>Lembretes diários</span>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{notificationsEnabled ? 'Ativo' : 'Desativado'}</span>
        </div>

        <div
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 18 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>Tema escuro</span>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{theme === 'dark' ? 'Ativo' : 'Desativado'}</span>
        </div>
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem icon="ℹ️" label="Sobre e contato" />
        </Link>
        <div
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px', cursor: 'pointer', color: 'var(--danger)',
            borderTop: '1px solid var(--border)'
          }}
        >
          <span style={{ fontSize: 18 }}>🚪</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Sair</span>
        </div>
      </div>

    </div>
  );
}

function Stat({ label, value, color = 'var(--text)' }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color }}>{value}</p>
      <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>{label}</p>
    </div>
  );
}

function MenuItem({ icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px', borderBottom: '1px solid var(--border)',
      cursor: 'pointer'
    }} className="card-tap">
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{label}</span>
      <span style={{ color: 'var(--muted)' }}>›</span>
    </div>
  );
}
