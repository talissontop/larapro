// ==============================================================================
// 🛰️ LARA ELITE OMEGA — SERVICE WORKER PROFISSIONAL v30.6
// ==============================================================================

// ⚡ ESSENCIAL: Nome do cache atualizado para forçar a purga da v30.5
const CACHE_NAME = 'lara-omega-v30.6';
const APP_SHELL = [
    './',
    './index.html'
];

// ============================
// 🧠 INSTALL — Upgrade Imediato
// ============================
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
});

// ============================
// 🧠 ACTIVATE — Purga de Cache v30.5
// ============================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('%c 🧹 OMEGA PURGE: Eliminando rastro v30.5: ' + key, 'color:#00f2ff');
                    return caches.delete(key);
                }
            }))
        ).then(() => self.clients.claim())
    );
});

// ============================
// 🧠 FETCH — Prioridade de Rede (Garante o v30.6)
// ============================
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.url.includes('pollinations.ai')) return;

    event.respondWith(
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
// 🧠 NOTIFICAÇÕES — Controle de Foco
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
