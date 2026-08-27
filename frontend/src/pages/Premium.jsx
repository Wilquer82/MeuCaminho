import { Link } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

const plans = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: 'R$ 14,90',
    period: '/mês',
    features: [
      'Lições ilimitadas por dia',
      'Todos os devocionais exclusivos',
      'Módulo completo de Teologia',
      'Congeladores de ofensiva ilimitados',
      'Modo offline',
      'Sem anúncios'
    ],
    highlighted: false,
    badge: null
  },
  {
    id: 'annual',
    name: 'Anual',
    price: 'R$ 124',
    period: '/ano',
    monthlyEquivalent: 'R$ 10,33/mês',
    features: [
      'Tudo do plano Mensal',
      'Economia de 30%',
      'Acesso antecipado a novas funcionalidades',
      'Suporte prioritário'
    ],
    highlighted: true,
    badge: '-30% POPULAR'
  },
  {
    id: 'lifetime',
    name: 'Vitalício',
    price: 'R$ 299',
    period: 'uma única vez',
    features: [
      'Tudo dos planos anteriores',
      'Pagamento único — sem mensalidades',
      'Todas as futuras atualizações',
      'Acesso para sempre',
      'Suporte VIP vitalício'
    ],
    highlighted: false,
    badge: '🏆 MELHOR VALOR'
  }
];

export default function Premium() {
  const { goToCheckout } = useSubscription();

  return (
    <div style={{ padding: '0 16px 100px' }} className="fade-in">

      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--premium), #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', fontSize: 32, color: '#fff',
          boxShadow: '0 8px 24px rgba(139,92,246,.4)'
        }}>💎</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>
          VerboVivo Premium
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0, maxWidth: 320 }}>
          Leve sua jornada na Palavra para o próximo nível
        </p>
      </div>

      {/* Planos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              background: plan.highlighted
                ? 'linear-gradient(135deg, rgba(139,92,246,.08), rgba(99,102,241,.08))'
                : 'var(--card)',
              border: plan.highlighted
                ? '2px solid var(--premium)'
                : '1px solid var(--border)',
              borderRadius: 18, padding: 20, position: 'relative'
            }}
          >
            {plan.badge && (
              <span style={{
                position: 'absolute', top: -10, right: 16,
                background: plan.highlighted ? 'var(--premium)' : '#fbbf24',
                color: plan.highlighted ? '#fff' : 'var(--text)',
                fontSize: 10, fontWeight: 700, padding: '4px 10px',
                borderRadius: 12, letterSpacing: '.03em'
              }}>{plan.badge}</span>
            )}

            <h3 style={{
              fontSize: 18, fontWeight: 700, margin: '0 0 4px',
              color: plan.highlighted ? 'var(--premium)' : 'var(--text)'
            }}>{plan.name}</h3>

            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{plan.price}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{plan.period}</span>
              {plan.monthlyEquivalent && (
                <p style={{ fontSize: 11, color: 'var(--premium)', margin: '2px 0 0', fontWeight: 600 }}>
                  {plan.monthlyEquivalent}
                </p>
              )}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{
                  fontSize: 13, marginBottom: 6, display: 'flex', gap: 8,
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => goToCheckout(plan.id)}
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: 'none',
                background: plan.highlighted
                  ? 'linear-gradient(135deg, var(--premium), #6366f1)'
                  : 'var(--accent)',
                color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}
            >
              Assinar {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Garantia */}
      <div style={{
        textAlign: 'center', marginTop: 24, padding: '0 10px'
      }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
          🔒 Pagamento seguro via Stripe · Cancele quando quiser
        </p>
        <Link to="/" style={{
          display: 'inline-block', marginTop: 12,
          fontSize: 13, color: 'var(--muted)', textDecoration: 'none'
        }}>
          ← Voltar para o início
        </Link>
      </div>

    </div>
  );
}
