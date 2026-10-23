/* Palabra 0.5a.4: retirement worker; no fetch handler, no offline caching. */
self.addEventListener('install', event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => /^palabra[-_]/i.test(key)).map(key => caches.delete(key)));
    await self.registration.unregister();
    await self.clients.claim();
  })());
});
