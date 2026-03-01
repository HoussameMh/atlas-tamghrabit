/* Atlas Tamghrabit — Unsplash Image Service */
'use strict';

const UnsplashService = (() => {
    const KEY = 'E1mQ4FkiEx7jmxifVkvP5BM-SW8CsZ_jRaYQChFilzI';
    const BASE = 'https://api.unsplash.com/search/photos';
    const cache = new Map();
    const pending = new Map();
    // Versioned prefix — change to bust stale localStorage entries
    const LSPREFIX = 'atlas_img_v5_';

    // Purge any old unversioned entries on startup
    (function purgeOldCache() {
        try {
            const toRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('atlas_img_') && !k.startsWith(LSPREFIX)) {
                    toRemove.push(k);
                }
            }
            toRemove.forEach(k => localStorage.removeItem(k));
        } catch (_) { }
    })();

    function fromStorage(query) {
        try {
            const entry = localStorage.getItem(LSPREFIX + query);
            if (!entry) return null;
            const { url, ts } = JSON.parse(entry);
            if (Date.now() - ts < 86400000) return url;
            localStorage.removeItem(LSPREFIX + query);
        } catch (_) { }
        return null;
    }

    function toStorage(query, url) {
        try {
            localStorage.setItem(LSPREFIX + query, JSON.stringify({ url, ts: Date.now() }));
        } catch (_) { }
    }

    async function fetchPhoto(query) {
        if (!query) return null;
        if (cache.has(query)) return cache.get(query);
        const stored = fromStorage(query);
        if (stored) { cache.set(query, stored); return stored; }
        if (pending.has(query)) return pending.get(query);

        const promise = fetch(
            `${BASE}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            { headers: { Authorization: `Client-ID ${KEY}` } }
        )
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const url = data?.results?.[0]?.urls?.regular || null;
                if (url) { cache.set(query, url); toStorage(query, url); }
                pending.delete(query);
                return url;
            })
            .catch(err => {
                console.warn(`[Unsplash] failed for "${query}":`, err);
                pending.delete(query);
                return null;
            });

        pending.set(query, promise);
        return promise;
    }

    async function loadImg(imgEl, query, fallback = null) {
        if (!imgEl || !query) {
            if (imgEl && fallback) imgEl.src = fallback;
            return;
        }
        imgEl.style.background = 'linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%)';
        imgEl.style.backgroundSize = '200% 100%';
        imgEl.style.animation = 'skeleton-shimmer 1.5s infinite';

        const url = await fetchPhoto(query);
        if (url) {
            const tmp = new Image();
            tmp.onload = () => {
                imgEl.src = url;
                imgEl.style.background = '';
                imgEl.style.animation = '';
                imgEl.style.backgroundSize = '';
                imgEl.style.opacity = '0';
                requestAnimationFrame(() => {
                    imgEl.style.transition = 'opacity 0.5s ease';
                    imgEl.style.opacity = '1';
                });
            };
            tmp.src = url;
        } else if (fallback) {
            imgEl.src = fallback;
            imgEl.style.background = '';
            imgEl.style.animation = '';
        }
    }

    async function loadAllInContainer(container) {
        const imgs = container
            ? container.querySelectorAll('[data-unsplash-query]')
            : document.querySelectorAll('[data-unsplash-query]');
        const tasks = [];
        imgs.forEach(img => {
            const query = img.getAttribute('data-unsplash-query');
            if (query) tasks.push(loadImg(img, query, img.getAttribute('data-fallback')));
        });
        await Promise.allSettled(tasks);
    }

    return { fetchPhoto, loadImg, loadAllInContainer };
})();
