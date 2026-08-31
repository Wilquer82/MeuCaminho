import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getStoredPreference = (key) => {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? 'false';
  } catch {
    return 'false';
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(() => getStoredPreference('rememberDevice') === 'true');
  const [offlineMode, setOfflineMode] = useState(() => getStoredPreference('offlineMode') === 'true');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submitLockRef = useRef(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem('rememberDevice', String(rememberDevice));
      sessionStorage.setItem('rememberDevice', String(rememberDevice));
    } catch {
      // Ignora falta de armazenamento.
    }
  }, [rememberDevice]);

  useEffect(() => {
    try {
      localStorage.setItem('offlineMode', String(offlineMode));
      sessionStorage.setItem('offlineMode', String(offlineMode));
    } catch {
      // Ignora falta de armazenamento.
    }
  }, [offlineMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || submitLockRef.current) return;

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setError('');
    setLoading(true);
    submitLockRef.current = true;

    try {
      await login(normalizedEmail, password, rememberDevice, offlineMode);
      navigate('/', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || '';

      if (status === 401 && /e-mail ou senha inválidos|senha inválida|usuário não encontrado|user not found/i.test(message)) {
        setError('Usuário não encontrado ou senha inválida.');
      } else if (status === 404) {
        setError('Usuário não encontrado.');
      } else if (status === 401) {
        setError('Senha inválida.');
      } else if (!err.response) {
        setError('Backend indisponível. Tente novamente em alguns instantes.');
      } else {
        setError(message || 'Erro ao entrar');
      }
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 24,
      maxWidth: 400,
      margin: '0 auto'
    }} className="fade-in">

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, var(--accent), #1a5c20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 40, color: '#fff'
        }}>📖</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Meu Caminho de Luz</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
          A Palavra Viva
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 24
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', textAlign: 'center' }}>
          Entrar
        </h2>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,.1)',
            border: '1px solid rgba(220,38,38,.3)',
            color: 'var(--danger)',
            padding: 10, borderRadius: 10,
            fontSize: 13, marginBottom: 14, textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="voce@email.com"
            required
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 14, boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 14, boxSizing: 'border-box'
            }}
          />
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
          fontSize: 13,
          color: 'var(--muted)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
          />
          Não pedir login neste dispositivo
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          fontSize: 13,
          color: 'var(--muted)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={offlineMode}
            onChange={(e) => setOfflineMode(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
          />
          Usar o app em modo offline
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: 'var(--accent)', color: '#fff',
            fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? .6 : 1
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{
          textAlign: 'center', fontSize: 13, color: 'var(--muted)',
          marginTop: 16, marginBottom: 0
        }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Cadastre-se
          </Link>
        </p>
      </form>

      <p style={{
        textAlign: 'center', fontSize: 11, color: 'var(--muted)',
        marginTop: 20
      }}>
        Ao entrar, você concorda com os Termos de Uso e Política de Privacidade.
      </p>
    </div>
  );
}
