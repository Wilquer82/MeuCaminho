import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CACHE_KEY = 'meucaminho_bible_cache';
const VERSION_CACHE_KEY = 'meucaminho_bible_version_cache';
const FAVORITES_KEY = 'meucaminho_bible_favorites';
const OFFLINE_MODE_KEY = 'offlineMode';

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

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
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
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(() => localStorage.getItem(OFFLINE_MODE_KEY) === 'true');

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
    setOfflineModeEnabled(localStorage.getItem(OFFLINE_MODE_KEY) === 'true');
  }, [translation, bookId, chapter]);

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
  const selectedBookIndex = books.findIndex(book => book.id === bookId);
  const downloadedVersions = Object.keys(getVersionCache());

  function goToNextChapter() {
    if (!selectedBook) return;

    if (chapter < selectedBook.chapters) {
      setChapter(chapter + 1);
      return;
    }

    const nextBookIndex = selectedBookIndex + 1;
    if (nextBookIndex < books.length) {
      setBookId(books[nextBookIndex].id);
      setChapter(1);
      return;
    }

    setChapter(selectedBook.chapters);
  }

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

  function toggleFavorite(verse) {
    if (!selectedBook || !reading) return;

    const favoriteKey = `${translation}:${bookId}:${chapter}:${verse.verse}`;
    const nextFavorites = [...favorites];
    const favoriteIndex = nextFavorites.findIndex(item => item.key === favoriteKey);

    if (favoriteIndex >= 0) {
      nextFavorites.splice(favoriteIndex, 1);
      setMessage('Versículo removido dos favoritos.');
    } else {
      nextFavorites.unshift({
        key: favoriteKey,
        translation,
        bookId,
        bookName: selectedBook.name,
        chapter,
        verse: verse.verse,
        text: verse.text,
        createdAt: new Date().toISOString()
      });
      setMessage('Versículo marcado como favorito.');
    }

    setFavorites(nextFavorites);
    saveFavorites(nextFavorites);
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
          {translations.map(version => {
            const isAvailableOffline = downloadedVersions.includes(version.id);
            return (
              <option key={version.id} value={version.id}>
                {version.name} ({version.language}){isAvailableOffline ? ' • Offline' : ''}
              </option>
            );
          })}
        </select>
        <div style={{ display: 'flex', gap: 8, gridColumn: '1 / -1' }}>
          <select value={chapter} onChange={event => setChapter(Number(event.target.value))} style={{ ...fieldStyle, flex: 1 }}>
            {Array.from({ length: selectedBook?.chapters || 1 }, (_, index) => (
              <option key={index + 1} value={index + 1}>Cap. {index + 1}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={goToNextChapter}
            style={{
              ...buttonStyle,
              marginTop: 0,
              width: 'auto',
              minWidth: 120,
              padding: '12px 16px',
              background: 'var(--accent2)',
              whiteSpace: 'nowrap'
            }}
          >
            Próximo capítulo
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={versionOfflineSaved ? removeFullTranslationOffline : saveFullTranslationOffline}
          disabled={savingVersion}
          style={{
            ...buttonStyle,
            marginTop: 0,
            background: versionOfflineSaved ? '#1f7a3d' : '#0f766e',
            opacity: savingVersion ? 0.7 : 1
          }}
        >
          {savingVersion
            ? 'Salvando versão...'
            : versionOfflineSaved
              ? '✓ Versão disponível offline • remover'
              : 'Salvar versão completa offline'}
        </button>
      </div>

      {offlineModeEnabled && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: '10px 12px', marginBottom: 16, color: 'var(--success)', fontSize: 12, fontWeight: 700 }}>
          Modo offline ativo: o app pode usar conteúdo salvo localmente.
        </div>
      )}

      {favorites.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Favoritos</p>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{favorites.length}</span>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {favorites.slice(0, 3).map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setBookId(item.bookId);
                  setChapter(item.chapter);
                  setTranslation(item.translation);
                }}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  background: 'var(--bg)',
                  textAlign: 'left',
                  padding: '8px 10px',
                  color: 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{item.bookName} {item.chapter}:{item.verse}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{item.text.slice(0, 80)}{item.text.length > 80 ? '...' : ''}</div>
              </button>
            ))}
          </div>
        </div>
      )}

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
              {reading.verses.map(verse => {
                const isFavorite = favorites.some(item => item.key === `${translation}:${bookId}:${chapter}:${verse.verse}`);

                return (
                  <div key={verse.verse} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 22, paddingTop: 2 }}>
                      <sup style={{ color: 'var(--accent)', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700 }}>{verse.verse}</sup>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.65, margin: 0, background: isFavorite ? 'rgba(245, 158, 11, .12)' : 'transparent', borderRadius: 8, padding: isFavorite ? '4px 8px' : '0' }}>
                        {verse.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(verse)}
                      aria-label={isFavorite ? 'Remover favorito' : 'Adicionar favorito'}
                      style={{
                        border: '1px solid var(--border)',
                        background: isFavorite ? '#fbbf24' : 'var(--card)',
                        borderRadius: 8,
                        width: 32,
                        height: 32,
                        fontSize: 16,
                        cursor: 'pointer',
                        color: isFavorite ? '#1f2937' : 'var(--accent2)',
                        flexShrink: 0,
                        marginTop: 2
                      }}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                  </div>
                );
              })}
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