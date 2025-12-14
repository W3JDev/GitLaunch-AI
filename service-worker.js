const CACHE_VERSION = 'v-2.0.0';
const CACHE_STATIC = `gitlaunch-static-${CACHE_VERSION}`;
const CACHE_IMAGES = `gitlaunch-images-${CACHE_VERSION}`;
const CACHE_API = `gitlaunch-api-${CACHE_VERSION}`;

// Assets that must be available offline immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC && key !== CACHE_IMAGES && key !== CACHE_API) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Handle Navigation (HTML) - Network First, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 2. Handle Images/Fonts - Cache First, then Network
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    url.hostname.includes('pollinations.ai') ||
    url.hostname.includes('unsplash.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          // Don't cache opaque responses or errors unless necessary, 
          // but for external images, we often get opaque.
          const responseClone = response.clone();
          caches.open(CACHE_IMAGES).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // 3. Handle API Calls (GitHub) - Network First, fallback to cache
  if (url.hostname.includes('api.github.com') || url.hostname.includes('raw.githubusercontent.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_API).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 4. Default - Stale-While-Revalidate for JS/CSS/Other
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_STATIC).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});