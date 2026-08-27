// Utilitários para compartilhamento social
const gerarTextoCompartilhamento = ({ type, data }) => {
  switch (type) {
    case 'devotional':
      return `"${data.bibleText}"\n— ${data.bibleReference}\n\n${data.title}\n\nCompartilhado do VerboVivo 📖✨`;

    case 'lesson':
      return `📖 Completei a lição "${data.title}" no VerboVivo!\n+${data.xp} XP ganhos 🔥\n#VerboVivo #Bíblia #Fé`;

    case 'streak':
      return `🔥 ${data.days} dias seguidos lendo a Bíblia!\nEstou no VerboVivo, o Duolingo da Palavra. Vem comigo! 📖✨\n#VerboVivo #Streak #FéDiária`;

    case 'mission':
      return `🏆 Conquistei a missão "${data.title}" no VerboVivo!\n+${data.xp} XP ganhos\n#VerboVivo #MissãoCompleta`;

    default:
      return 'Estou usando o VerboVivo! 📖✨\nO Duolingo da Palavra de Deus.';
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
    email: `mailto:?subject=VerboVivo&body=${encodedText}%0A%0A${encodedUrl}`
  };
};

module.exports = { gerarTextoCompartilhamento, gerarLinksCompartilhamento };
