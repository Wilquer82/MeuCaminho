import { useEffect, useState } from 'react';

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsStandalone(standalone);
      
      if (!standalone) {
        const dismissed = localStorage.getItem('pwaPromptDismissed');
        if (dismissed) {
          const dismissedTime = parseInt(dismissed, 10);
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - dismissedTime < sevenDaysMs) {
            setVisible(false);
            return;
          }
          localStorage.removeItem('pwaPromptDismissed');
        }
        setVisible(true);
      }
    };

    checkStandalone();

    const handler = event => {
      event.preventDefault();
      setDeferredPrompt(event);
      const dismissed = localStorage.getItem('pwaPromptDismissed');
      if (!dismissed) setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.matchMedia('(display-mode: standalone)').addEventListener?.('change', checkStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.matchMedia('(display-mode: standalone)').removeEventListener?.('change', checkStandalone);
    };
  }, []);

  if (isStandalone || !visible) return null;

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setVisible(false);
      setDeferredPrompt(null);
      return;
    }

    const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const msg = isApple
      ? 'No Safari, use o botão de Compartilhar e escolha “Adicionar à Tela de Início”.'
      : 'No navegador, use o menu de opções e escolha “Instalar app” ou “Adicionar à tela inicial”.';

    alert(msg);
  };
  const dismiss = () => {
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
    setVisible(false);
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
        <div style={{ fontWeight: 700, fontSize: 13 }}>Atalho do app não criado</div>
        <div style={{ fontSize: 11, opacity: 0.9 }}>Instale para entrar mais rápido no celular.</div>
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
          fontWeight: 700,
          fontSize: 12,
          cursor: 'pointer'
        }}
      >
        Instalar
      </button>
      <button
        type="button"
        onClick={dismiss}
        style={{
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '6px 10px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 32,
          minHeight: 32
        }}
      >
        ✕
      </button>
    </div>
  );
}
