import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function AdditionalContentDetail() {
  const navigate = useNavigate();
  const { module } = useParams();
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

  const active = useMemo(() => moduleMap[module] || moduleMap.teologia, [module]);
  const metadata = additionalContent.find(item => item.id === module) || additionalContent[0];
  const moreLink = metadata?.onlineUrl || null;

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => navigate('/extras')}
          style={{
            background: 'var(--card)',
            color: 'var(--text)',
            borderRadius: 12,
            padding: '9px 12px',
            fontWeight: 800,
            cursor: 'pointer',
            border: '1px solid var(--border)'
          }}
        >
          ← Voltar
        </button>
        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', margin: 0 }}>
          Conteúdo extra
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, var(--card) 45%, rgba(255,255,255,0.9) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: 18,
        marginBottom: 18,
        boxShadow: '0 22px 38px rgba(15,23,42,0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
            fontSize: 23,
            color: '#fff',
            boxShadow: '0 14px 28px rgba(15,23,42,0.12)'
          }}>
            {metadata.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: active.accent, fontWeight: 900, margin: 0, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {active.label}
            </p>
            <h2 style={{ fontSize: 25, margin: '4px 0 0', fontWeight: 900, lineHeight: 1.2 }}>{metadata.title}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
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
            {metadata.source}
          </span>
        </div>

        {isOnline && moreLink ? (
          <a
            href={moreLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              marginTop: 12,
              borderRadius: 12,
              background: 'var(--card)',
              color: active.accent,
              border: `1px solid ${active.accent}33`,
              fontWeight: 900,
              padding: '10px 12px',
              textDecoration: 'none'
            }}
          >
            {metadata.onlineLabel || `Mais em ${active.label}`} ↗
          </a>
        ) : (
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
            Mais conteúdo disponível ao entrar online.
          </p>
        )}

        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
          {metadata.description}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {active.items.map((item, index) => (
          <article
            key={item.id}
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))',
              border: '1px solid var(--border)',
              borderLeft: `4px solid ${active.accent}`,
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 12px 26px rgba(15,23,42,0.04)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: active.accent,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  margin: '0 0 6px'
                }}>
                  {index + 1}. {item.category || active.label}
                </p>
                <h3 style={{ fontSize: 18, margin: '0 0 8px', fontWeight: 900, lineHeight: 1.3 }}>{item.title}</h3>
              </div>
              {item.language && (
                <span style={{
                  background: `${active.accent}1a`,
                  color: active.accent,
                  borderRadius: 9,
                  padding: '5px 8px',
                  fontSize: 10,
                  fontWeight: 900
                }}>
                  {item.language}
                </span>
              )}
            </div>

            {item.summary && (
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 8px' }}>
                {item.summary}
              </p>
            )}

            {item.meaning && (
              <p style={{ fontSize: 12, lineHeight: 1.6, margin: '0 0 8px' }}>
                <strong>Significado:</strong> {item.meaning}
              </p>
            )}

            {item.context && (
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 8px' }}>
                {item.context}
              </p>
            )}

            {Array.isArray(item.body) && (
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                {item.body.map((line, idx) => (
                  <li key={`${item.id}-${idx}`} style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                    {line}
                  </li>
                ))}
              </ul>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  color: active.accent,
                  fontWeight: 900,
                  fontSize: 11,
                  textDecoration: 'none'
                }}
              >
                Abrir link externo ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
