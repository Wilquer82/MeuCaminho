import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const bookChapterMap = {
  psalms: 150,
  isaiah: 66,
  jeremiah: 52,
  ezekiel: 48,
  daniel: 12,
  genesis: 50,
  exodus: 40,
  leviticus: 27,
  numbers: 36,
  deuteronomy: 34,
  joshua: 24,
  judges: 21,
  ruth: 4,
  '1-samuel': 31,
  '2-samuel': 24,
  '1-kings': 22,
  '2-kings': 25,
  '1-chronicles': 29,
  '2-chronicles': 36,
  job: 42,
  proverbs: 31,
  ecclesiastes: 12,
  'song-of-solomon': 8,
  hosea: 14,
  joel: 3,
  amos: 9,
  obadiah: 1,
  jonah: 4,
  micah: 7,
  nahum: 3,
  habakkuk: 3,
  zephaniah: 3,
  haggai: 2,
  zechariah: 14,
  malachi: 4,
  matthew: 28,
  mark: 16,
  luke: 24,
  john: 21,
  acts: 28,
  romans: 16,
  '1-corinthians': 16,
  '2-corinthians': 13,
  galatians: 6,
  ephesians: 6,
  philippians: 4,
  colossians: 4,
  '1-thessalonians': 5,
  '2-thessalonians': 3,
  '1-timothy': 6,
  '2-timothy': 4,
  titus: 3,
  philemon: 1,
  hebrews: 13,
  james: 5,
  '1-peter': 5,
  '2-peter': 3,
  '1-john': 5,
  '2-john': 1,
  '3-john': 1,
  jude: 1,
  revelation: 22,
  lamentations: 5
};

const categoryBooks = {
  pentateuco: [
    { slug: 'genesis', label: 'Gênesis' },
    { slug: 'exodus', label: 'Êxodo' },
    { slug: 'leviticus', label: 'Levítico' },
    { slug: 'numbers', label: 'Números' },
    { slug: 'deuteronomy', label: 'Deuteronômio' }
  ],
  juizes: [
    { slug: 'joshua', label: 'Josué' },
    { slug: 'judges', label: 'Juízes' },
    { slug: 'ruth', label: 'Rute' },
    { slug: '1-samuel', label: '1 Samuel' },
    { slug: '2-samuel', label: '2 Samuel' },
    { slug: '1-kings', label: '1 Reis' },
    { slug: '2-kings', label: '2 Reis' },
    { slug: '1-chronicles', label: '1 Crônicas' },
    { slug: '2-chronicles', label: '2 Crônicas' }
  ],
  poeticos: [
    { slug: 'job', label: 'Jó' },
    { slug: 'psalms', label: 'Salmos' },
    { slug: 'proverbs', label: 'Provérbios' },
    { slug: 'ecclesiastes', label: 'Eclesiastes' },
    { slug: 'song-of-solomon', label: 'Cantares' }
  ],
  profetas: [
    { slug: 'isaiah', label: 'Isaías' },
    { slug: 'jeremiah', label: 'Jeremias' },
    { slug: 'lamentations', label: 'Lamentações' },
    { slug: 'ezekiel', label: 'Ezequiel' },
    { slug: 'daniel', label: 'Daniel' },
    { slug: 'hosea', label: 'Oséias' },
    { slug: 'joel', label: 'Joel' },
    { slug: 'amos', label: 'Amós' },
    { slug: 'obadiah', label: 'Obadias' },
    { slug: 'jonah', label: 'Jonas' },
    { slug: 'micah', label: 'Miqueias' },
    { slug: 'nahum', label: 'Naum' },
    { slug: 'habakkuk', label: 'Habacuque' },
    { slug: 'zephaniah', label: 'Sofonias' },
    { slug: 'haggai', label: 'Ageu' },
    { slug: 'zechariah', label: 'Zacarias' },
    { slug: 'malachi', label: 'Malaquias' }
  ],
  evangelhos: [
    { slug: 'matthew', label: 'Mateus' },
    { slug: 'mark', label: 'Marcos' },
    { slug: 'luke', label: 'Lucas' },
    { slug: 'john', label: 'João' }
  ],
  cartas: [
    { slug: 'acts', label: 'Atos' },
    { slug: 'romans', label: 'Romanos' },
    { slug: '1-corinthians', label: '1 Coríntios' },
    { slug: '2-corinthians', label: '2 Coríntios' },
    { slug: 'galatians', label: 'Gálatas' },
    { slug: 'ephesians', label: 'Efésios' },
    { slug: 'philippians', label: 'Filipenses' },
    { slug: 'colossians', label: 'Colossenses' },
    { slug: '1-thessalonians', label: '1 Tessalonicenses' },
    { slug: '2-thessalonians', label: '2 Tessalonicenses' },
    { slug: '1-timothy', label: '1 Timóteo' },
    { slug: '2-timothy', label: '2 Timóteo' },
    { slug: 'titus', label: 'Tito' },
    { slug: 'philemon', label: 'Filemon' },
    { slug: 'hebrews', label: 'Hebreus' },
    { slug: 'james', label: 'Tiago' },
    { slug: '1-peter', label: '1 Pedro' },
    { slug: '2-peter', label: '2 Pedro' },
    { slug: '1-john', label: '1 João' },
    { slug: '2-john', label: '2 João' },
    { slug: '3-john', label: '3 João' },
    { slug: 'jude', label: 'Judas' }
  ],
  apocalipse: [{ slug: 'revelation', label: 'Apocalipse' }]
};

