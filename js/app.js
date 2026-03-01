/* Atlas Tamghrabit — App Entry Point */
'use strict';

const App = {
    init() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW:', err));
        }

        // Boot: show splash
        Router.navigate('splash');
    },

    navigate(screen, param) {
        Router.navigate(screen, param);
    },

    back() {
        Router.back();
    },

    enterApp() {
        // Transition from splash to home
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            splash.style.opacity = '0';
            splash.style.transform = 'scale(1.04)';
        }
        setTimeout(() => Router.navigate('home'), 600);
    },

    refreshFavoritesBadge() {
        // Could show badge count on favorites tab
        const favCount = AtlasData.favorites.size;
        const favTab = document.querySelector('[data-tab="favorites"]');
        if (favTab) {
            // visual pulse on the favorites tab
            favTab.style.transform = 'scale(1.2)';
            setTimeout(() => { favTab.style.transform = ''; favTab.style.transition = 'transform 0.3s ease'; }, 200);
        }
    },
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
