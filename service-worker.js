
/*
 * Service Worker pour MiamChef IA
 * Permet l'accès hors-ligne au Carnet de Recettes et à la Liste de Courses.
 */

const CACHE_NAME = 'miamchef-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Boogaloo&family=Lato:wght@300;400;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Installation : Mise en cache des ressources statiques (App Shell)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Mise en cache de l\'application');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches si mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Stratégie : Cache First, falling back to Network
  // Pour l'API Google, on laisse passer (Network Only)
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si trouvé dans le cache, on le retourne
      if (response) {
        return response;
      }
      // Sinon, on va chercher sur le réseau
      return fetch(event.request).catch(() => {
        // Si réseau échoue (offline) et que ce n'est pas dans le cache
        // On pourrait retourner une page "Offline" générique ici si nécessaire
        // Mais pour une SPA, index.html est déjà en cache.
      });
    })
  );
});