const categories = [
  { id: 'pentateuco', name: 'Pentateuco', icon: '📜', color: 'var(--accent2)', progress: 65, books: 'Gênesis a Deuteronômio · 5 livros', booksList: categoryBooks.pentateuco },
  { id: 'juizes', name: 'Juízes & Reinado', icon: '⚔️', color: '#ba3b5b', progress: 30, books: 'Josué a 2 Crônicas · 9 livros', booksList: categoryBooks.juizes },
  { id: 'poeticos', name: 'Livros Poéticos', icon: '🎵', color: 'var(--premium)', progress: 85, books: 'Jó, Salmos, Provérbios, Eclesiastes, Cantares', booksList: categoryBooks.poeticos },
  { id: 'profetas', name: 'Profetas & Exílio', icon: '🔮', color: '#ba3b5b', progress: 20, books: 'Isaías a Malaquias · 17 livros', booksList: categoryBooks.profetas },
  { id: 'evangelhos', name: 'Evangelhos', icon: '✨', color: '#0d9488', progress: 45, books: 'Mateus, Marcos, Lucas, João', booksList: categoryBooks.evangelhos },
  { id: 'cartas', name: 'Cartas & Atos', icon: '✉️', color: '#ea580c', progress: 15, books: 'Atos, Romanos a Judas · 22 livros', booksList: categoryBooks.cartas },
  { id: 'apocalipse', name: 'Apocalipse', icon: '📖', color: '#7c3aed', progress: 0, books: 'Apocalipse · 1 livro', booksList: categoryBooks.apocalipse }
];

