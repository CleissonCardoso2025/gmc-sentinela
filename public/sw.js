
const CACHE_NAME = 'sentinela-v1';

// Assets to cache initially
const INITIAL_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/83b69061-6005-432b-8d81-e2ab0d07dc10.png',
  '/lovable-uploads/ec9f93a3-9ab1-4aed-b299-92787ae26f17.png'
];

// Install event - precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(INITIAL_CACHE_URLS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extensions
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response or not same-origin
            if (
              !response || 
              response.status !== 200 || 
              response.type !== 'basic'
            ) {
              return response;
            }

            // Clone the response as it's a stream that can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
