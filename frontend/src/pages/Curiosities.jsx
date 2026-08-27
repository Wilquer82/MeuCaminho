import { useState, useEffect } from 'react';
import api from '../services/api';

const categories = [
  { id: '', name: 'Todas', color: 'var(--accent)' },
  { id: 'histórica', name: '🏛️ Histórica', color: 'var(--accent2)' },
  { id: 'cultural', name: '🌾 Cultural', color: '#0d9488' },
  { id: 'hebraico', name: '📜 Hebraico', color: 'var(--premium)' },
  { id: 'geográfica', name: '🗺️ Geográfica', color: '#ea580c' }
];

export default function Curiosities() {
  const [items, setItems] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCuriosities();
  }, [activeCat]);

  const loadCuriosities = async () => {
    try {
      setLoading(true);
      const params = activeCat ? { category: activeCat } : {};
      const { data } = await api.get('/curiosities', { params });
      setItems(data.length > 0 ? data : getMockCuriosities());
    } catch {
      setItems(getMockCuriosities());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>
        Curiosidades Bíblicas
      </h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
        Históricas, culturais e linguísticas
      </p>

      {/* Chips de categoria */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 14,
        overflowX: 'auto', paddingBottom: 4
      }} className="no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: activeCat === cat.id ? '1px solid transparent' : '1px solid var(--border)',
              background: activeCat === cat.id ? `${cat.color}1a` : 'var(--card)',
              color: activeCat === cat.id ? cat.color : 'var(--muted)',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
            }}
          >{cat.name}</button>
        ))}
      </div>

      {/* Destaque */}
      {items[0] && (
        <div className="card-tap" style={{
          background: 'linear-gradient(135deg, var(--premium), #5b21b6)',
          borderRadius: 16, padding: 16, marginBottom: 12, color: '#fff',
          cursor: 'pointer'
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,.2)',
            padding: '3px 10px', borderRadius: 10
          }}>📜 {items[0].category?.toUpperCase() || 'HEBRAICO'}</span>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '10px 0 6px' }}>
            {items[0].title}
          </h3>
          <p style={{ fontSize: 12, opacity: .9, margin: 0, lineHeight: 1.5 }}>
            {items[0].content.substring(0, 120)}...
          </p>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 20 }}>Carregando...</p>
      ) : items.slice(1).map((item, i) => (
        <div
          key={i}
          className="card-tap"
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 14, marginBottom: 10,
            display: 'flex', gap: 10, cursor: 'pointer'
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `${getCategoryColor(item.category)}1a`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>{getCategoryIcon(item.category)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 10, color: getCategoryColor(item.category),
              fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.05em'
            }}>{item.category}</p>
            <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 5px' }}>{item.title}</p>
            <p style={{
              fontSize: 11, color: 'var(--muted)', margin: 0,
              lineHeight: 1.5, overflow: 'hidden',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
            }}>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getCategoryColor(cat) {
  const map = {
    'histórica': 'var(--accent2)',
    'cultural': '#0d9488',
    'hebraico': 'var(--premium)',
    'geográfica': '#ea580c',
    'arqueológica': '#ba3b5b'
  };
  return map[cat] || 'var(--accent)';
}

function getCategoryIcon(cat) {
  const map = {
    'histórica': '🏛️',
    'cultural': '🌾',
    'hebraico': '📜',
    'geográfica': '🗺️',
    'arqueológica': '⚱️'
  };
  return map[cat] || '💡';
}

function getMockCuriosities() {
  return [
    {
      title: 'O "Alef" e a criação',
      category: 'hebraico',
      content: 'A primeira letra do alfabeto hebraico, א (Alef), tem valor numérico 1 e representa a unidade de Deus. Curiosamente, a primeira palavra da Bíblia "Bereshit" (בראשית) começa com ב (Bet, valor 2), simbolizando que a criação começa a partir da unidade divina.'
    },
    {
      title: 'O Cilindro de Ciro',
      category: 'histórica',
      content: 'Um artefato persa de 539 a.C. confirma o decreto de Ciro que permitiu o retorno dos judeus do exílio babilônico, exatamente como descrito em 2 Crônicas 36:23 e Esdras 1.'
    },
    {
      title: 'O "pão da presença"',
      category: 'cultural',
      content: 'No Tabernáculo, 12 pães eram dispostos em duas fileiras de 6, representando as 12 tribos de Israel. Eram trocados todo sábado e os sacerdotes comiam os pães antigos — um ritual de comunhão com a presença divina.'
    },
    {
      title: 'Shalom não é só "paz"',
      category: 'hebraico',
      content: 'A palavra hebraica שָׁלוֹם (shalom) vem da raiz sh-l-m que significa "completo", "íntegro". Vai além da ausência de guerra — significa plenitude, harmonia, bem-estar completo.'
    },
    {
      title: 'Jerusalém: a cidade baixa',
      category: 'geográfica',
      content: 'A "Cidade de Davi" original ficava na colina sul (a cidade baixa), a apenas 700m de altitude. A expansão para o norte (Monte Moriá/Sião) aconteceu posteriormente, unindo-se ao templo.'
    }
  ];
}
