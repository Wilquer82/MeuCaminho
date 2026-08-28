import { useState } from 'react';
import api from '../services/api';

export default function About() {
  const [form, setForm] = useState({
    rating: 5,
    category: 'geral',
    message: '',
    featureRequest: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/feedback', form);
      setSubmitted(true);
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        maxWidth: 420, margin: '0 auto', padding: 60, textAlign: 'center'
      }} className="fade-in">
        <div style={{ fontSize: 60, marginBottom: 20 }}>🙏</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '10px 0' }}>Obrigado!</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Seu feedback foi enviado diretamente para o desenvolvedor.
          Lemos cada mensagem pessoalmente!
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px 100px', maxWidth: 420, margin: '0 auto' }} className="fade-in">

      {/* Sobre o app */}
      <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, var(--accent), #1a5c20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', fontSize: 36, color: '#fff'
        }}>📖</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Meu Caminho de Luz</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Versão 1.0.0</p>
      </div>

      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 18, marginBottom: 20
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>Sobre o app</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#334155', margin: 0 }}>
          O <strong>Meu Caminho de Luz</strong> é um aplicativo gamificado de leitura bíblica,
          inspirado na metodologia do Duolingo. Nossa missão é tornar a leitura da
          Palavra de Deus um hábito diário prazeroso e consistente.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#334155', margin: '12px 0 0' }}>
          Com planos de leitura estruturados, sistema de XP e conquistas,
          missões em dupla, vídeos do BibleProject, módulo de Teologia Básica
          e dicas de hebraico, queremos ajudar você a crescer na fé a cada dia.
        </p>
      </div>

      {/* Fontes */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 18, marginBottom: 20
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>📚 Fontes e referências</h2>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={{ fontSize: 13, marginBottom: 6 }}>
            <strong>BibleProject</strong> — Vídeos educacionais (bibleproject.com)
          </li>
          <li style={{ fontSize: 13, marginBottom: 6 }}>
            <strong>Bíblia NVI</strong> — Nova Versão Internacional
          </li>
          <li style={{ fontSize: 13, marginBottom: 6 }}>
            <strong>Credos históricos</strong> — Apostólico, Niceia, Calcedônia
          </li>
          <li style={{ fontSize: 13, marginBottom: 6 }}>
            <strong>Confissão de Westminster</strong> — Domínio público
          </li>
          <li style={{ fontSize: 13 }}>
            <strong>Got Questions</strong> — Artigos apologéticos
          </li>
        </ul>
      </div>

      {/* Contato Dev */}
      <div style={{
        background: 'linear-gradient(135deg, var(--premium), #6366f1)',
        borderRadius: 16, padding: 18, marginBottom: 20, color: '#fff'
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>💌 Fale com o desenvolvedor</h2>
        <p style={{ fontSize: 13, opacity: .9, margin: '0 0 12px', lineHeight: 1.5 }}>
          Tem sugestões, encontrou um bug ou quer apenas dizer olá?
          Sua opinião faz toda a diferença!
        </p>
        <a href="mailto:verbovivo.app@gmail.com" style={{
          display: 'inline-block', padding: '10px 20px', borderRadius: 10,
          background: '#fff', color: 'var(--premium)', textDecoration: 'none',
          fontSize: 13, fontWeight: 700
        }}>📧 fox.tail.cons@gmail.com</a>
      </div>

      {/* Pesquisa de Satisfação */}
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>📊 Pesquisa de satisfação</h2>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 18
      }}>

        {/* Estrelas */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Como você avalia o Meu Caminho de Luz?
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                style={{
                  fontSize: 28, border: 'none', background: 'none', cursor: 'pointer',
                  color: star <= form.rating ? '#fbbf24' : '#cbd5e1',
                  padding: '0 4px'
                }}
              >★</button>
            ))}
          </div>
        </div>

        {/* Categoria */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Categoria
          </label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 14, fontFamily: 'inherit'
            }}
          >
            <option value="geral">Geral</option>
            <option value="bug">Relatar um bug 🐛</option>
            <option value="sugestao">Sugestão de recurso 💡</option>
            <option value="conteudo">Sobre o conteúdo bíblico 📖</option>
            <option value="monetizacao">Sobre a assinatura Premium 💎</option>
            <option value="elogio">Elogio / Agradecimento 🙏</option>
          </select>
        </div>

        {/* Mensagem */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Sua mensagem
          </label>
          <textarea
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            placeholder="Conte-nos o que você acha..."
            rows={4}
            required
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Sugestão de feature */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Que funcionalidade você gostaria de ver? (opcional)
          </label>
          <input
            type="text"
            value={form.featureRequest}
            onChange={e => setForm({ ...form, featureRequest: e.target.value })}
            placeholder="Ex: Notificações push, áudio das lições..."
            style={{
              width: '100%', padding: 12, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 700,
            cursor: sending ? 'not-allowed' : 'pointer',
            opacity: sending ? .6 : 1
          }}
        >
          {sending ? 'Enviando...' : '📤 Enviar feedback'}
        </button>
      </form>

      {/* Rodapé */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <p style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0' }}>
          Termos de Uso · Política de Privacidade
        </p>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
          © 2026 Meu Caminho de Luz · Feito com ❤️ para a glória de Deus
        </p>
      </div>

    </div>
  );
}
