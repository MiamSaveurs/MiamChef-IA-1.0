
/*
 * Service Worker pour MiamChef IA
 * Version : v3 - Retour à Boogaloo
 */

const CACHE_NAME = 'miamchef-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Boogaloo&family=Lato:wght@300;400;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Installation : Mise en cache des ressources statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Installation v3 : Mise en cache de l\'application');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Suppression de l\'ancien cache :', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // 1. Ne pas intercepter l'API Google
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // 2. Stratégie Network First pour le HTML (garantit la mise à jour GitHub)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Cache First pour les autres ressources statiques
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
