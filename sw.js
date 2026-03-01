/* Atlas Tamghrabit — Service Worker v6 */
const CACHE_NAME = 'atlas-tamghrabit-v6';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/tokens.css',
    '/css/base.css',
    '/css/components.css',
    '/css/screens.css',
    '/css/animations.css',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Network-first for JS/CSS so code updates load immediately
    if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
        event.respondWith(
            fetch(event.request).then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for Unsplash/Picsum images
    if (url.hostname.includes('unsplash') || url.hostname.includes('picsum')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(event.request).then(cached => {
                    if (cached) return cached;
                    return fetch(event.request).then(response => {
                        if (response.ok) cache.put(event.request, response.clone());
                        return response;
                    }).catch(() => cached);
                })
            )
        );
        return;
    }

    // Default: cache-first for everything else
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
