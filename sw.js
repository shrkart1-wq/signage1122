// Service worker: даёт странице открываться без интернета.
// Видео кэшируется самой страницей через Cache API (video-v1).
const SHELL = 'shell-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['./', './sw.js'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  // сеть в приоритете (чтобы подхватывать обновления страницы), офлайн — из кэша
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(SHELL).then((c) => c.put('./', copy));
        return resp;
      })
      .catch(() => caches.match('./'))
  );
});
