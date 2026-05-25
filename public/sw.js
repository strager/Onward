// Minimal service worker: exists only to make Onward installable as a PWA.
// No offline caching — requests pass straight through to the network.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // Intentionally empty: let the browser handle the request.
})
