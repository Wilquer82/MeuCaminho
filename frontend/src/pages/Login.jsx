import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
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
          A Palavra Viva — O Duolingo da Bíblia
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
