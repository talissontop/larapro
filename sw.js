// 🛡️ MOTOR DE PERSISTÊNCIA EXTREMA (sw.js) v25
// Objetivo: Impedir a exclusão de arquivos e manter permissões ativas

const CACHE_NAME = 'LaraElite-Permanente-v25';
const ASSETS_TO_BLOCK = [
  './',
  './index.html',
  './manifest.json',
  'https://spicy-harlequin-pqaujlkovi.edgeone.app/pngtree-beautiful-ai-generated-girl-so-much-attractive-png-image_12342109.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_BLOCK);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || networkFetch;
    })
  );
});
