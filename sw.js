// ==============================================================================
// 🛰️ LARA ELITE OMEGA — SERVICE WORKER PROFISSIONAL v30.5
// ==============================================================================

// ⚡ MUDANÇA CRUCIAL: O nome do cache agora reflete a v30.5
const CACHE_NAME = 'lara-omega-v30.5';
const APP_SHELL = [
    './',
    './index.html'
];

// ============================
// 🧠 INSTALL — Força a entrada
// ============================
self.addEventListener('install', (event) => {
    // skipWaiting faz com que o novo SW assuma o controle na hora, sem esperar fechar o app
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
});

// ============================
// 🧠 ACTIVATE — Purga total do passado (Silent Purge)
// ============================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                // Se o cache antigo não for o v30.5, ele é DELETADO agora
                if (key !== CACHE_NAME) {
                    console.log('%c 🧹 OMEGA PURGE: Limpando rastro antigo: ' + key, 'color:#00f2ff');
                    return caches.delete(key);
                }
            }))
        ).then(() => self.clients.claim())
    );
});

// ============================
// 🧠 FETCH — Network First (Prioriza o Novo)
// ============================
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Ignora APIs de imagem e IA para não encher o cache de lixo
    if (req.url.includes('pollinations.ai') || req.url.includes('text.pollinations.ai')) return;

    event.respondWith(
        // Estratégia Network First: Tenta buscar na internet o novo código primeiro.
        // Se a internet falhar (offline), ele usa o que está no cache.
        fetch(req).then(response => {
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
            }
            return response;
        }).catch(() => caches.match(req))
    );
});

// ============================
// 🧠 NOTIFICAÇÕES — Sincronia
// ============================
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
            for (const client of clientsArr) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('./');
        })
    );
});
