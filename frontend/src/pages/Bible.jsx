import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CACHE_KEY = 'meucaminho_bible_cache';
const VERSION_CACHE_KEY = 'meucaminho_bible_version_cache';
const FAVORITES_KEY = 'meucaminho_bible_favorites';
const OFFLINE_MODE_KEY = 'offlineMode';
const VERSION_DB_NAME = 'meucaminho_bible_offline';
const VERSION_DB_STORE = 'translations';

const OLD_TESTAMENT_BOOKS = new Set([
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
  'joshua', 'judges', 'ruth', '1-samuel', '2-samuel', '1-kings', '2-kings',
  '1-chronicles', '2-chronicles', 'ezra', 'nehemiah', 'esther', 'job',
  'psalms', 'proverbs', 'ecclesiastes', 'song-of-solomon', 'isaiah',
  'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
  'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah',
  'haggai', 'zechariah', 'malachi'
]);

const NEW_TESTAMENT_BOOKS = new Set([
  'matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians',
  '2-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
  '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy', 'titus',
  'philemon', 'hebrews', 'james', '1-peter', '2-peter', '1-john',
  '2-john', '3-john', 'jude', 'revelation'
]);

function getTestament(bookId) {
  if (OLD_TESTAMENT_BOOKS.has(bookId)) return 'VT';
  if (NEW_TESTAMENT_BOOKS.has(bookId)) return 'NT';
  return 'VT';
}

function getCachedChapterCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getLegacyVersionCache() {
  try {
    return JSON.parse(localStorage.getItem(VERSION_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setCachedChapterCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function openVersionDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB indisponível'));
      return;
    }

    const request = window.indexedDB.open(VERSION_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(VERSION_DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getVersionCache() {
  const legacyCache = getLegacyVersionCache();

  try {
    const database = await openVersionDatabase();
    const cache = await new Promise((resolve, reject) => {
      const request = database.transaction(VERSION_DB_STORE, 'readonly').objectStore(VERSION_DB_STORE).get('all');
      request.onsuccess = () => resolve(request.result || {});
      request.onerror = () => reject(request.error);
    });
    database.close();

    if (Object.keys(cache).length || !Object.keys(legacyCache).length) return cache;
    await setVersionCache(legacyCache);
    return legacyCache;
  } catch {
    return legacyCache;
  }
}

async function setVersionCache(cache) {
  try {
    const database = await openVersionDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(VERSION_DB_STORE, 'readwrite');
      transaction.objectStore(VERSION_DB_STORE).put(cache, 'all');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  } catch {
    localStorage.setItem(VERSION_CACHE_KEY, JSON.stringify(cache));
  }
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
  const [downloadedVersions, setDownloadedVersions] = useState([]);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(() => localStorage.getItem(OFFLINE_MODE_KEY) === 'true');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);

  async function performSearch(query) {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setMessage('');

    try {
      const versionCache = await getVersionCache();
      const translationCache = versionCache[translation];
      
      let results = [];

      if (translationCache && translationCache.books) {
        // Search in offline cache
        for (const [bookId, chapters] of Object.entries(translationCache.books)) {
          const testament = getTestament(bookId);
          if (searchFilter !== 'all' && searchFilter !== testament) continue;

          const book = books.find(b => b.id === bookId);
          if (!book) continue;

          for (const [chapterNum, chapterData] of Object.entries(chapters)) {
            if (!chapterData.verses) continue;

            for (const verse of chapterData.verses) {
              if (verse.text && verse.text.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                  bookId,
                  bookName: book.name,
                  chapter: Number(chapterNum),
                  verse: verse.verse,
                  text: verse.text,
                  testament,
                  reference: `${book.name} ${chapterNum}:${verse.verse}`
                });
              }
            }
          }
        }
      } else {
        // Fallback: search via API (limited to current book or first few books for performance)
        setMessage('Busca offline indisponível. Baixe a tradução para buscar offline.');
      }

      // Sort by book order (testament, then book index, then chapter, then verse)
      results.sort((a, b) => {
        const bookA = books.find(book => book.id === a.bookId);
        const bookB = books.find(book => book.id === b.bookId);
        const indexA = bookA ? books.indexOf(bookA) : 999;
        const indexB = bookB ? books.indexOf(bookB) : 999;
        
        if (indexA !== indexB) return indexA - indexB;
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.verse - b.verse;
      });

      setSearchResults(results.slice(0, 100)); // Limit to 100 results
    } catch (error) {
      setMessage('Erro ao realizar busca.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      performSearch(value);
    } else {
      setSearchResults([]);
    }
  }

  function handleSearchFilterChange(filter) {
    setSearchFilter(filter);
    if (searchQuery.length >= 2) {
      performSearch(searchQuery);
    }
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  }

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
    const fallbackList = [
      { id: 'nvi', name: 'Nova Versão Internacional', language: 'pt-BR' },
      { id: 'ra', name: 'Almeida Revista e Atualizada', language: 'pt-BR' },
      { id: 'acf', name: 'Almeida Corrigida Fiel', language: 'pt-BR' },
      { id: 'ara', name: 'Almeida Revista e Atualizada (ARA)', language: 'pt-BR' },
      { id: 'tb', name: 'Tradução Brasileira', language: 'pt-BR' },
      { id: 'tbsi', name: 'Tradução Brasileira (TBSI)', language: 'pt-BR' },
      { id: 'bb', name: 'Bíblia do Brasil', language: 'pt-BR' },
      { id: 'blh', name: 'Bíblia Livre de Herança', language: 'pt-BR' },
      { id: 'nvt', name: 'Nova Versão Transformadora', language: 'pt-BR' },
      { id: 'rvr', name: 'Reina-Valera Revisada', language: 'pt-BR' },
      { id: 'rv1960', name: 'Reina-Valera 1960', language: 'pt-BR' },
      { id: 'vdl', name: 'Versão de Dom Lucas', language: 'pt-BR' },
      { id: 'tr', name: 'Tradução de João Ferreira de Almeida', language: 'pt-BR' },
      { id: 'pt', name: 'Português Tradicional', language: 'pt-BR' },
      { id: 'jfa', name: 'João Ferreira de Almeida', language: 'pt-BR' },
      { id: 'bpt', name: 'Bíblia Popular Traduzida', language: 'pt-BR' },
      { id: 'bv', name: 'Bíblia Viva', language: 'pt-BR' },
      { id: 'sbt', name: 'Sociedade Bíblica do Brasil', language: 'pt-BR' },
      { id: 'capa', name: 'Capa da Bíblia', language: 'pt-BR' },
      { id: 'gospel', name: 'Gospel Edition', language: 'pt-BR' },
      { id: 'kjv', name: 'King James Version', language: 'en' }
    ];

    const candidateUrls = [
      'https://api.midvash.com/v1/versions?language=pt-BR',
      'https://api.midvash.com/v1/versions?language=pt-br',
      'https://api.midvash.com/v1/versions?language=pt',
      'https://api.midvash.com/v1/versions'
    ];

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const payload = await response.json();
        const rawVersions = Array.isArray(payload) ? payload : payload.data || [];
        const normalized = rawVersions
          .map(version => ({
            id: version.slug || version.id || version.name,
            name: version.name || version.title || 'Versão',
            language: version.language || version.lang || 'pt-BR'
          }))
          .filter(version => version.id && version.name)
          .filter(version => /pt|portuguese/i.test(version.language) || /pt|portuguese/i.test(version.name));

        if (normalized.length) {
          const unique = Object.values(normalized.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {}));
          return unique.length ? unique : fallbackList;
        }
      } catch {
        // Continua para a próxima fonte.
      }
    }

    return fallbackList;
  }

  useEffect(() => {
    if (translations.length && !translations.some(version => version.id === translation)) {
      setTranslation(translations[0].id);
      return;
    }

    localStorage.setItem('bibleTranslation', translation);
  }, [translation, translations]);

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
    let active = true;
    getVersionCache().then(versionCache => {
      if (!active) return;
      const cache = getCachedChapterCache();
      const chapterKey = `${translation}:${bookId}:${chapter}`;
      setOfflineSaved(Boolean(cache[chapterKey]));
      setDownloadedVersions(Object.keys(versionCache));
      setVersionOfflineSaved(Boolean(versionCache[translation] && Object.keys(versionCache[translation].books || {}).length > 0));
    });
    return () => { active = false; };
  }, [translation, bookId, chapter]);

  const selectedBook = books.find(book => book.id === bookId);
  const selectedBookIndex = books.findIndex(book => book.id === bookId);
  const currentVersionIsOffline = downloadedVersions.includes(translation) || versionOfflineSaved;

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

      const versionCache = await getVersionCache();
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
      const versionCache = await getVersionCache();
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

  async function saveFullTranslationOffline() {
    if (!books.length || savingVersion) return;

    setSavingVersion(true);
    setDownloadProgress(0);
    setMessage('Salvando versão da Bíblia para uso offline...');

    try {
      const versionCache = await getVersionCache();
      const fullVersion = { savedAt: new Date().toISOString(), books: {} };
      let savedChapters = 0;
      const totalChapters = books.reduce((sum, book) => sum + book.chapters, 0);

      for (const book of books) {
        fullVersion.books[book.id] = {};

        for (let chapterNumber = 1; chapterNumber <= book.chapters; chapterNumber += 1) {
          try {
            const response = await api.get(`/bible/${book.id}/${chapterNumber}`, { params: { translation } });
            if (Array.isArray(response.data?.verses) && response.data.verses.length) {
              fullVersion.books[book.id][chapterNumber] = { ...response.data, storedAt: new Date().toISOString() };
              savedChapters += 1;
            }
          } catch {
            try {
              const fallbackResponse = await fetch(`https://api.midvash.com/v1/${translation}/${book.id}/${chapterNumber}`);
              const payload = await fallbackResponse.json();
              if (fallbackResponse.ok) {
                const normalized = normalizeChapterData(book.name, book.id, chapterNumber, translation, payload);
                if (normalized.verses.length) {
                  fullVersion.books[book.id][chapterNumber] = normalized;
                  savedChapters += 1;
                }
              }
            } catch {
              // Ignora capítulos indisponíveis para manter o restante da versão salva.
            }
          }
          // Update progress
          setDownloadProgress(Math.round((savedChapters / totalChapters) * 100));
        }
      }

      if (!savedChapters) throw new Error('Nenhum capítulo foi baixado');
      versionCache[translation] = fullVersion;
      await setVersionCache(versionCache);
      setDownloadedVersions(Object.keys(versionCache));
      setVersionOfflineSaved(true);
      setDownloadProgress(100);
      setMessage(`Versão ${translation.toUpperCase()} salva para acesso offline.`);
    } catch {
      setMessage('Não foi possível baixar esta tradução. Verifique a conexão e tente novamente.');
      setDownloadProgress(0);
    } finally {
      setSavingVersion(false);
    }
  }

  async function removeFullTranslationOffline() {
    const versionCache = await getVersionCache();
    delete versionCache[translation];
    await setVersionCache(versionCache);
    setDownloadedVersions(Object.keys(versionCache));
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
            const isCurrentVersion = version.id === translation;
            const suffix = isAvailableOffline ? ' • Já baixada offline' : isCurrentVersion ? ' • Não salva offline' : '';
            return (
              <option key={version.id} value={version.id}>
                {version.name} ({version.language}){suffix}
              </option>
            );
          })}
        </select>
        <select value={chapter} onChange={event => setChapter(Number(event.target.value))} style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          {Array.from({ length: selectedBook?.chapters || 1 }, (_, index) => (
            <option key={index + 1} value={index + 1}>Cap. {index + 1}</option>
          ))}
        </select>
      </div>

      {currentVersionIsOffline && (
        <div style={{
          marginBottom: 16,
          fontSize: 12,
          color: 'var(--success)',
          fontWeight: 600,
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 10,
          padding: '10px 12px'
        }}>
          Versão atual disponível para leitura offline neste dispositivo.
        </div>
      )}

      {offlineModeEnabled && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: '10px 12px', marginBottom: 16, color: 'var(--success)', fontSize: 12, fontWeight: 700 }}>
          Modo offline ativo: o app pode usar conteúdo salvo localmente.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={saveFullTranslationOffline}
          disabled={savingVersion}
          style={{
            ...buttonStyle,
            marginTop: 0,
            opacity: savingVersion ? .6 : 1,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {savingVersion ? (
            <>
              <span style={{ position: 'relative', zIndex: 1 }}>
                Baixando tradução... {downloadProgress}%
              </span>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${downloadProgress}%`,
                  background: 'rgba(255,255,255,0.3)',
                  transition: 'width 0.3s ease'
                }}
              />
            </>
          ) : currentVersionIsOffline ? (
            'Disponível Offline'
          ) : (
            'Baixar tradução para offline'
          )}
        </button>
        {currentVersionIsOffline && (
          <button type="button" onClick={removeFullTranslationOffline} disabled={savingVersion} style={{ ...buttonStyle, marginTop: 0, background: 'var(--muted)', flex: '0 0 100px' }}>
            Remover
          </button>
        )}
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '10px 12px',
        marginBottom: 16,
        color: 'var(--muted)',
        fontSize: 11,
        lineHeight: 1.5
      }}>
        Versículos marcados ficam destacados em amarelo para facilitar a releitura.
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setShowSearch(!showSearch)}
          style={{
            width: '100%',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
            background: 'var(--card)',
            color: 'var(--text)',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}
        >
          <span>🔍 Buscar na Bíblia</span>
          <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: showSearch ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>

        {showSearch && (
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Digite um termo para buscar (mín. 2 caracteres)"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  background: 'var(--card)',
                  color: 'var(--text)',
                  fontSize: 14
                }}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    background: 'var(--card)',
                    color: 'var(--muted)',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Limpar
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', 'VT', 'NT'].map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleSearchFilterChange(filter)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    background: searchFilter === filter ? 'var(--accent)' : 'var(--card)',
                    color: searchFilter === filter ? '#fff' : 'var(--text)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {filter === 'all' ? 'Toda a Bíblia' : filter === 'VT' ? 'Velho Testamento' : 'Novo Testamento'}
                </button>
              ))}
            </div>

            {searchLoading && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '16px' }}>
                Buscando...
              </div>
            )}

            {searchResults.length > 0 && (
              <div style={{ display: 'grid', gap: 8, maxHeight: '400px', overflowY: 'auto' }}>
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.bookId}-${result.chapter}-${result.verse}-${index}`}
                    type="button"
                    onClick={() => {
                      setBookId(result.bookId);
                      setChapter(result.chapter);
                      setShowSearch(false);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      background: 'var(--card)',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--accent-soft)'}
                    onMouseLeave={e => e.target.style.background = 'var(--card)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: result.testament === 'VT' ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)',
                        color: result.testament === 'VT' ? 'var(--premium)' : 'var(--success)'
                      }}>
                        {result.testament}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{result.reference}</span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: 13,
                      color: 'var(--text)',
                      lineHeight: 1.5
                    }}
                    dangerouslySetInnerHTML={{
                      __html: result.text.replace(
                        new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                        '<mark style="background: rgba(245,158,11,0.3); padding: 0 2px; border-radius: 2px;">$1</mark>'
                      )
                    }}
                    />
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '16px' }}>
                Nenhum resultado encontrado para "{searchQuery}".
              </div>
            )}
          </div>
        )}
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
              {reading.verses.map(verse => {
                const isFavorite = favorites.some(item => item.key === `${translation}:${bookId}:${chapter}:${verse.verse}`);

                return (
                  <div key={verse.verse} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 22, paddingTop: 2 }}>
                      <sup style={{ color: 'var(--accent)', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700 }}>{verse.verse}</sup>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        onClick={() => toggleFavorite(verse)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggleFavorite(verse);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: 16,
                          lineHeight: 1.65,
                          margin: 0,
                          background: isFavorite ? 'rgba(245, 158, 11, .22)' : 'transparent',
                          borderRadius: 8,
                          padding: isFavorite ? '4px 8px' : '0',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {verse.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="button" onClick={completeReading} disabled={reading.completed} style={{ ...buttonStyle, flex: 1, opacity: reading.completed ? .6 : 1 }}>
              {reading.completed ? 'Leitura concluída' : 'Concluir leitura e ganhar XP'}
            </button>
            <button type="button" onClick={goToNextChapter} style={{ ...buttonStyle, flex: 1, background: 'var(--accent2)' }}>
              Próximo capítulo
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