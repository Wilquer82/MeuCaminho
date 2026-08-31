import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useSubscription } from './context/SubscriptionContext';

// Layout
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';

// Páginas
import Home from './pages/Home';
import StreakCalendar from './pages/StreakCalendar';
import Categories from './pages/Categories';
import Review from './pages/Review';
import Curiosities from './pages/Curiosities';
import Theology from './pages/Theology';
import Missions from './pages/Missions';
import Community from './pages/Community';
import Videos from './pages/Videos';
import AdditionalContent from './pages/AdditionalContent';
import AdditionalContentDetail from './pages/AdditionalContentDetail';
import Devotional from './pages/Devotional';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Premium from './pages/Premium';
import Bible from './pages/Bible';

// Componentes
import PaywallModal from './components/Home/PaywallModal';
import InstallPwaPrompt from './components/UI/InstallPwaPrompt';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { showPaywall, setShowPaywall, paywallData } = useSubscription();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleUpdateAvailable = () => setIsUpdating(true);
    const handleControllerChange = () => {
      setIsUpdating(false);
      window.location.reload();
    };

    window.addEventListener('app-sw-update-available', handleUpdateAvailable);
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setIsUpdating(true);
      }
    }).catch(() => {});

    return () => {
      window.removeEventListener('app-sw-update-available', handleUpdateAvailable);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const applyServiceWorkerUpdate = async () => {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration || !registration.waiting) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      margin: 0,
      background: 'var(--bg)',
      position: 'relative',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))'
    }}>
      {isUpdating && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 14, 22, 0.78)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '18px 20px',
            textAlign: 'center',
            maxWidth: 260,
            width: '80%'
          }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '3px solid rgba(124, 58, 237, 0.2)',
              borderTopColor: 'var(--accent)',
              margin: '0 auto 12px',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Atualizando app...</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Sincronizando a versão mais recente.
            </p>
            <button
              type="button"
              onClick={applyServiceWorkerUpdate}
              style={{
                marginTop: 14,
                width: '100%',
                border: 'none',
                borderRadius: 10,
                padding: '10px 12px',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Atualizar agora
            </button>
          </div>
        </div>
      )}

      {user && <Header />}

      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protegidas */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/streak" element={<PrivateRoute><StreakCalendar /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
        <Route path="/review" element={<PrivateRoute><Review /></PrivateRoute>} />
        <Route path="/curiosities" element={<PrivateRoute><Curiosities /></PrivateRoute>} />
        <Route path="/theology" element={<PrivateRoute><Theology /></PrivateRoute>} />
        <Route path="/missions" element={<PrivateRoute><Missions /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="/videos" element={<PrivateRoute><Videos /></PrivateRoute>} />
        <Route path="/extras" element={<PrivateRoute><AdditionalContent /></PrivateRoute>} />
        <Route path="/extras/:module" element={<PrivateRoute><AdditionalContentDetail /></PrivateRoute>} />
        <Route path="/devotional" element={<PrivateRoute><Devotional /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/premium" element={<PrivateRoute><Premium /></PrivateRoute>} />
        <Route path="/bible" element={<PrivateRoute><Bible /></PrivateRoute>} />

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>

      {user && <BottomNav />}

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        completedToday={paywallData.completedToday}
        dailyLimit={paywallData.dailyLimit}
      />

      {user && <InstallPwaPrompt />}
    </div>
  );
}
