import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const units = [
  { 
    id: 1, 
    title: 'A Bíblia', 
    desc: 'Inspiração, autoridade e canonicidade', 
    status: 'completed', 
    icon: '✓',
    content: 'A Bíblia é a Palavra de Deus, inspirada pelo Espírito Santo e escrita por homens. É a autoridade suprema para a fé e prática cristã. O conceito de canonicidade refere-se aos livros que foram reconhecidos pela comunidade cristã como originários de Deus.'
  },
  { 
    id: 2, 
    title: 'Deus', 
    desc: 'Trindade, atributos e obra de criação', 
    status: 'current', 
    icon: '2',
    content: 'Deus existe eternamente em três pessoas: Pai, Filho e Espírito Santo — um em essência, mas distintos em pessoa. Seus atributos incluem: onipotência, onisciência, eternidade, justiça, misericórdia e amor. Deus criou o universo do nada pela palavra de seu poder.'
  },
  { 
    id: 3, 
    title: 'Cristo', 
    desc: 'Encarnação, pessoa e obra de Jesus', 
    status: 'locked', 
    icon: '🔒',
    content: 'Jesus Cristo é Deus encarnado, plenamente Deus e plenamente homem. Viveu uma vida sem pecado, morreu em sacrifício pelos pecados da humanidade e ressuscitou ao terceiro dia. Sua obra redentora oferece salvação a todos os que creem.'
  },
  { 
    id: 4, 
    title: 'Espírito Santo', 
    desc: 'Pessoa, obra e dons espirituais', 
    status: 'locked', 
    icon: '🔒',
    content: 'O Espírito Santo é a terceira pessoa da Trindade, responsável por convidar os homens ao arrependimento, regenerar os crentes e capacitá-los para o serviço. Distribui dons espirituais para edificação da Igreja.'
  },
  { 
    id: 5, 
    title: 'Homem e Pecado', 
    desc: 'Criação, queda e depravação total', 
    status: 'locked', 
    icon: '🔒',
    content: 'O homem foi criado à imagem e semelhança de Deus com capacidade de escolha. Através de Adão, o pecado entrou no mundo, afetando toda a humanidade. A depravação total não significa que o homem é tão mau quanto possível, mas que o pecado afeta todas as áreas de sua vida.'
  },
  { 
    id: 6, 
    title: 'Salvação', 
    desc: 'Graça, fé, justificação e santificação', 
    status: 'locked', 
    icon: '🔒',
    content: 'A salvação é pela graça de Deus, recebida pela fé em Jesus Cristo. Inclui: justificação (declaração de justo), adoção (entrada na família de Deus), regeneração (novo nascimento) e santificação (processo de crescimento em santidade).'
  },
  { 
    id: 7, 
    title: 'Igreja', 
    desc: 'Corpo de Cristo, ordenanças e missão', 
    status: 'locked', 
    icon: '🔒',
    content: 'A Igreja é o corpo de Cristo, composta por todos os redimidos. Pratica as ordenanças (batismo e ceia) como memoriais de Cristo. Sua missão é pregar o evangelho, fazer discípulos e servir aos necessitados.'
  },
  { 
    id: 8, 
    title: 'Reino de Deus', 
    desc: 'Já e ainda não — escatologia bíblica', 
    status: 'locked', 
    icon: '🔒',
    content: 'O Reino de Deus é presente (no coração dos crentes agora) e futuro (será consumado quando Cristo retornar). Esta tensão do "já e ainda não" caracteriza a vida cristã entre a primeira e segunda vinda de Cristo.'
  },
  { 
    id: 9, 
    title: 'Escatologia', 
    desc: 'Fim dos tempos, volta de Cristo e eternidade', 
    status: 'locked', 
    icon: '🔒',
    content: 'A escatologia é o estudo dos últimos tempos. Envolve a volta de Cristo, o julgamento final, a ressurreição dos mortos e a vida eterna. Cristãos de diferentes tradições interpretam esses eventos de maneiras distintas, mas todos aguardam o retorno glorioso de Cristo.'
  },
  { 
    id: 10, 
    title: 'Ética Cristã', 
    desc: 'Vida santa, relacionamentos e cultura', 
    status: 'locked', 
    icon: '🔒',
    content: 'Seguidores de Cristo são chamados a uma vida de santidade e integridade. A ética cristã abrange: relacionamentos (família, amigos, inimigos), trabalho, finanças, política e engajamento cultural. O fundamento é o amor a Deus e ao próximo.'
  }
];

