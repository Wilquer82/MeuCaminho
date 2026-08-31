import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { additionalContent, studyContent, practiceContent } from '../data/additionalContent';
import { teologiaContent } from '../data/teologiaContent';
import { archaeologyContent } from '../data/archaeologyContent';
import { lexiconContent } from '../data/lexiconContent';
import { curiosityContent } from '../data/curiosityContent';
import { videosContent } from '../data/videosContent';

const moduleMap = {
  teologia: { label: 'Teologia', items: teologiaContent, accent: 'var(--premium)' },
  arqueologia: { label: 'Arqueologia', items: archaeologyContent, accent: '#7c3aed' },
  lexicon: { label: 'Lexicon', items: lexiconContent, accent: '#0d9488' },
  curiosidades: { label: 'Curiosidades', items: curiosityContent, accent: '#f59e0b' },
  videos: { label: 'Vídeos', items: videosContent, accent: '#ef4444' },
  estudos: { label: 'Estudos de livro', items: studyContent, accent: '#14b8a6' },
  pratica: { label: 'Prática espiritual', items: practiceContent, accent: '#f97316' }
};

export default function AdditionalContent() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('teologia');
  const [isOnline, setIsOnline] = useState(() => navigator.onLine !== false);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine !== false);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const active = useMemo(() => moduleMap[activeId] || moduleMap.teologia, [activeId]);
  const activeMeta = useMemo(
    () => additionalContent.find((item) => item.id === activeId) || additionalContent[0],
    [activeId]
  );
  const moreLink = activeMeta?.onlineUrl || null;

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Explorar
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: '6px 0 8px', lineHeight: 1.1 }}>
          Conteúdo adicional
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
          Aprenda com teologia, arqueologia, estudos bíblicos e práticas espirituais em uma experiência leve e premium.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 18 }} className="no-scrollbar">
        {additionalContent.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            style={{
              flex: '0 0 auto',
              padding: '10px 14px',
              borderRadius: 999,
              border: activeId === item.id ? '1px solid transparent' : '1px solid var(--border)',
              background: activeId === item.id ? item.accent : 'rgba(255,255,255,0.7)',
              color: activeId === item.id ? '#fff' : 'var(--muted)',
              fontSize: 11,
              fontWeight: 800,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              boxShadow: activeId === item.id ? '0 10px 18px rgba(15,23,42,0.12)' : 'none'
            }}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, var(--card) 45%, rgba(255,255,255,0.9) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 18,
          marginBottom: 18,
          boxShadow: '0 22px 38px rgba(15,23,42,0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '0 auto auto 0',
          width: '100%',
          height: 6,
          background: `linear-gradient(90deg, ${active.accent}, transparent)`
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${active.accent}, rgba(255,255,255,0.16))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 22,
            fontWeight: 900,
            boxShadow: '0 14px 28px rgba(15,23,42,0.12)'
          }}>
            {additionalContent.find((item) => item.id === activeId)?.icon || '📖'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: active.accent, margin: 0, fontWeight: 900 }}>
              {active.label}
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
              {additionalContent.find((item) => item.id === activeId)?.source || 'Conteúdo local'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <span style={{
            padding: '6px 10px',
            borderRadius: 999,
            background: `${active.accent}1a`,
            color: active.accent,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '.06em',
            textTransform: 'uppercase'
          }}>
            {isOnline ? 'Disponível online' : 'Offline'}
          </span>
          <span style={{
            padding: '6px 10px',
            borderRadius: 999,
            background: 'var(--accent-soft)',
            color: 'var(--text)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.04em'
          }}>
            {active.items.length} itens
          </span>
        </div>

        {isOnline && moreLink ? (
          <a
            href={moreLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              borderRadius: 14,
              background: 'var(--card)',
              color: active.accent,
              border: `1px solid ${active.accent}33`,
              fontWeight: 900,
              padding: '12px 14px',
              marginBottom: 10,
              boxShadow: '0 10px 20px rgba(15,23,42,0.04)'
            }}
          >
            {activeMeta.onlineLabel || `Mais em ${active.label}`} ↗
          </a>
        ) : (
          <div style={{
            width: '100%',
            borderRadius: 14,
            background: 'rgba(148, 163, 184, 0.08)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            fontWeight: 700,
            padding: '12px 14px',
            marginBottom: 10,
            textAlign: 'center'
          }}>
            Mais conteúdo disponível ao entrar online.
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(`/extras/${activeId}`)}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 14,
            background: active.accent,
            color: '#fff',
            fontWeight: 900,
            padding: '13px 14px',
            cursor: 'pointer',
            boxShadow: '0 14px 28px rgba(15,23,42,0.12)'
          }}
        >
          Ver coleção de {active.label}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {active.items.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className="card-tap"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))',
              border: '1px solid var(--border)',
              borderLeft: `4px solid ${active.accent}`,
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 12px 26px rgba(15,23,42,0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  color: active.accent,
                  margin: '0 0 6px',
                  fontWeight: 900
                }}>
                  {index + 1}. {item.category || active.label}
                </p>
                <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 6px', lineHeight: 1.3 }}>{item.title}</h3>
              </div>
              {item.language && (
                <span style={{ fontSize: 10, background: `${active.accent}1a`, color: active.accent, padding: '5px 8px', borderRadius: 8, fontWeight: 900 }}>
                  {item.language}
                </span>
              )}
            </div>

            {item.summary && (
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.6 }}>
                {item.summary}
              </p>
            )}

            {item.meaning && (
              <p style={{ fontSize: 12, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.6 }}>
                <strong>Significado:</strong> {item.meaning}
              </p>
            )}

            {item.context && (
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.6 }}>
                {item.context}
              </p>
            )}

            {Array.isArray(item.body) && (
              <ul style={{ paddingLeft: 18, margin: 0, display: 'grid', gap: 6 }}>
                {item.body.map((line, idx) => (
                  <li key={`${item.id}-${idx}`} style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                    {line}
                  </li>
                ))}
              </ul>
            )}

            {item.source && (
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: '10px 0 0' }}>
                Fonte: {item.source}
              </p>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  fontSize: 11,
                  fontWeight: 900,
                  color: active.accent,
                  textDecoration: 'none'
                }}
              >
                Abrir link externo ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
