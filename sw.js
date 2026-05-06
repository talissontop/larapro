const CACHE_NAME = 'lara-elite-v21.11';

// Recursos críticos que DEVEM ser cacheados para o PWA abrir
const PRE_CACHE = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://spicy-harlequin-pqaujlkovi.edgeone.app/pngtree-beautiful-ai-generated-girl-so-much-attractive-png-image_12342109.png'
];

// Instalação com tratamento de erro
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos addAll mas envolvemos em um catch para não travar o SW se um link falhar
      return cache.addAll(PRE_CACHE).catch(err => console.error("Falha no pre-cache:", err));
    })
  );
});

// Ativação e limpeza de versões antigas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia Híbrida: Network First para scripts, Stale-While-Revalidate para imagens
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Se for uma imagem da IA ou externa, usamos Cache First (mais rápido)
  if (e.request.destination === 'image' || url.hostname.includes('pollinations.ai')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        return cached || fetch(e.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Para o resto (HTML/JS), tentamos Rede Primeiro para garantir a v21.11 atualizada
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Aproveita e atualiza o cache com a versão mais nova da rede
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Escuta mensagens do Front-end (opcional para expansões futuras)
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
