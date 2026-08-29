import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function AdditionalContent() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('teologia');

  const active = useMemo(() => moduleMap[activeId] || moduleMap.teologia, [activeId]);

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>
        Conteúdo adicional
      </h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px' }}>
        Explorando teologia, arqueologia, léxico, curiosidades e vídeos em uma visão leve.
      </p>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }} className="no-scrollbar">
        {additionalContent.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            style={{
              flex: '0 0 auto',
              padding: '8px 12px',
              borderRadius: 999,
              border: activeId === item.id ? '1px solid transparent' : '1px solid var(--border)',
              background: activeId === item.id ? item.accent : 'var(--card)',
              color: activeId === item.id ? '#fff' : 'var(--muted)',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap'
            }}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, var(--card), var(--bg))',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 14,
          marginBottom: 14,
          boxShadow: '0 8px 18px rgba(15,23,42,0.04)'
        }}
      >
        <p style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: active.accent, margin: '0 0 6px', fontWeight: 700 }}>
          {active.label}
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
          Fonte: {additionalContent.find((item) => item.id === activeId)?.source || 'Conteúdo local'}
        </p>
        <button
          type="button"
          onClick={() => navigate(`/extras/${activeId}`)}
          style={{
            marginTop: 12,
            width: '100%',
            border: 'none',
            borderRadius: 12,
            background: active.accent,
            color: '#fff',
            fontWeight: 700,
            padding: '10px 12px',
            cursor: 'pointer'
          }}
        >
          Ver todos os itens de {active.label}
        </button>
      </div>

      {active.items.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="card-tap"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 14,
            marginBottom: 10
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: active.accent, margin: '0 0 4px', fontWeight: 700 }}>
                {item.category || active.label}
              </p>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{item.title}</h3>
            </div>
            {item.language && (
              <span style={{ fontSize: 10, background: `${active.accent}1a`, color: active.accent, padding: '4px 8px', borderRadius: 8, fontWeight: 700 }}>
                {item.language}
              </span>
            )}
          </div>

          {item.summary && (
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.5 }}>
              {item.summary}
            </p>
          )}

          {item.meaning && (
            <p style={{ fontSize: 12, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.5 }}>
              <strong>Significado:</strong> {item.meaning}
            </p>
          )}

          {item.context && (
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.5 }}>
              {item.context}
            </p>
          )}

          {Array.isArray(item.body) && (
            <ul style={{ paddingLeft: 18, margin: 0, display: 'grid', gap: 6 }}>
              {item.body.map((line, index) => (
                <li key={`${item.id}-${index}`} style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
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
                fontWeight: 700,
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
  );
}
