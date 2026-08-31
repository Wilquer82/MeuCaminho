import { useMemo, useState } from 'react';

const videos = [
  {
    id: 'genesis-bp',
    title: 'A História de Gênesis',
    youtubeId: 'hBMPXsR1EJk',
    duration: '9:18',
    category: 'AT',
    subcategory: 'Pentateuco',
    book: 'Gênesis',
    color: '#1a5c8a',
    featured: true,
    description: 'Descubra a história de Gênesis do Bible Project - uma visão geral do primeiro livro da Bíblia.'
  },
  {
    id: 'exodus-bp',
    title: 'A História de Êxodo',
    youtubeId: 'lnddaWQ_TZY',
    duration: '10:01',
    category: 'AT',
    subcategory: 'Pentateuco',
    book: 'Êxodo',
    color: '#2d7eb5',
    description: 'A jornada de libertação do povo de Israel sob a liderança de Moisés.'
  },
  {
    id: 'psalms-bp',
    title: 'A História dos Salmos',
    youtubeId: 'gwhyTddtx8E',
    duration: '9:47',
    category: 'AT',
    subcategory: 'Poesia',
    book: 'Salmos',
    color: '#8b5cf6',
    description: 'Os Salmos como expressão de louvor, lamento e devoção ao Senhor.'
  },
  {
    id: 'proverbs-bp',
    title: 'A História dos Provérbios',
    youtubeId: 'qDJI5IfeMsk',
    duration: '9:54',
    category: 'AT',
    subcategory: 'Sabedoria',
    book: 'Provérbios',
    color: '#d4a574',
    description: 'Sabedoria prática para viver uma vida de forma a agradar a Deus.'
  },
  {
    id: 'matthew-bp',
    title: 'A História de Mateus',
    youtubeId: 'MfLnILqNMEA',
    duration: '9:35',
    category: 'NT',
    subcategory: 'Evangelhos',
    book: 'Mateus',
    color: 'var(--accent2)',
    description: 'Mateus apresenta Jesus como o Messias prometido aos judeus.'
  },
  {
    id: 'luke-bp',
    title: 'A História de Lucas',
    youtubeId: 'T3QdxSl4F8A',
    duration: '9:29',
    category: 'NT',
    subcategory: 'Evangelhos',
    book: 'Lucas',
    color: '#10b981',
    description: 'Lucas conta a história de Jesus com ênfase nos necessitados e excluídos.'
  },
  {
    id: 'john-bp',
    title: 'A História de João',
    youtubeId: 'jvJhP1z4KqE',
    duration: '9:43',
    category: 'NT',
    subcategory: 'Evangelhos',
    book: 'João',
    color: '#0ea5e9',
    description: 'João apresenta Jesus como a Palavra de Deus encarnada.'
  },
  {
    id: 'romans-bp',
    title: 'A História de Romanos',
    youtubeId: 'qS8F2wL-cA4',
    duration: '9:56',
    category: 'NT',
    subcategory: 'Epístolas',
    book: 'Romanos',
    color: '#f59e0b',
    description: 'Paulo explica como a graça de Deus através de Jesus nos justifica.'
  },
  {
    id: 'revelation-bp',
    title: 'A História de Apocalipse',
    youtubeId: 'eB5dRBz6t3w',
    duration: '9:44',
    category: 'NT',
    subcategory: 'Profecia',
    book: 'Apocalipse',
    color: '#ef4444',
    description: 'Apocalipse revela o destino final de Deus para sua criação.'
  },
  {
    id: 'jesus-bp',
    title: 'Quem é Jesus?',
    youtubeId: 'YW_rMhm5sHw',
    duration: '8:15',
    category: 'Teologia',
    subcategory: 'Cristologia',
    book: 'Teologia',
    color: '#ba3b5b',
    description: 'Uma exploração de quem Jesus é segundo as Escrituras.'
  },
  {
    id: 'gospel-bp',
    title: 'O que é o Evangelho?',
    youtubeId: 'BRjeM5qWXD4',
    duration: '7:18',
    category: 'Teologia',
    subcategory: 'Salvação',
    book: 'Teologia',
    color: '#06b6d4',
    description: 'Uma explicação clara da mensagem central do Evangelho.'
  },
  {
    id: 'justice-bp',
    title: 'Justiça Bíblica',
    youtubeId: 'zPK87QyH1DY',
    duration: '8:32',
    category: 'Teologia',
    subcategory: 'Ética',
    book: 'Teologia',
    color: '#8b5cf6',
    description: 'Como Deus se importa com justiça e o que isso significa para nós.'
  }
];

export default function Videos() {
  const [filter, setFilter] = useState('all');
  const [bookFilter, setBookFilter] = useState('all');

  const contentFilters = [
    { id: 'all', label: 'Todos' },
    { id: 'AT', label: 'Antigo Testamento' },
    { id: 'NT', label: 'Novo Testamento' },
    { id: 'Teologia', label: 'Teologia' }
  ];

  const bookFilters = [
    { id: 'all', label: 'Todos os livros' },
    { id: 'Gênesis', label: 'Gênesis' },
    { id: 'Êxodo', label: 'Êxodo' },
    { id: 'Salmos', label: 'Salmos' },
    { id: 'Provérbios', label: 'Provérbios' },
    { id: 'Mateus', label: 'Mateus' },
    { id: 'Lucas', label: 'Lucas' },
    { id: 'João', label: 'João' },
    { id: 'Romanos', label: 'Romanos' },
    { id: 'Apocalipse', label: 'Apocalipse' }
  ];

  const openYouTube = (youtubeId) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
          onClick={() => openYouTube(featured.youtubeId)}
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
            }}>YOUTUBE</span>
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
          </div>
        </div>
      )}

      {/* Lista de vídeos */}
      {rest.map(video => (
        <div
          key={video.id}
          onClick={() => openYouTube(video.youtubeId)}
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
            <p style={{
              fontSize: 11, color: 'var(--muted)', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>Bible Project • Abrir no YouTube →</p>
          </div>
        </div>
      ))}

      {/* Nota sobre as fontes */}
      <div style={{
        marginTop: 16, padding: 12, borderRadius: 12,
        background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 11, color: '#ef4444', margin: 0, fontWeight: 600 }}>
          ▶️ Todos os vídeos abrem no YouTube
        </p>
        <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>
          Conteúdo oficial do Bible Project · youtube.com/@bibleproject
        </p>
      </div>

    </div>
  );
}
