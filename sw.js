const CACHE_NAME = 'Lara Elite-V26.0';

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://spicy-harlequin-pqaujlkovi.edgeone.app/pngtree-beautiful-ai-generated-girl-so-much-attractive-png-image_12342109.png',
    'https://quick-plum-ydrhk4qkr9.edgeone.app/images.jpeg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const asset of ASSETS) {
                try { await cache.add(asset); } catch (e) {}
            }
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all( keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)) )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    event.respondWith(
        caches.match(req).then((cached) => {
            const networked = fetch(req).then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                }
                return response;
            }).catch(() => cached);
            return cached || networked;
        })
    );
});
