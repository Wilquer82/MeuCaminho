import { useState } from 'react';

const categories = [
  { id: 'pentateuco', name: 'Pentateuco', icon: '📜', color: 'var(--accent2)', progress: 65, books: 'Gênesis a Deuteronômio · 5 livros' },
  { id: 'juizes', name: 'Juízes & Reinado', icon: '⚔️', color: '#ba3b5b', progress: 30, books: 'Josué a 2 Crônicas · 12 livros' },
  { id: 'poeticos', name: 'Livros Poéticos', icon: '🎵', color: 'var(--premium)', progress: 85, books: 'Jó, Salmos, Provérbios, Eclesiastes, Cantares' },
  { id: 'profetas', name: 'Profetas & Exílio', icon: '🔮', color: '#ba3b5b', progress: 20, books: 'Isaías a Malaquias · 17 livros' },
  { id: 'evangelhos', name: 'Evangelhos', icon: '✨', color: '#0d9488', progress: 45, books: 'Mateus, Marcos, Lucas, João' },
  { id: 'cartas', name: 'Cartas & Atos', icon: '✉️', color: '#ea580c', progress: 15, books: 'Atos, Romanos a Judas · 22 livros' },
  { id: 'apocalipse', name: 'Apocalipse', icon: '🔒', color: 'var(--muted)', progress: 0, books: 'Desbloqueie ao completar 50% das Cartas', locked: true }
];

export default function Categories() {
  const [active, setActive] = useState('poeticos');

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>
        Categorias Bíblicas
      </h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Como "idiomas" — escolha qual área explorar
      </p>

      {/* Curso atual */}
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

      {/* Gráfico de progresso */}
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
          {categories.slice(0, 7).map(cat => (
            <div key={cat.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4
            }}>
              <div style={{
                width: '100%', background: cat.locked ? 'var(--border)' : cat.color,
                borderRadius: '4px 4px 0 0', height: `${cat.progress}%`,
                minHeight: cat.progress > 0 ? 4 : 2, opacity: cat.locked ? .4 : 1
              }} />
              <span style={{ fontSize: 9, color: 'var(--muted)' }}>
                {cat.name.slice(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de categorias */}
      <p style={{
        fontSize: 11, fontWeight: 700, color: 'var(--muted)',
        margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.08em'
      }}>Antigo Testamento</p>

      {categories.slice(0, 4).map(cat => (
        <CategoryCard
          key={cat.id}
          category={cat}
          active={active === cat.id}
          onClick={() => setActive(cat.id)}
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
          active={active === cat.id}
          onClick={() => !cat.locked && setActive(cat.id)}
        />
      ))}

      {/* Teologia */}
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

function CategoryCard({ category, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card-tap"
      style={{
        background: category.locked ? 'var(--card)' : 'var(--card)',
        border: active ? `2px solid ${category.color}` : '1px solid var(--border)',
        borderRadius: 14, padding: 12, marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: category.locked ? 'not-allowed' : 'pointer',
        opacity: category.locked ? .6 : 1
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: category.locked ? 'rgba(0,0,0,.05)' : `${category.color}1a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0
      }}>{category.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{
            fontSize: 14, fontWeight: 700, margin: 0,
            color: category.locked ? 'var(--muted)' : 'var(--text)'
          }}>{category.name}</p>
          {!category.locked && (
            <span style={{
              fontSize: 9, fontWeight: 600,
              background: `${category.color}1a`, color: category.color,
              padding: '2px 7px', borderRadius: 8
            }}>{category.progress}%</span>
          )}
        </div>
        <p style={{
          fontSize: 11, color: 'var(--muted)', margin: '2px 0 6px'
        }}>{category.books}</p>
        {!category.locked && (
          <div style={{ height: 4, background: 'rgba(0,0,0,.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${category.progress}%`,
              background: category.color, borderRadius: 2
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
