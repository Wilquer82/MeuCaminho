import { useMemo, useState } from 'react';

const videos = [
  {
    id: 1,
    title: 'A criação e o início',
    series: 'Gênesis · EP 1',
    duration: '7:42',
    category: 'AT',
    subcategory: 'Criação',
    book: 'Gênesis',
    color: '#1a5c8a',
    progress: 100,
    featured: true,
    description: 'Visão panorâmica da criação e do plano de Deus. Ideal para começar em Gênesis.'
  },
  {
    id: 2,
    title: 'A libertação do povo',
    series: 'Êxodo',
    duration: '5:18',
    category: 'AT',
    subcategory: 'Libertação',
    book: 'Êxodo',
    color: '#2d7eb5',
    progress: 65,
    description: 'A jornada de saída da escravidão e a formação da identidade do povo de Deus.'
  },
  {
    id: 3,
    title: 'A poesia dos Salmos',
    series: 'Salmos',
    duration: '8:04',
    category: 'AT',
    subcategory: 'Lamentação',
    book: 'Salmos',
    color: '#8b5cf6',
    progress: 40,
    description: 'Como os Salmos expressam devoção, dor, gratidão e confiança em Deus.'
  },
  {
    id: 4,
    title: 'O que é a Trindade?',
    series: 'Teologia',
    duration: '6:30',
    category: 'Teologia',
    subcategory: 'Doutrina',
    book: 'Teologia',
    color: '#ba3b5b',
    progress: 0,
    description: 'Uma visão clara e acessível da pessoa de Deus em três pessoas distintas.'
  },
  {
    id: 5,
    title: 'Introdução ao Hebraico Bíblico',
    series: 'Hebraico',
    duration: '9:15',
    category: 'Línguas',
    subcategory: 'Língua',
    book: 'Hebraico',
    color: 'var(--premium)',
    progress: 15,
    description: 'Entenda a linguagem e a riqueza do texto original hebraico.'
  },
  {
    id: 6,
    title: 'O Reino de Deus',
    series: 'Mateus',
    duration: '10:05',
    category: 'NT',
    subcategory: 'Messianismo',
    book: 'Mateus',
    color: 'var(--accent2)',
    progress: 30,
    description: 'A mensagem central de Jesus e o significado do reino em seu ministério.'
  },
  {
    id: 7,
    title: 'Paul e o evangelho',
    series: 'Romanos',
    duration: '11:20',
    category: 'NT',
    subcategory: 'Cartas',
    book: 'Romanos',
    color: '#0d9488',
    progress: 0,
    description: 'Uma introdução ao coração da mensagem de Paulo sobre graça e justiça.'
  },
  {
    id: 8,
    title: 'Grego Koiné: A linguagem do NT',
    series: 'Grego Bíblico',
    duration: '8:42',
    category: 'Línguas',
    subcategory: 'Língua',
    book: 'Grego',
    color: '#0ea5e9',
    progress: 0,
    description: 'A base lingüística do Novo Testamento e do contexto da igreja primitiva.'
  }
];

