import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallData, setPaywallData] = useState({ completedToday: 3, dailyLimit: 3 });
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    plan: 'free',
    isPremium: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/subscription/status')
        .then(({ data }) => setSubscriptionStatus(data))
        .catch(() => {});
    }
  }, [isAuthenticated, user?.plan]);

  const triggerPaywall = (data) => {
    setPaywallData(data || { completedToday: 3, dailyLimit: 3 });
    setShowPaywall(true);
  };

  const goToCheckout = async (planType) => {
    try {
      const { data } = await api.post('/subscription/checkout', { planType });
      window.location.href = data.url;
    } catch (err) {
      console.error('Erro no checkout:', err);
      alert('Erro ao abrir checkout. Tente novamente.');
    }
  };

  const cancelSubscription = async () => {
    if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      await api.post('/subscription/cancel');
      setSubscriptionStatus({ plan: 'free', isPremium: false });
      alert('Assinatura cancelada com sucesso.');
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      showPaywall,
      setShowPaywall,
      paywallData,
      triggerPaywall,
      goToCheckout,
      cancelSubscription,
      subscriptionStatus,
      isPremium: subscriptionStatus.isPremium || user?.plan === 'premium' || user?.plan === 'lifetime'
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
