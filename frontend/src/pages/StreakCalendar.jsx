import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function StreakCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completedDays, setCompletedDays] = useState([]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().getDate();
  const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear();

  useEffect(() => {
    api.get('/progress/activity', { params: { year, month } })
      .then(({ data }) => setCompletedDays(data))
      .catch(() => setCompletedDays([]));
  }, [year, month]);

  const frozenDays = [];
  const missedDays = [];

  const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getDayStyle = (day) => {
    if (!day) return { visibility: 'hidden' };

    const isToday = isCurrentMonth && day === today;
    const isCompleted = completedDays.includes(day);
    const isFrozen = frozenDays.includes(day);
    const isMissed = missedDays.includes(day);
    const isFuture = isCurrentMonth && day > today;

    let bg = 'var(--bg)';
    let color = 'var(--text)';
    let border = '1px solid var(--border)';

    if (isCompleted) { bg = 'var(--accent)'; color = '#fff'; border = 'none'; }
    else if (isToday) { bg = 'var(--accent2)'; color = '#fff'; border = 'none'; }
    else if (isFrozen) { bg = '#3b82f6'; color = '#fff'; border = 'none'; }
    else if (isMissed) { bg = 'rgba(220,38,38,.1)'; color = 'var(--danger)'; border = '1px solid rgba(220,38,38,.3)'; }
    else if (isFuture) { bg = 'transparent'; border = '1px dashed var(--border)'; color = 'var(--muted)'; }

    return {
      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 8, fontSize: 12, fontWeight: 600, background: bg, color, border
    };
  };

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px' }}>
        Calendário de Ofensiva
      </h2>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px' }}>
        Mantenha sua sequência diária de leitura
      </p>

      {/* Card do Streak */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent2), #b45309)',
        borderRadius: 18, padding: 18, marginBottom: 14, color: '#fff',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <span className="flicker" style={{ fontSize: 40, display: 'block', marginBottom: 4 }}>🔥</span>
        <p style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1 }}>
          {user?.streak || 0}
        </p>
        <p style={{ fontSize: 13, opacity: .9, margin: 0 }}>dias seguidos</p>
      </div>

      {/* Congeladores */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 12, marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(59,130,246,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
        }}>❄️</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Congeladores de ofensiva</p>
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
            Protegem sua sequência se faltar um dia
          </p>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#3b82f6',
          background: 'rgba(59,130,246,.12)', padding: '4px 10px', borderRadius: 10
        }}>x{user?.streakFreezes || 2}</span>
      </div>

      {/* Calendário */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 14
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12
        }}>
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          >‹</button>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          >›</button>
        </div>

        {/* Dias da semana */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6
        }}>
          {weekdays.map((d, i) => (
            <div key={i} style={{
              textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--muted)'
            }}>{d}</div>
          ))}
        </div>

        {/* Dias */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4
        }}>
          {days.map((day, i) => (
            <div key={i} style={getDayStyle(day)}>
              {frozenDays.includes(day) ? '❄' : day}
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12,
          paddingTop: 10, borderTop: '1px solid var(--border)'
        }}>
          <LegendItem color="var(--accent)" label="Completo" />
          <LegendItem color="var(--accent2)" label="Hoje" />
          <LegendItem color="#3b82f6" label="Congelado" />
          <LegendItem color="var(--border)" label="Pendente" dashed />
        </div>
      </div>

    </div>
  );
}

function LegendItem({ color, label, dashed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 14, height: 14, borderRadius: 4, background: color,
        border: dashed ? `1px dashed ${color}` : 'none'
      }} />
      <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}
