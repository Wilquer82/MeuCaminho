import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import api from '../services/api';
import XPProgress from '../components/Home/XPProgress';
import StreakCounter from '../components/Home/StreakCounter';
import DailyLessonCard from '../components/Home/DailyLessonCard';
import DailyMissionBoard from '../components/Home/DailyMissionBoard';
import MissionSelectionModal from '../components/UI/MissionSelectionModal';
import DailyReminder from '../components/Home/DailyReminder';

export default function Home() {
  const { user, updateUser } = useAuth();
  const { triggerPaywall } = useSubscription();
  const [todayLesson, setTodayLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [showMissionModal, setShowMissionModal] = useState(false);

  useEffect(() => {
    loadTodayLesson();

    const refreshLesson = () => {
      if (!document.hidden) {
        loadTodayLesson();
      }
    };

    window.addEventListener('focus', refreshLesson);
    document.addEventListener('visibilitychange', refreshLesson);

    return () => {
      window.removeEventListener('focus', refreshLesson);
      document.removeEventListener('visibilitychange', refreshLesson);
    };
  }, [user?._id]);

  useEffect(() => {
    if (user?.firstAccess) {
      setShowMissionModal(true);
      return;
    }

    setShowMissionModal(false);
  }, [user?._id, user?.firstAccess]);

  const loadTodayLesson = async () => {
    try {
      setLoadingLesson(true);
      const { data } = await api.get('/lessons/today');
      setTodayLesson(data);
    } catch (err) {
      if (err.response?.status === 402) {
        triggerPaywall(err.response.data.data);
      }
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleStartLesson = async () => {
    try {
      const { data } = await api.post(`/lessons/${todayLesson._id}/complete`);
      updateUser({
        xp: data.newXp,
        streak: data.newStreak,
        dailyLessonsCompleted: data.dailyLessonsCompleted
      });
      alert(`🎉 Lição completada!\n+${data.xpEarned} XP ganhos`);
      loadTodayLesson();
    } catch (err) {
      if (err.response?.status === 402) {
        triggerPaywall(err.response.data.data);
      }
    }
  };

  const handleMissionSelection = async (plan) => {
    try {
      await api.patch('/auth/me', {
        selectedMissionPlan: plan,
        firstAccess: false
      });
      updateUser({ selectedMissionPlan: plan, firstAccess: false });
      setShowMissionModal(false);
    } catch (err) {
      console.error('Erro ao salvar missão:', err);
    }
  };

  const handleCloseMissionModal = async () => {
    if (!user?.firstAccess) {
      setShowMissionModal(false);
      return;
    }

    try {
      await api.patch('/auth/me', { firstAccess: false });
      updateUser({ firstAccess: false });
    } catch (err) {
      console.error('Erro ao fechar modal de missão:', err);
    } finally {
      setShowMissionModal(false);
    }
  };

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  
  const hasCompletedDaily = user.dailyLessonsCompleted?.count > 0 
    && new Date(user.dailyLessonsCompleted.date).toDateString() === new Date().toDateString();

  return (
    <div style={{ padding: '0 18px 100px' }} className="fade-in">

      {/* Modal de seleção de missão (primeira visita) */}
      <MissionSelectionModal
        isOpen={showMissionModal}
        onSelect={handleMissionSelection}
        onClose={handleCloseMissionModal}
      />

      {/* Saudação + Streak */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, marginTop: 16
      }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Shalom, 👋</p>
          <h2 style={{ fontSize: 19, fontWeight: 700, margin: '2px 0 0' }}>{firstName}</h2>
        </div>
        <StreakCounter streak={user.streak || 0} />
      </div>

      {/* XP + Nível */}
      <XPProgress xp={user.xp || 0} level={user.level || 1} />

      {/* Quadro de Missão Diária */}
      <DailyMissionBoard />

      {/* Alerta de Fim de Dia */}
      <DailyReminder hasCompletedDaily={hasCompletedDaily} />

      {/* Lição de hoje */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Lição de hoje</h3>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {todayLesson?.reference || ''}
          </span>
        </div>
        <DailyLessonCard
          lesson={todayLesson}
          onStart={handleStartLesson}
          loading={loadingLesson}
        />
      </div>

      {/* Ações rápidas */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 8, marginBottom: 14
      }}>
        <QuickAction to="/streak" icon="📅" label="Ofensiva" color="var(--accent2-soft)" />
        <QuickAction to="/categories" icon="📚" label="Categorias" color="var(--accent-soft)" />
        <QuickAction to="/bible" icon="📖" label="Bíblia" color="var(--accent2-soft)" />
        <QuickAction to="/review" icon="🔄" label="Revisar" color="var(--premium-soft)" />
        <QuickAction to="/extras" icon="✨" label="Extras" color="var(--accent2-soft)" />
      </div>

      {/* Missão mensal */}
      <Link to="/bible?book=psalms&chapter=1" style={{ textDecoration: 'none' }}>
        <div className="card-tap" style={{
          background: 'linear-gradient(135deg,var(--premium),#5b21b6)',
          borderRadius: 16, padding: 14, marginBottom: 14, color: '#fff',
          cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: 'rgba(255,255,255,.2)', padding: '3px 10px', borderRadius: 10
            }}>MISSÃO MENSAL</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>
            Ler 8 capítulos dos Salmos
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              flex: 1, height: 6, background: 'rgba(255,255,255,.2)', borderRadius: 3, overflow: 'hidden'
            }}>
              <div style={{ height: '100%', width: '62%', background: '#fbbf24', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600 }}>5/8</span>
          </div>
          <p style={{ fontSize: 10, opacity: .8, margin: '6px 0 0' }}>
            Recompensa: Medalha + 100 XP
          </p>
        </div>
      </Link>

      {/* Missão em dupla */}
      <Link to="/community" style={{ textDecoration: 'none' }}>
        <div className="card-tap" style={{
          background: 'var(--card)', border: '1px solid var(--accent2)',
          borderRadius: 16, padding: 14, cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'var(--accent2-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 20
            }}>👥</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Missão em dupla</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0' }}>
                Convide um amigo e ganhem XP extra!
              </p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, color: 'var(--accent2)',
              background: 'var(--accent2-soft)', padding: '4px 10px', borderRadius: 12
            }}>+50 XP</span>
          </div>
        </div>
      </Link>

      {/* Versão de teste */}
      <div className="card-tap" style={{
        borderRadius: 16, padding: 16, marginTop: 14, color: '#fff',
        cursor: 'default', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.9), rgba(34, 197, 94, 0.8))'
      }}>
        <p style={{ fontSize: 11, opacity: .9, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.1em' }}>
          Versão de Teste
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
          Explore a jornada com leitura, revisão e conteúdo em evolução.
        </p>
      </div>

    </div>
  );
}

function QuickAction({ to, icon, label, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="card-tap" style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '10px 6px', textAlign: 'center',
        cursor: 'pointer'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 6px', fontSize: 16
        }}>{icon}</div>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      </div>
    </Link>
  );
}
