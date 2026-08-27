import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
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

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: 'var(--muted)', fontSize: 13, marginBottom: 16
        }}>
          ← Voltar
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>Criar conta</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Comece sua jornada na Palavra hoje
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 24
      }}>
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
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Seu nome"
            required
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 14, boxSizing: 'border-box'
            }}
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
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
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </div>
  );
}