export default function Videos() {
  const [filter, setFilter] = useState('all');
  const [bookFilter, setBookFilter] = useState('all');

  const contentFilters = [
    { id: 'all', label: 'Todos' },
    { id: 'AT', label: 'Antigo Testamento' },
    { id: 'NT', label: 'Novo Testamento' },
    { id: 'Línguas', label: 'Hebraico/Grego' },
    { id: 'Teologia', label: 'Teologia' }
  ];

  const bookFilters = [
    { id: 'all', label: 'Todos os livros' },
    { id: 'Gênesis', label: 'Gênesis' },
    { id: 'Êxodo', label: 'Êxodo' },
    { id: 'Salmos', label: 'Salmos' },
    { id: 'Mateus', label: 'Mateus' },
    { id: 'Romanos', label: 'Romanos' }
  ];

  const filtered = useMemo(() => {
    return videos.filter(video => {
      const matchesContent = filter === 'all' || video.category === filter;
      const matchesBook = bookFilter === 'all' || video.book === bookFilter;
      return matchesContent && matchesBook;
    });
  }, [filter, bookFilter]);

  const featured = filtered.find(v => v.featured) || filtered[0];
  const rest = filtered.filter(v => v.id !== featured?.id);

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>Vídeos</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        BibleProject · Aprenda visualmente
      </p>

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 11, margin: '0 0 8px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Por conteúdo
        </p>
        <div style={{
          display: 'flex', gap: 8, marginBottom: 10,
          overflowX: 'auto', paddingBottom: 4
        }} className="no-scrollbar">
          {contentFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: filter === f.id ? '1px solid transparent' : '1px solid var(--border)',
                background: filter === f.id ? 'var(--accent)' : 'var(--card)',
                color: filter === f.id ? '#fff' : 'var(--muted)',
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
              }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, margin: '0 0 8px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Por livro bíblico
        </p>
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4
        }} className="no-scrollbar">
          {bookFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setBookFilter(f.id)}
              style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: bookFilter === f.id ? '1px solid transparent' : '1px solid var(--border)',
                background: bookFilter === f.id ? 'var(--premium)' : 'var(--card)',
                color: bookFilter === f.id ? '#fff' : 'var(--muted)',
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
              }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Vídeo em destaque */}
      {featured && (
        <div
          className="card-tap"
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, overflow: 'hidden', marginBottom: 14,
            cursor: 'pointer'
          }}
        >
          <div style={{
            height: 180,
            background: `linear-gradient(135deg, ${featured.color}, ${featured.color}cc)`,
            position: 'relative', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'rgba(255,255,255,.2)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255,255,255,.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <span style={{
              position: 'absolute', bottom: 8, left: 10,
              background: 'rgba(0,0,0,.6)', color: '#fff',
              fontSize: 10, padding: '2px 6px', borderRadius: 4
            }}>{featured.duration}</span>
            <span style={{
              position: 'absolute', top: 8, right: 10,
              background: 'var(--accent)', color: '#fff',
              fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 8
            }}>EM DESTAQUE</span>
          </div>
          <div style={{ padding: 14 }}>
            <p style={{ fontSize: 10, color: featured.color, fontWeight: 700, margin: '0 0 3px' }}>
              {featured.book.toUpperCase()} · {featured.subcategory.toUpperCase()}
            </p>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>
              {featured.title}
            </h3>
            {featured.description && (
              <p style={{
                fontSize: 12, color: 'var(--muted)', margin: 0,
                lineHeight: 1.5
              }}>{featured.description}</p>
            )}
            {featured.progress > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4
                }}>
                  <div style={{
                    flex: 1, height: 3, background: 'rgba(0,0,0,.08)', borderRadius: 2, overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', width: `${featured.progress}%`,
                      background: 'var(--accent)', borderRadius: 2
                    }} />
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--muted)' }}>{featured.progress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de vídeos */}
      {rest.map(video => (
        <div
          key={video.id}
          className="card-tap"
          style={{
            display: 'flex', gap: 10, background: 'var(--card)',
            border: '1px solid var(--border)', borderRadius: 12,
            padding: 10, marginBottom: 8, cursor: 'pointer'
          }}
        >
          <div style={{
            width: 90, height: 58, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${video.color}, ${video.color}cc)`,
            position: 'relative', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            <span style={{
              position: 'absolute', bottom: 3, right: 3,
              background: 'rgba(0,0,0,.7)', color: '#fff',
              fontSize: 9, padding: '1px 4px', borderRadius: 3
            }}>{video.duration}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 9, color: video.color, fontWeight: 700,
              margin: '0 0 2px', textTransform: 'uppercase'
            }}>{video.book} · {video.subcategory}</p>
            <h4 style={{
              fontSize: 12, fontWeight: 600, margin: '0 0 4px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>{video.title}</h4>
            {video.progress > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  flex: 1, height: 3, background: 'rgba(0,0,0,.08)', borderRadius: 2, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: `${video.progress}%`,
                    background: video.progress === 100 ? 'var(--success)' : 'var(--accent)', borderRadius: 2
                  }} />
                </div>
                <span style={{ fontSize: 9, color: 'var(--muted)' }}>{video.progress}%</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Nota sobre as fontes */}
      <div style={{
        marginTop: 16, padding: 12, borderRadius: 12,
        background: 'rgba(13,148,136,.08)', border: '1px solid rgba(13,148,136,.2)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 11, color: '#0d9488', margin: 0, fontWeight: 600 }}>
          🎬 Todos os vídeos são do BibleProject
        </p>
        <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>
          Conteúdo educacional gratuito · bibleproject.com
        </p>
      </div>

    </div>
  );
}
