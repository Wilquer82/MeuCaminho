import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const levels = [
  { id: 'basico', name: 'Revisão Básica', icon: '📖', color: 'var(--accent)', desc: 'Perguntas simples · 5 questões', xp: 15 },
  { id: 'intermediario', name: 'Revisão Intermediária', icon: '💡', color: 'var(--accent2)', desc: 'Citações e contexto · 8 questões', xp: 25 },
  { id: 'avancado', name: 'Revisão Avançada', icon: '🎓', color: 'var(--premium)', desc: 'Hebraico e contexto histórico · 10 questões', xp: 40 }
];

export default function Review() {
  const { user, updateUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [activeLevel, setActiveLevel] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = async (level) => {
    try {
      const { data } = await api.get('/quiz', { params: { difficulty: level, limit: 5 } });

      if (!data || data.length === 0) {
        setQuestions([]);
        setActiveLevel(null);
        alert('Nenhuma pergunta disponível para este nível no momento.');
        return;
      }

      setQuestions(data);
      setActiveLevel(level);
      setCurrentIdx(0);
      setSelected(null);
      setAnswered(false);
      setCorrectCount(0);
      setShowResult(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar perguntas');
    }
  };

  const selectOption = (idx) => {
    if (answered) return;
    setSelected(idx);
  };

  const confirmAnswer = async () => {
    if (selected === null) return;

    try {
      const { data } = await api.post('/quiz/answer', {
        questionId: questions[currentIdx]._id,
        selectedIndex: selected
      });

      setAnswered(true);
      if (data.isCorrect) {
        setCorrectCount(prev => prev + 1);
        if (data.xpEarned > 0) {
          updateUser({ xp: (user?.xp || 0) + data.xpEarned });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setActiveLevel(null);
    setQuestions([]);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div style={{ padding: '40px 20px 100px', textAlign: 'center' }} className="fade-in">
        <div style={{ fontSize: 60, marginBottom: 16 }}>
          {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>
          Revisão concluída!
        </h2>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', margin: '0 0 4px' }}>
          {correctCount}/{questions.length} acertos
        </p>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 24px' }}>
          {percentage}% de aproveitamento
        </p>
        <button
          onClick={resetQuiz}
          style={{
            padding: '12px 28px', borderRadius: 12, border: 'none',
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer'
          }}
        >
          Tentar outro nível
        </button>
      </div>
    );
  }

  if (activeLevel && questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div style={{ padding: '0 18px 100px' }} className="fade-in">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          margin: '16px 0 12px'
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
            Pergunta {currentIdx + 1}/{questions.length}
          </span>
          <button
            onClick={resetQuiz}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}
          >
            Sair
          </button>
        </div>

        <div style={{ height: 6, background: 'rgba(0,0,0,.06)', borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${((currentIdx + 1) / questions.length) * 100}%`,
            background: 'var(--accent)', borderRadius: 3, transition: 'width .3s ease'
          }} />
        </div>

        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 20, marginBottom: 14
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px', lineHeight: 1.5 }}>
            {q.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, i) => {
              let style = {
                textAlign: 'left', padding: 12, borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--bg)',
                fontSize: 13, cursor: answered ? 'default' : 'pointer',
                fontFamily: 'inherit'
              };

              if (answered && i === selected) {
                style.borderColor = 'var(--danger)';
                style.background = 'rgba(220,38,38,.08)';
                style.color = 'var(--danger)';
              }

              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  disabled={answered}
                  style={{
                    ...style,
                    borderColor: selected === i && !answered ? 'var(--accent)' : style.borderColor,
                    background: selected === i && !answered ? 'var(--accent-soft)' : style.background
                  }}
                >
                  <span style={{ fontWeight: 700, marginRight: 8 }}>
                    {String.fromCharCode(65 + i)})
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={answered ? nextQuestion : confirmAnswer}
          disabled={selected === null}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: selected === null ? '#cbd5e1' : 'var(--accent)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: selected === null ? 'not-allowed' : 'pointer'
          }}
        >
          {answered ? (currentIdx < questions.length - 1 ? 'Próxima pergunta →' : 'Ver resultado') : 'Confirmar'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>Revisão</h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px' }}>
        Fortaleça sua memória com perguntas evolutivas
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16
      }}>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 12, textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase' }}>Revisadas</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>147</p>
          <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>versículos</p>
        </div>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 12, textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase' }}>Sequência</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent2)', margin: 0 }}>8</p>
          <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>acertos</p>
        </div>
      </div>

      {levels.map(level => (
        <div
          key={level.id}
          onClick={() => startQuiz(level.id)}
          className="card-tap"
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 14, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer'
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${level.color}1a`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0
          }}>{level.icon}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{level.name}</p>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0' }}>
              {level.desc}
            </p>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 700, color: level.color,
            background: `${level.color}1a`, padding: '4px 10px', borderRadius: 10
          }}>+{level.xp} XP</span>
        </div>
      ))}
    </div>
  );
}
