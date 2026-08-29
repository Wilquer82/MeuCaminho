import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CACHE_KEY = 'meucaminho_bible_cache';
const VERSION_CACHE_KEY = 'meucaminho_bible_version_cache';

function getCachedChapterCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getVersionCache() {
  try {
    return JSON.parse(localStorage.getItem(VERSION_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setCachedChapterCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function setVersionCache(cache) {
  localStorage.setItem(VERSION_CACHE_KEY, JSON.stringify(cache));
}

function normalizeChapterData(bookName, selectedBookId, selectedChapter, translation, payload) {
  const chapterData = payload?.data || payload || {};
  const verseList = Array.isArray(chapterData.verses) ? chapterData.verses : [];
  return {
    book: bookName,
    bookId: selectedBookId,
    chapter: selectedChapter,
    reference: `${bookName} ${selectedChapter}`,
    verses: verseList.map((text, index) => ({
      verse: Number(chapterData.verse || 1) + index,
      text
    })),
    translation,
    translationName: translation.toUpperCase(),
    completed: false,
    xpReward: 10,
    storedAt: new Date().toISOString()
  };
}

export default function Bible() {
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [translation, setTranslation] = useState(() => localStorage.getItem('bibleTranslation') || 'nvi');
  const requestedBook = searchParams.get('book');
  const requestedChapter = Number(searchParams.get('chapter')) || 1;
  const [bookId, setBookId] = useState(requestedBook || '');
  const [chapter, setChapter] = useState(requestedChapter);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [message, setMessage] = useState('');
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [versionOfflineSaved, setVersionOfflineSaved] = useState(false);
  const [savingVersion, setSavingVersion] = useState(false);

  async function loadPublicBooks() {
    const response = await fetch('https://api.midvash.com/v1/books');
    const { data } = await response.json();
    return data.map(book => ({
      id: book.slug.en,
      name: book.name['pt-br'],
      chapters: book.chapters,
      completedChapters: 0
    }));
  }

  async function loadPublicTranslations() {
    const response = await fetch('https://api.midvash.com/v1/versions?language=pt-br');
    const { data } = await response.json();
    return data.map(version => ({ id: version.slug, name: version.name, language: version.language }));
  }

  useEffect(() => {
    localStorage.setItem('bibleTranslation', translation);
  }, [translation]);

  useEffect(() => {
    Promise.all([
      api.get('/bible/books').then(response => response.data).catch(loadPublicBooks),
      api.get('/bible/translations').then(response => response.data).catch(loadPublicTranslations)
    ])
      .then(([data, versionData]) => {
        setTranslations(versionData);
        setBooks(data);
        const matchingBook = data.find(book => book.id === requestedBook);
        if (matchingBook) {
          setBookId(matchingBook.id);
          setChapter(Math.min(requestedChapter, matchingBook.chapters));
        } else if (data.length) {
          setBookId(data[0].id);
        }
      })
      .catch(() => setMessage('Não foi possível carregar os livros agora.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!bookId) return;
    loadChapter(bookId, chapter);
  }, [bookId, chapter, translation]);

  useEffect(() => {
    const cache = getCachedChapterCache();
    const chapterKey = `${translation}:${bookId}:${chapter}`;
    setOfflineSaved(Boolean(cache[chapterKey]));

    const versionCache = getVersionCache();
    const hasSavedVersion = Boolean(versionCache[translation] && Object.keys(versionCache[translation].books || {}).length > 0);
    setVersionOfflineSaved(hasSavedVersion);
  }, [translation, bookId, chapter]);

  const selectedBook = books.find(book => book.id === bookId);

  async function loadChapter(selectedBookId, selectedChapter) {
    try {
      setLoadingChapter(true);
      setMessage('');

      const versionCache = getVersionCache();
      const offlineVersionChapter = versionCache[translation]?.books?.[selectedBookId]?.[selectedChapter];
      if (offlineVersionChapter) {
        setReading(offlineVersionChapter);
        setLoadingChapter(false);
        return;
      }

      let data;
      try {
        ({ data } = await api.get(`/bible/${selectedBookId}/${selectedChapter}`, { params: { translation } }));
      } catch (error) {
        const response = await fetch(`https://api.midvash.com/v1/${translation}/${selectedBookId}/${selectedChapter}`);
        const payload = await response.json();
        if (!response.ok) throw error;
        data = normalizeChapterData(selectedBook?.name || selectedBookId, selectedBookId, selectedChapter, translation, payload);
      }
      setReading(data);
    } catch {
      const versionCache = getVersionCache();
      const offlineFallback = versionCache[translation]?.books?.[bookId]?.[chapter];
      if (offlineFallback) {
        setReading(offlineFallback);
        setMessage('Carregando capítulo salvo localmente.');
      } else {
        setReading(null);
        setMessage('Não foi possível carregar este capítulo.');
      }
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

  function saveCurrentChapterOffline() {
    if (!reading) return;
    const cache = getCachedChapterCache();
    const chapterKey = `${translation}:${bookId}:${chapter}`;
    cache[chapterKey] = {
      ...reading,
      storedAt: new Date().toISOString()
    };
    setCachedChapterCache(cache);
    setOfflineSaved(true);
    setMessage('Capítulo salvo para leitura offline.');
  }

  function removeCurrentChapterOffline() {
    const cache = getCachedChapterCache();
    const chapterKey = `${translation}:${bookId}:${chapter}`;
    delete cache[chapterKey];
    setCachedChapterCache(cache);
    setOfflineSaved(false);
    setMessage('Capítulo removido do cache offline.');
  }

  async function saveFullTranslationOffline() {
    if (!books.length || savingVersion) return;

    setSavingVersion(true);
    setMessage('Salvando versão da Bíblia para uso offline...');

    try {
      const versionCache = getVersionCache();
      const fullVersion = { savedAt: new Date().toISOString(), books: {} };

      for (const book of books) {
        fullVersion.books[book.id] = {};

        for (let chapterNumber = 1; chapterNumber <= book.chapters; chapterNumber += 1) {
          try {
            const response = await api.get(`/bible/${book.id}/${chapterNumber}`, { params: { translation } });
            fullVersion.books[book.id][chapterNumber] = {
              ...response.data,
              storedAt: new Date().toISOString()
            };
          } catch {
            try {
              const fallbackResponse = await fetch(`https://api.midvash.com/v1/${translation}/${book.id}/${chapterNumber}`);
              const payload = await fallbackResponse.json();
              if (fallbackResponse.ok) {
                fullVersion.books[book.id][chapterNumber] = normalizeChapterData(book.name, book.id, chapterNumber, translation, payload);
              }
            } catch {
              // Ignora capítulos indisponíveis para manter o restante da versão salva.
            }
          }
        }
      }

      versionCache[translation] = fullVersion;
      setVersionCache(versionCache);
      setVersionOfflineSaved(true);
      setMessage(`Versão ${translation.toUpperCase()} salva para acesso offline.`);
    } finally {
      setSavingVersion(false);
    }
  }

  function removeFullTranslationOffline() {
    const versionCache = getVersionCache();
    delete versionCache[translation];
    setVersionCache(versionCache);
    setVersionOfflineSaved(false);
    setMessage(`Versão ${translation.toUpperCase()} removida do cache offline.`);
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

      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={versionOfflineSaved ? removeFullTranslationOffline : saveFullTranslationOffline}
          disabled={savingVersion}
          style={{
            ...buttonStyle,
            marginTop: 0,
            background: versionOfflineSaved ? '#6b7280' : '#0f766e',
            opacity: savingVersion ? 0.7 : 1
          }}
        >
          {savingVersion ? 'Salvando versão...' : versionOfflineSaved ? 'Remover versão offline' : 'Salvar versão completa offline'}
        </button>
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
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="button" onClick={completeReading} disabled={reading.completed} style={{ ...buttonStyle, flex: 1, opacity: reading.completed ? .6 : 1 }}>
              {reading.completed ? 'Leitura concluída' : 'Concluir leitura e ganhar XP'}
            </button>
            <button type="button" onClick={offlineSaved ? removeCurrentChapterOffline : saveCurrentChapterOffline} style={{ ...buttonStyle, flex: 1, background: offlineSaved ? '#6b7280' : '#1d7b38' }}>
              {offlineSaved ? 'Remover offline' : 'Salvar offline'}
            </button>
          </div>
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