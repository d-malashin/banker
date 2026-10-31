const CACHE = 'banker-__BANKER_CACHE_VERSION__';
const ASSETS = /* __BANKER_ASSETS__ */ [];
const ROOT = new URL('./', self.location.href);
const announce = async () => {
  for (const client of await self.clients.matchAll({ includeUncontrolled: true })) {
    client.postMessage({ type: 'BANKER_OFFLINE_READY' });
  }
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    if (!ASSETS.length) return;
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS.map(path => new URL(path, ROOT).href));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('banker-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
    if (ASSETS.length) await announce();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'BANKER_OFFLINE_STATUS' && ASSETS.length) {
    event.waitUntil(announce());
  }
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request, { ignoreVary: true });
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch (error) {
      if (event.request.mode === 'navigate') {
        const shell = await caches.match(new URL('./index.html', ROOT).href);
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
