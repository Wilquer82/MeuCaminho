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

// Rota protegida
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { showPaywall, setShowPaywall, paywallData } = useSubscription();
  const { user } = useAuth();

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100vh',
      background: 'var(--bg)',
      position: 'relative',
      boxShadow: '0 0 40px rgba(0,0,0,.06)'
    }}>
      {user && <Header />}

      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        <Route path="/devotional" element={<PrivateRoute><Devotional /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/premium" element={<PrivateRoute><Premium /></PrivateRoute>} />
        <Route path="/bible" element={<PrivateRoute><Bible /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
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
