// Moovo 3D — mise en cache pour fonctionner hors connexion une fois l'application en ligne
const CACHE = 'moovo3d-v7';
const CORE = ['./', 'index.html', 'interieur.html', 'exterieur.html', 'moovo-core.js', 'moovo-lib.js', 'manifest.webmanifest', 'img/logo-mark.png', 'img/logo-mark-128.png', 'img/favicon-32.png', 'img/favicon-64.png', 'img/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// réseau d'abord pour nos pages (toujours la dernière version), cache en secours ; cache d'abord pour la bibliothèque 3D
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; })));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
  }
});
