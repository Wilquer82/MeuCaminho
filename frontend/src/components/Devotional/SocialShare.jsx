export default function SocialShare({ devotional, lesson, xp, streak }) {

  const buildShareText = () => {
    if (devotional) {
      return `"${devotional.bibleText}"\n— ${devotional.bibleReference}\n\n${devotional.title}\n\nCompartilhado do Meu Caminho de Luz 📖✨`;
    }
    if (lesson) {
      return `📖 Completei a lição "${lesson.title}" no Meu Caminho de Luz!\n+${xp} XP ganhos 🔥\n#MeuCaminhoDeLuz #Bíblia #Fé`;
    }
    if (streak) {
      return `🔥 ${streak} dias seguidos lendo a Bíblia!\nEstou no Meu Caminho de Luz, o Duolingo da Palavra. Vem comigo! 📖✨\n#MeuCaminhoDeLuz #Streak #FéDiária`;
    }
    return 'Estou usando o Meu Caminho de Luz! 📖✨';
  };

  const text = encodeURIComponent(buildShareText());
  const url = encodeURIComponent('https://verbovivo.app');

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      alert('Texto copiado! Agora cole no Instagram Stories 📋');
    } catch (err) {
      console.error(err);
      alert('Não foi possível copiar. Copie manualmente:\n\n' + buildShareText());
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: devotional?.title || lesson?.title || 'Meu Caminho de Luz',
          text: buildShareText(),
          url: 'https://verbovivo.app'
        });
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 16
    }}>
      <p style={{
        fontSize: 13, fontWeight: 700, color: 'var(--text)',
        margin: '0 0 12px', textAlign: 'center'
      }}>
        📤 Compartilhar
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 4
          }}>💬</div>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: '#1877F2', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, marginBottom: 4
          }}>f</div>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>Facebook</span>
        </a>

        {/* Instagram (copia texto) */}
        <button
          onClick={handleCopy}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            textAlign: 'center', padding: 0, fontFamily: 'inherit'
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 4
          }}>📸</div>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>Instagram</span>
        </button>

        {/* Twitter/X */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: '#000', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, marginBottom: 4
          }}>𝕏</div>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>Twitter</span>
        </a>

        {/* Native Share (se disponível) */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'center', padding: 0, fontFamily: 'inherit'
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--muted)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 4
            }}>⋮</div>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>Mais</span>
          </button>
        )}

      </div>
    </div>
  );
}
