/* Offline support. Raise VERSION when you publish, to clear the old cache. */
const VERSION = 'v2';
const CACHE = `maxgfortes-${VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './repo.html',
  './manifest.webmanifest',
  './src/css/style.css',
  './src/js/main.js',
  './src/js/motion.js',
  './src/js/player.js',
  './src/js/playlist.js',
  './src/js/pwa.js',
  './public/img/bg.jpg',
  './public/img/pfp.jpg',
  './public/img/stickyNote1.png',
  './public/img/stickyNote2.png',
  './public/icons/icon-192.png',
  './public/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  /* one missing file should not cancel the whole install */
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* audio and video use range requests, so they go straight to the network */
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  if (request.headers.has('range') || request.destination === 'audio' || request.destination === 'video') return;

  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return res;
      }))
    );
    return;
  }

  /* pages, styles and scripts: newest first, cache when offline */
  event.respondWith(
    fetch(request).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return res;
    }).catch(() => caches.match(request).then((hit) => hit || caches.match('./index.html')))
  );
});