export default function Theology() {
  const { user, updateUser } = useAuth();
  const [selectedUnitId, setSelectedUnitId] = useState(2);
  const [message, setMessage] = useState('');
  const [completingReading, setCompletingReading] = useState(false);
  const [completedReadings, setCompletedReadings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('completedTheologyUnits') || '[]');
    } catch {
      return [];
    }
  });

  const isPremium = user?.isPremium || user?.plan !== 'free';
  const selectedUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const isReadingCompleted = completedReadings.includes(selectedUnitId);

  async function completeReading() {
    if (!selectedUnit || isReadingCompleted) return;
    setCompletingReading(true);
    setMessage('');

    try {
      const xpReward = 25;
      const response = await api.post('/progress/theology-complete', {
        unitId: selectedUnit.id,
        title: selectedUnit.title,
        xpReward
      });

      const newCompleted = [...completedReadings, selectedUnitId];
      setCompletedReadings(newCompleted);
      localStorage.setItem('completedTheologyUnits', JSON.stringify(newCompleted));

      updateUser({ xp: response.data.newXp });
      setMessage(`+${xpReward} XP! Unidade concluída.`);
    } catch {
      setMessage('Erro ao registrar leitura. Tente novamente.');
    } finally {
      setCompletingReading(false);
    }
  }

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

      {/* View de leitura detalhada */}
      {selectedUnit && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 14
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, color: 'var(--premium)',
                margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.05em'
              }}>
                Unidade {selectedUnit.id}
              </p>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                {selectedUnit.title}
              </h2>
            </div>
            {isReadingCompleted && (
              <span style={{
                fontSize: 18, fontWeight: 700, color: 'var(--success)',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 8px',
                borderRadius: 6
              }}>✓</span>
            )}
          </div>

          <div style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--text)',
            marginBottom: 14
          }}>
            <p style={{ margin: 0 }}>
              {selectedUnit.content}
            </p>
          </div>

          <button
            type="button"
            onClick={completeReading}
            disabled={isReadingCompleted || completingReading}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: 'none',
              background: isReadingCompleted ? 'var(--success)' : 'var(--premium)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: isReadingCompleted ? 'default' : 'pointer',
              opacity: completingReading ? 0.6 : 1
            }}
          >
            {completingReading ? 'Registrando...' : isReadingCompleted ? '✓ Unidade concluída • +25 XP' : 'Marcar como lido (+25 XP)'}
          </button>

          {message && (
            <p style={{
              marginTop: 10,
              fontSize: 12,
              color: message.includes('+') ? 'var(--success)' : 'var(--danger)',
              textAlign: 'center',
              fontWeight: 600
            }}>
              {message}
            </p>
          )}
        </div>
      )}

      {/* Lista de unidades */}
      {units.map(unit => (
        <UnitCard 
          key={unit.id} 
          unit={unit} 
          isPremium={isPremium}
          isSelected={selectedUnitId === unit.id}
          onSelect={() => setSelectedUnitId(unit.id)}
          isCompleted={completedReadings.includes(unit.id)}
        />
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

function UnitCard({ unit, isPremium, isSelected, onSelect, isCompleted }) {
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
      onClick={() => !isLocked && onSelect()}
      style={{
        background: isSelected ? 'linear-gradient(135deg, var(--premium-soft), #fff)' : s.bg, 
        border: isSelected ? '2px solid var(--premium)' : s.border,
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
      {isCompleted && (
        <span style={{ color: 'var(--success)', fontSize: 16, fontWeight: 700 }}>✓</span>
      )}
    </div>
  );
}
