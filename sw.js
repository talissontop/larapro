const CACHE_NAME = 'lara-elite-v21.12';
const ASSETS = [
  './',
  './index.html',
  'https://spicy-harlequin-pqaujlkovi.edgeone.app/pngtree-beautiful-ai-generated-girl-so-much-attractive-png-image_12342109.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Instalação: Salva arquivos essenciais imediatamente
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Força a nova versão a assumir o controle
});

// Ativação: Limpa caches antigos automaticamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Estratégia Stale-While-Revalidate: Carrega rápido do cache, mas atualiza por trás
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      const fetchPromise = fetch(e.request).then((networkRes) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkRes.clone()));
        return networkRes;
      });
      return res || fetchPromise;
    })
  );
});
