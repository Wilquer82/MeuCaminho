import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { additionalContent } from '../data/additionalContent';
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
  videos: { label: 'Vídeos', items: videosContent, accent: '#ef4444' }
};

export default function AdditionalContentDetail() {
  const navigate = useNavigate();
  const { module } = useParams();
  const active = useMemo(() => moduleMap[module] || moduleMap.teologia, [module]);
  const metadata = additionalContent.find(item => item.id === module) || additionalContent[0];

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => navigate('/extras')}
          style={{
            background: 'var(--card)',
            color: 'var(--text)',
            borderRadius: 10,
            padding: '8px 10px',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid var(--border)'
          }}
        >
          ← Voltar
        </button>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', margin: 0 }}>
          Conteúdo extra
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, var(--card), var(--bg))',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        boxShadow: '0 8px 18px rgba(15,23,42,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: metadata.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: '#fff'
          }}>
            {metadata.icon}
          </div>
          <div>
            <p style={{ fontSize: 10, color: active.accent, fontWeight: 700, margin: 0, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {active.label}
            </p>
            <h2 style={{ fontSize: 22, margin: '4px 0 0', fontWeight: 800 }}>{metadata.title}</h2>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          {metadata.description}
        </p>
        <p style={{ fontSize: 11, color: 'var(--muted)', margin: '10px 0 0' }}>
          Fonte: {metadata.source}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {active.items.map(item => (
          <article
            key={item.id}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 14
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: active.accent, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 5px' }}>
                  {item.category || active.label}
                </p>
                <h3 style={{ fontSize: 16, margin: '0 0 8px', fontWeight: 700 }}>{item.title}</h3>
              </div>
              {item.language && (
                <span style={{
                  background: `${active.accent}1a`,
                  color: active.accent,
                  borderRadius: 9,
                  padding: '4px 8px',
                  fontSize: 10,
                  fontWeight: 700
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
                {item.body.map((line, index) => (
                  <li key={`${item.id}-${index}`} style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
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
                  fontWeight: 700,
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
