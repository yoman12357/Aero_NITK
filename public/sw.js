// Self-destructing service worker — clears all old caches
// and unregisters itself so users are never stuck on stale content.

self.addEventListener('install', () => {
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => caches.delete(cache))
            );
        }).then(() => {
            return self.clients.matchAll();
        }).then((clients) => {
            // Force all open tabs to reload with fresh content
            clients.forEach((client) => client.navigate(client.url));
        })
    );
});
