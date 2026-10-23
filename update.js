/* Palabra 0.6a.5 – retire old offline cache, preserve localStorage. */
(function () {
  const VERSION = '06a5';
  async function cleanOldAppCaches() {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const appPath = new URL('./', location.href).pathname;
      await Promise.all(registrations.filter(reg => {
        try { return new URL(reg.scope).pathname.startsWith(appPath); } catch (_) { return false; }
      }).map(reg => reg.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => /^palabra[-_]/i.test(key)).map(key => caches.delete(key)));
    }
  }
  async function refreshApp() {
    const label = document.getElementById('refreshVersionMessage');
    if (label) label.textContent = 'Alte App-Caches werden entfernt …';
    try { await cleanOldAppCaches(); }
    catch (error) { if (label) label.textContent = 'Cache-Bereinigung nicht vollständig: ' + error.message; }
    const url = new URL('./index.html', location.href);
    url.searchParams.set('v', VERSION);
    url.searchParams.set('reload', String(Date.now()));
    location.replace(url.href);
  }
  // Clean up on every 0.6a.5 load. Never clear localStorage or IndexedDB.
  cleanOldAppCaches().catch(() => {});
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('refreshVersionBtn');
    if (btn) btn.addEventListener('click', refreshApp);
  });
})();
