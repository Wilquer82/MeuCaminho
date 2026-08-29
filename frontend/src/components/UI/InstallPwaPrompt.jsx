import { useEffect, useState } from 'react';

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = event => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  };

  return (
    <div style={{
      position: 'fixed',
      left: 12,
      right: 12,
      bottom: 72,
      zIndex: 30,
      background: 'linear-gradient(135deg, #1f7a2d, #2b8a3d)',
      color: '#fff',
      borderRadius: 14,
      padding: '12px 14px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>Instalar app</div>
        <div style={{ fontSize: 11, opacity: 0.9 }}>Acesse mais rápido no celular.</div>
      </div>
      <button
        type="button"
        onClick={install}
        style={{
          background: '#fff',
          color: '#1f7a2d',
          border: 'none',
          borderRadius: 8,
          padding: '8px 12px',
          fontWeight: 700
        }}
      >
        Instalar
      </button>
    </div>
  );
}
