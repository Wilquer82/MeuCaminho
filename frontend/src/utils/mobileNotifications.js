export function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve('unsupported');

  if (Notification.permission === 'granted') return Promise.resolve('granted');
  if (Notification.permission === 'denied') return Promise.resolve('denied');

  return Notification.requestPermission();
}

export function scheduleDailyReadingReminder(hour = 20, minute = 30) {
  if (!('Notification' in window)) return;
  if (!('serviceWorker' in navigator)) return;

  const current = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);

  if (next <= current) {
    next.setDate(next.getDate() + 1);
  }

  const delay = next.getTime() - current.getTime();

  if (window.__readingReminderTimer) {
    clearTimeout(window.__readingReminderTimer);
  }

  window.__readingReminderTimer = setTimeout(() => {
    const title = 'Meu Caminho de Luz';
    const body = 'É hora de ler a Palavra de Deus hoje.';

    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, { body, icon: '/favicon.svg' });
    });

    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(hour, minute, 0, 0);
    window.__readingReminderTimer = setTimeout(() => scheduleDailyReadingReminder(hour, minute), nextDay.getTime() - Date.now());
  }, delay);
}
