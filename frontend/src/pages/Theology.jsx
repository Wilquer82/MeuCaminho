import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const units = [
  { id: 1, title: 'A Bíblia', desc: 'Inspiração, autoridade e canonicidade', status: 'completed', icon: '✓' },
  { id: 2, title: 'Deus', desc: 'Trindade, atributos e obra de criação', status: 'current', icon: '2' },
  { id: 3, title: 'Cristo', desc: 'Encarnação, pessoa e obra de Jesus', status: 'locked', icon: '🔒' },
  { id: 4, title: 'Espírito Santo', desc: 'Pessoa, obra e dons espirituais', status: 'locked', icon: '🔒' },
  { id: 5, title: 'Homem e Pecado', desc: 'Criação, queda e depravação total', status: 'locked', icon: '🔒' },
  { id: 6, title: 'Salvação', desc: 'Graça, fé, justificação e santificação', status: 'locked', icon: '🔒' },
  { id: 7, title: 'Igreja', desc: 'Corpo de Cristo, ordenanças e missão', status: 'locked', icon: '🔒' },
  { id: 8, title: 'Reino de Deus', desc: 'Já e ainda não — escatologia bíblica', status: 'locked', icon: '🔒' },
  { id: 9, title: 'Escatologia', desc: 'Fim dos tempos, volta de Cristo e eternidade', status: 'locked', icon: '🔒' },
  { id: 10, title: 'Ética Cristã', desc: 'Vida santa, relacionamentos e cultura', status: 'locked', icon: '🔒' }
];

export default function Theology() {
  const { user } = useAuth();
  const isPremium = user?.isPremium || user?.plan !== 'free';

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <div style={{ margin: '16px 0 14px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
          Teologia Básica
        </h2>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
          Como um "novo idioma" · Estude a doutrina cristã
        </p>
      </div>

      {/* Cabeçalho do curso */}
      <div style={{
        background: 'linear-gradient(135deg, var(--premium), #5b21b6)',
        borderRadius: 16, padding: 16, marginBottom: 14, color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22
          }}>🎓</div>
          <div>
            <p style={{ fontSize: 10, opacity: .8, margin: 0, textTransform: 'uppercase', letterSpacing: '.05em' }}>Curso</p>
            <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Teologia Sistemática</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div><p style={{ fontSize: 10, opacity: .7, margin: 0 }}>Unidades</p><p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>10</p></div>
          <div><p style={{ fontSize: 10, opacity: .7, margin: 0 }}>Progresso</p><p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>1/10</p></div>
          <div><p style={{ fontSize: 10, opacity: .7, margin: 0 }}>Fonte</p><p style={{ fontSize: 11, fontWeight: 600, margin: 0 }}>BibleProject + Credos</p></div>
        </div>
      </div>

      {/* Aviso Premium */}
      {!isPremium && (
        <div style={{
          background: 'var(--premium-soft)', border: '1px solid var(--premium)',
          borderRadius: 12, padding: 12, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--premium)', margin: 0 }}>
              Conteúdo Premium
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
              Unidades 3-10 disponíveis apenas para assinantes
            </p>
          </div>
        </div>
      )}

      {/* Lista de unidades */}
      {units.map(unit => (
        <UnitCard key={unit.id} unit={unit} isPremium={isPremium} />
      ))}

      {/* Nota sobre fontes */}
      <div style={{
        marginTop: 14, padding: 12, borderRadius: 12,
        background: 'var(--premium-soft)', border: '1px solid rgba(139,92,246,.2)'
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--premium)', margin: '0 0 4px' }}>
          📚 FONTES LEGÍTIMAS E GRATUITAS
        </p>
        <p style={{ fontSize: 11, margin: 0, lineHeight: 1.5 }}>
          Conteúdo baseado em: BibleProject (vídeos gratuitos), Credo Apostólico,
          Credo de Niceia, Confissão de Fé de Westminster (domínio público),
          e artigos da Got Questions.
        </p>
      </div>

    </div>
  );
}

function UnitCard({ unit, isPremium }) {
  const isLocked = unit.status === 'locked' && !isPremium;

  const styles = {
    completed: {
      bg: 'var(--card)', border: '1px solid var(--accent)',
      iconBg: 'var(--accent)', iconColor: '#fff'
    },
    current: {
      bg: 'linear-gradient(135deg, var(--premium-soft), #fff)',
      border: '1px solid var(--premium)',
      iconBg: 'var(--premium)', iconColor: '#fff'
    },
    locked: {
      bg: 'var(--card)', border: '1px solid var(--border)',
      iconBg: 'rgba(0,0,0,.06)', iconColor: 'var(--muted)', opacity: isLocked ? .6 : 1
    }
  };

  const s = styles[unit.status];

  return (
    <div
      className="card-tap"
      style={{
        background: s.bg, border: s.border,
        borderRadius: 14, padding: 12, marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: s.opacity || 1
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: s.iconBg, color: s.iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 14
      }}>{unit.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 700, margin: 0,
          color: isLocked ? 'var(--muted)' : 'var(--text)'
        }}>
          Unidade {unit.id} · {unit.title}
        </p>
        <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0' }}>
          {unit.desc}
        </p>
      </div>
      {unit.status === 'current' && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--premium)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
        }}>▶</div>
      )}
    </div>
  );
}
