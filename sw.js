const CACHE_NAME = 'lara-elite-v31-omega';

// Instalação do Service Worker
self.addEventListener('install', (e) => {
    console.log('[SW OMEGA] Instalado com sucesso.');
    self.skipWaiting(); // Força a atualização imediata
});

// Ativação e limpeza de cache antigo (Purga Atômica)
self.addEventListener('activate', (e) => {
    console.log('[SW OMEGA] Ativado e assumindo o controle.');
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW OMEGA] Removendo cache antigo:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// A REGRA DE OURO DO PWA: O evento "fetch" TEM que existir
// Se isso não estiver aqui, o Chrome não libera a instalação nativa.
self.addEventListener('fetch', (e) => {
    // Modo rede pura (Network First) - Garante que você sempre veja o código novo
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
