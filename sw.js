// ==============================================================================
// 🛰️ LARA ELITE OMEGA — SERVICE WORKER v30.9 BUSTER
// ==============================================================================

const CACHE_NAME = 'lara-omega-v30.9';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                // EXTERMÍNIO: Se não for a 30.9, deleta sem piedade
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }))
        ).then(() => self.clients.claim())
    );
});

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
