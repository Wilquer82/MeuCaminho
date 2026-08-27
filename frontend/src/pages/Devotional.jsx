import { useState, useEffect } from 'react';
import api from '../services/api';
import SocialShare from '../components/Devotional/SocialShare';
import { useAuth } from '../context/AuthContext';

export default function Devotional() {
  const [devotional, setDevotional] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { updateUser } = useAuth();

  useEffect(() => {
    loadDevotional();
  }, []);

  const loadDevotional = async () => {
    try {
      const { data } = await api.get('/devotional/today');
      setDevotional(data);
      setCompleted(data.completedByUser || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const { data } = await api.post(`/devotional/${devotional._id}/complete`);
      setCompleted(true);
      if (data.xpEarned > 0) {
        updateUser({ xp: data.newXp });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando devocional...</div>;
  }

  if (!devotional) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Nenhum devocional disponível hoje.</p>
      </div>
    );
  }

  const formattedDate = new Date(devotional.date).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div style={{ padding: '0 16px 100px', maxWidth: 420, margin: '0 auto' }} className="fade-in">

      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', padding: '20px 0 16px' }}>
        <p style={{
          fontSize: 12, color: 'var(--muted)', margin: 0,
          textTransform: 'uppercase', letterSpacing: '.1em'
        }}>{formattedDate}</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '8px 0' }}>
          {devotional.title}
        </h1>
        <span style={{
          display: 'inline-block', fontSize: 11, fontWeight: 600,
          background: 'var(--accent)', color: '#fff',
          padding: '4px 12px', borderRadius: 20
        }}>{devotional.category}</span>
      </div>

      {/* Versículo em destaque */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent), #1a5c20)',
        borderRadius: 20, padding: 24, marginBottom: 20, color: '#fff',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -10, left: 10, fontSize: 80, opacity: .15,
          fontFamily: 'Georgia, serif'
        }}>❝</div>
        <p style={{
          fontSize: 18, fontWeight: 600, lineHeight: 1.6,
          margin: '0 0 12px', position: 'relative', zIndex: 1, fontStyle: 'italic'
        }}>
          "{devotional.bibleText}"
        </p>
        <p style={{
          fontSize: 13, opacity: .85, textAlign: 'right',
          margin: 0, position: 'relative', zIndex: 1, fontWeight: 600
        }}>
          — {devotional.bibleReference} ({devotional.bibleVersion})
        </p>
      </div>

      {/* Reflexão */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>📖 Reflexão</h3>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#334155', margin: 0 }}>
          {devotional.reflection}
        </p>
      </div>

      {/* Pergunta para meditar */}
      {devotional.meditationQuestion && (
        <div style={{
          background: 'var(--accent2-soft)',
          border: '1px solid rgba(217,119,6,.3)',
          borderRadius: 16, padding: 16, marginBottom: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent2)', margin: '0 0 8px' }}>
            💭 Para meditar
          </h3>
          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            {devotional.meditationQuestion}
          </p>
        </div>
      )}

      {/* Oração */}
      {devotional.prayer && (
        <div style={{
          background: 'var(--accent-soft)',
          border: '1px solid rgba(41,122,46,.2)',
          borderRadius: 16, padding: 16, marginBottom: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', margin: '0 0 8px' }}>
            🙏 Oração
          </h3>
          <p style={{ fontSize: 14, fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>
            {devotional.prayer}
          </p>
        </div>
      )}

      {/* Compartilhamento */}
      <SocialShare devotional={devotional} />

      {/* Botão completar */}
      <button
        onClick={handleComplete}
        disabled={completed}
        style={{
          width: '100%', marginTop: 20, padding: 16, borderRadius: 14,
          border: 'none', fontSize: 15, fontWeight: 700, cursor: completed ? 'default' : 'pointer',
          background: completed ? '#e5e7eb' : 'var(--accent)',
          color: completed ? 'var(--muted)' : '#fff'
        }}
      >
        {completed ? '✓ Devocional concluído (+10 XP)' : 'Marcar como lido +10 XP'}
      </button>

      <p style={{
        textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 12
      }}>
        Por {devotional.author}
      </p>

    </div>
  );
}
