import { useSubscription } from '../../context/SubscriptionContext';

export default function PaywallModal({ isOpen, onClose, completedToday, dailyLimit }) {
  const { goToCheckout } = useSubscription();

  if (!isOpen) return null;

  const handleUpgrade = (planType) => {
    goToCheckout(planType);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
        animation: 'fadeIn .2s ease'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bounce-in"
        style={{
          background: '#fff',
          borderRadius: 24,
          maxWidth: 360,
          width: '100%',
          padding: 28,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Badge Premium */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 32, color: '#fff',
          boxShadow: '0 8px 24px rgba(139,92,246,.4)'
        }}>💎</div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
          Limite diário atingido!
        </h2>

        <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
          Você completou <strong style={{ color: 'var(--premium)' }}>{completedToday}/{dailyLimit}</strong> lições hoje.
          Assine o <strong>Meu Caminho de Luz Premium</strong> e continue sem limites!
        </p>

        {/* Benefícios */}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          {[
            '✓ Lições ilimitadas por dia',
            '✓ Todos os devocionais exclusivos',
            '✓ Download para ler offline',
            '✓ Módulo completo de Teologia',
            '✓ Sem anúncios',
            '✓ Congeladores de ofensiva ilimitados'
          ].map((item, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--text)', margin: '6px 0' }}>{item}</p>
          ))}
        </div>

        {/* Planos */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => handleUpgrade('monthly')}
            style={{
              flex: 1, padding: '14px 8px', borderRadius: 12, border: '2px solid var(--premium)',
              background: '#fff', color: 'var(--premium)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Mensal<br/>
            <span style={{ fontSize: 16 }}>R$ 14,90</span>
          </button>

          <button
            onClick={() => handleUpgrade('annual')}
            style={{
              flex: 1, padding: '14px 8px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              position: 'relative'
            }}
          >
            <span style={{
              position: 'absolute', top: -8, right: 8, background: '#fbbf24',
              color: 'var(--text)', fontSize: 9, fontWeight: 700, padding: '2px 8px',
              borderRadius: 10
            }}>-30%</span>
            Anual<br/>
            <span style={{ fontSize: 16 }}>R$ 124/ano</span>
          </button>
        </div>

        <button
          onClick={() => handleUpgrade('lifetime')}
          style={{
            width: '100%', padding: 12, borderRadius: 12, border: '1px dashed var(--premium)',
            background: 'var(--premium-soft)', color: 'var(--premium)', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', marginBottom: 12
          }}
        >
          🏆 Vitalício — R$ 299 (uma única vez)
        </button>

        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            fontSize: 13, cursor: 'pointer', padding: 8
          }}
        >
          Talvez depois
        </button>
      </div>
    </div>
  );
}
