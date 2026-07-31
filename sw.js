/* Hashcards — offline cache.
 *
 * Caches the shell so the app opens without a network. It never touches the
 * deck: cards live in localStorage, which no service worker can reach.
 *
 * Bump CACHE whenever a cached file changes, or browsers keep serving the old
 * copy to anyone who has already opened the app.
 */
var CACHE = 'hashcards-v2';

var SHELL = [
  './',
  'index.html',
  'style.css?v=2',
  'js/crypto.js?v=2',
  'js/store.js?v=2',
  'js/i18n.js?v=2',
  'js/icons.js?v=2',
  'js/app.js?v=2',
  'manifest.webmanifest',
  'icons/favicon.svg',
  'icons/icon.svg',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          return key === CACHE ? null : caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* Cache first: the shell never changes without a new CACHE name, and a review
 * session should not stall on a slow connection. */
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (hit) {
      if (hit) return hit;
      return fetch(event.request)
        .then(function (response) {
          if (response && response.ok && response.type === 'basic') {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match('index.html');
        });
    })
  );
});