export default function Categories() {
  const [active, setActive] = useState('poeticos');
  const [progress, setProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/progress/summary')
      .then(({ data }) => setProgress(data.categories || {}))
      .catch(() => setProgress({}));
  }, []);

  const handleCategoryClick = (category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      return;
    }

    setActive(category.id);
    setSelectedCategory(category);
  };

  const chapterOptions = useMemo(() => {
    return (bookSlug) => {
      const chapterCount = bookChapterMap[bookSlug] || 50;
      return Array.from({ length: chapterCount }, (_, index) => index + 1);
    };
  }, []);

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>
        Categorias Bíblicas
      </h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Em ordem bíblica e pronta para abrir no capítulo escolhido
      </p>

      <div className="card-tap" style={{
        background: 'linear-gradient(135deg, var(--accent), #1a5c20)',
        borderRadius: 16, padding: 14, marginBottom: 14, color: '#fff',
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0
          }}>🎵</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, opacity: .8, margin: 0, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Curso atual
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 0' }}>
              Poéticos · Salmos
            </p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: 'rgba(255,255,255,.25)', padding: '4px 10px', borderRadius: 10
          }}>Unidade 3</span>
        </div>
      </div>

      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 12, marginBottom: 14
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 8px' }}>
          Seu progresso por categoria
        </p>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 4px'
        }}>
          {categories.map(cat => {
            const categoryProgress = progress[cat.id]?.percentage ?? 0;
            return <div key={cat.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4
            }}>
              <div style={{
                width: '100%', background: cat.color,
                borderRadius: '4px 4px 0 0', height: `${categoryProgress}%`,
                minHeight: categoryProgress > 0 ? 4 : 2, opacity: 1
              }} />
              <span style={{ fontSize: 9, color: 'var(--muted)' }}>
                {cat.name.slice(0, 4)}
              </span>
            </div>;
          })}
        </div>
      </div>

      <p style={{
        fontSize: 11, fontWeight: 700, color: 'var(--muted)',
        margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.08em'
      }}>Antigo Testamento</p>

      {categories.slice(0, 4).map(cat => (
        <CategoryCard
          key={cat.id}
          category={cat}
          progress={progress[cat.id]?.percentage ?? 0}
          active={active === cat.id}
          onClick={() => handleCategoryClick(cat)}
        />
      ))}

      <p style={{
        fontSize: 11, fontWeight: 700, color: 'var(--muted)',
        margin: '16px 0 8px', textTransform: 'uppercase', letterSpacing: '.08em'
      }}>Novo Testamento</p>

      {categories.slice(4).map(cat => (
        <CategoryCard
          key={cat.id}
          category={cat}
          progress={progress[cat.id]?.percentage ?? 0}
          active={active === cat.id}
          onClick={() => handleCategoryClick(cat)}
        />
      ))}

      {selectedCategory && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
          padding: 12, marginTop: 8, marginBottom: 18
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: 'var(--muted)' }}>
              Livros de {selectedCategory.name}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}
            >
              Fechar
            </button>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {selectedCategory.booksList.map(book => {
              const chapterValue = selectedChapters[book.slug] || 1;
              return (
                <div key={book.slug} style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12,
                  padding: 10, display: 'grid', gap: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{book.label}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/bible?book=${book.slug}&chapter=${chapterValue}`)}
                      style={{
                        border: 'none', borderRadius: 8, background: 'var(--accent)',
                        color: '#fff', fontWeight: 700, padding: '8px 10px', cursor: 'pointer'
                      }}
                    >
                      Abrir
                    </button>
                  </div>

                  <label style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Capítulo
                    <select
                      value={chapterValue}
                      onChange={event => setSelectedChapters(previous => ({ ...previous, [book.slug]: Number(event.target.value) }))}
                      style={{
                        width: '100%', marginTop: 6, border: '1px solid var(--border)',
                        background: 'var(--card)', color: 'var(--text)', borderRadius: 8,
                        padding: '8px 10px'
                      }}
                    >
                      {chapterOptions(book.slug).map(option => (
                        <option key={option} value={option}>Capítulo {option}</option>
                      ))}
                    </select>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{
        height: 1, background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        margin: '18px 0'
      }} />

      <p style={{
        fontSize: 11, fontWeight: 700, color: 'var(--premium)',
        margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.08em'
      }}>📚 Curso Extra · Teologia</p>

      <div className="card-tap" style={{
        background: 'linear-gradient(135deg, var(--premium-soft), #fff)',
        border: '1px solid var(--premium)', borderRadius: 14,
        padding: 12, display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer'
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'var(--premium)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0
        }}>🎓</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Teologia Básica</p>
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 6px' }}>
            10 unidades doutrinárias
          </p>
          <div style={{ height: 4, background: 'var(--premium-soft)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '10%', background: 'var(--premium)', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, progress, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card-tap"
      style={{
        background: 'var(--card)',
        border: active ? `2px solid ${category.color}` : '1px solid var(--border)',
        borderRadius: 14, padding: 12, marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer'
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${category.color}1a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0
      }}>{category.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{
            fontSize: 14, fontWeight: 700, margin: 0,
            color: 'var(--text)'
          }}>{category.name}</p>
          <span style={{
            fontSize: 9, fontWeight: 600,
            background: `${category.color}1a`, color: category.color,
            padding: '2px 7px', borderRadius: 8
          }}>{progress}%</span>
        </div>
        <p style={{
          fontSize: 11, color: 'var(--muted)', margin: '2px 0 6px'
        }}>{category.books}</p>
        <div style={{ height: 4, background: 'rgba(0,0,0,.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: category.color, borderRadius: 2
          }} />
        </div>
      </div>
    </div>
  );
}
