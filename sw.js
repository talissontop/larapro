// ==============================================================================
// 🛰️ LARA ELITE OMEGA — SERVICE WORKER PROFISSIONAL v29.6 
// ==============================================================================

const CACHE_NAME = 'lara-omega-v29';
const APP_SHELL = [
    './',
    './index.html'
];

// ============================
// 🧠 INSTALL — Cache seguro
// ============================
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
});

// ============================
// 🧠 ACTIVATE — Purga total do passado
// ============================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('%c 🧹 PURGA: Eliminando cache antigo: ' + key, 'color:#ff4444');
                    return caches.delete(key);
                }
            }))
        ).then(() => self.clients.claim())
    );
});

// ============================
// 🧠 FETCH — Stale While Revalidate
// ============================
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Ignora APIs externas dinâmicas para busca real em 2026
    if (req.url.includes('pollinations.ai')) return;

    event.respondWith(
        caches.match(req).then(cached => {
            const networkFetch = fetch(req).then(response => {
                // Só salva se a resposta for válida e do seu domínio
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                }
                return response;
            }).catch(() => cached);

            return cached || networkFetch;
        })
    );
});

// ============================
// 🧠 NOTIFICATION CLICK — Controle de Instância
// ============================
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
            // Suporte para botões de ação (Actions)
            if (event.action === 'PURGE') {
                for (const client of clientsArr) {
                    client.postMessage({ type: 'ACTION_TRIGGERED', action: 'PURGE' });
                }
                return;
            }

            // Foca na aba aberta ou abre nova
            for (const client of clientsArr) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('./');
        })
    );
});

// ============================
// 🧠 MENSAGENS — Sincronia de DNA
// ============================
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
