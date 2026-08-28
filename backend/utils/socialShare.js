// Utilitários para compartilhamento social
const gerarTextoCompartilhamento = ({ type, data }) => {
  switch (type) {
    case 'devotional':
      return `"${data.bibleText}"\n— ${data.bibleReference}\n\n${data.title}\n\nCompartilhado do Meu Caminho de Luz 📖✨`;

    case 'lesson':
      return `📖 Completei a lição "${data.title}" no Meu Caminho de Luz!\n+${data.xp} XP ganhos 🔥\n#MeuCaminhoDeLuz #Bíblia #Fé`;

    case 'streak':
      return `🔥 ${data.days} dias seguidos lendo a Bíblia!\nEstou no Meu Caminho de Luz, o Duolingo da Palavra. Vem comigo! 📖✨\n#MeuCaminhoDeLuz #Streak #FéDiária`;

    case 'mission':
      return `🏆 Conquistei a missão "${data.title}" no Meu Caminho de Luz!\n+${data.xp} XP ganhos\n#MeuCaminhoDeLuz #MissãoCompleta`;

    default:
      return 'Estou usando o Meu Caminho de Luz! 📖✨\nO Duolingo da Palavra de Deus.';
  }
};

const gerarLinksCompartilhamento = (texto, url = 'https://verbovivo.app') => {
  const encodedText = encodeURIComponent(texto);
  const encodedUrl = encodeURIComponent(url);

  return {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    email: `mailto:?subject=Meu Caminho de Luz&body=${encodedText}%0A%0A${encodedUrl}`
  };
};

module.exports = { gerarTextoCompartilhamento, gerarLinksCompartilhamento };
