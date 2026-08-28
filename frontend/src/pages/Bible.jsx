import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Bible() {
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [translation, setTranslation] = useState('almeida');
  const requestedBook = searchParams.get('book');
  const requestedChapter = Number(searchParams.get('chapter')) || 1;
  const [bookId, setBookId] = useState(requestedBook || '');
  const [chapter, setChapter] = useState(requestedChapter);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api.get('/bible/books'), api.get('/bible/translations')])
      .then(([booksResponse, translationsResponse]) => {
        const data = booksResponse.data;
        setTranslations(translationsResponse.data);
        setBooks(data);
        const matchingBook = data.find(book => book.id === requestedBook);
        if (matchingBook) {
          setBookId(matchingBook.id);
          setChapter(Math.min(requestedChapter, matchingBook.chapters));
        } else if (data.length) {
          setBookId(data[0].id);
        }
      })
      .catch(() => setMessage('Não foi possível carregar os livros.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!bookId) return;
    loadChapter(bookId, chapter);
  }, [bookId, chapter, translation]);

  const selectedBook = books.find(book => book.id === bookId);

  async function loadChapter(selectedBookId, selectedChapter) {
    try {
      setLoadingChapter(true);
      setMessage('');
      const { data } = await api.get(`/bible/${selectedBookId}/${selectedChapter}`, { params: { translation } });
      setReading(data);
    } catch {
      setReading(null);
      setMessage('Não foi possível carregar este capítulo.');
    } finally {
      setLoadingChapter(false);
    }
  }

  async function completeReading() {
    if (!reading || reading.completed) return;
    try {
      const { data } = await api.post(`/bible/${bookId}/${chapter}/complete`);
      setReading(previous => ({ ...previous, completed: true }));
      setBooks(previous => previous.map(book => (
        book.id === bookId
          ? { ...book, completedChapters: book.completedChapters + 1 }
          : book
      )));
      updateUser({ xp: data.newXp, streak: data.newStreak });
      setMessage(data.xpEarned ? `+${data.xpEarned} XP ganhos!` : 'Capítulo já concluído.');
    } catch {
      setMessage('Não foi possível registrar a leitura.');
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Carregando Bíblia...</div>;

  return (
    <main style={{ padding: '16px 18px 100px' }} className="fade-in">
      <div style={{ marginBottom: 18 }}>
        <p style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 }}>LEITURA DIÁRIA</p>
        <h1 style={{ fontSize: 24, margin: 0 }}>Bíblia</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Leia um capítulo e ganhe XP ao concluir.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8, marginBottom: 16 }}>
        <select value={bookId} onChange={event => { setBookId(event.target.value); setChapter(1); }} style={fieldStyle}>
          {books.map(book => <option key={book.id} value={book.id}>{book.name}</option>)}
        </select>
        <select value={translation} onChange={event => setTranslation(event.target.value)} style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          {translations.map(version => <option key={version.id} value={version.id}>{version.name} ({version.language})</option>)}
        </select>
        <select value={chapter} onChange={event => setChapter(Number(event.target.value))} style={fieldStyle}>
          {Array.from({ length: selectedBook?.chapters || 1 }, (_, index) => (
            <option key={index + 1} value={index + 1}>Cap. {index + 1}</option>
          ))}
        </select>
      </div>

      {loadingChapter ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Carregando capítulo...</div>
      ) : reading && (
        <>
          <section style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 20, margin: 0 }}>{reading.reference}</h2>
                <span style={{ color: 'var(--muted)', fontSize: 11 }}>{reading.translationName}</span>
              </div>
              <span style={{ color: reading.completed ? 'var(--success)' : 'var(--accent2)', fontSize: 12, fontWeight: 700 }}>
                {reading.completed ? 'CONCLUÍDO' : `+${reading.xpReward} XP`}
              </span>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {reading.verses.map(verse => (
                <p key={verse.verse} style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.65, margin: 0 }}>
                  <sup style={{ color: 'var(--accent)', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, marginRight: 6 }}>{verse.verse}</sup>
                  {verse.text}
                </p>
              ))}
            </div>
          </section>
          <button type="button" onClick={completeReading} disabled={reading.completed} style={{ ...buttonStyle, opacity: reading.completed ? .6 : 1 }}>
            {reading.completed ? 'Leitura concluída' : 'Concluir leitura e ganhar XP'}
          </button>
        </>
      )}

      {message && <p style={{ color: message.startsWith('+') ? 'var(--success)' : 'var(--danger)', fontSize: 13, textAlign: 'center', marginTop: 14 }}>{message}</p>}
    </main>
  );
}

const fieldStyle = {
  width: '100%', padding: '12px 10px', border: '1px solid var(--border)',
  borderRadius: 10, background: 'var(--card)', color: 'var(--text)', fontSize: 13
};

const buttonStyle = {
  width: '100%', border: 0, borderRadius: 10, padding: 14, marginTop: 14,
  background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14
};