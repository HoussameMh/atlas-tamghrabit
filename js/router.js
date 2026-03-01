/* Atlas Tamghrabit — Router */
'use strict';

const Router = {
    routes: {
        splash: () => SplashScreen,
        home: () => HomeScreen,
        cities: () => CitiesScreen,
        city: () => CityScreen,
        monument: () => MonumentScreen,
        map: () => MapScreen,
        favorites: () => FavoritesScreen,
        quiz: () => QuizScreen,
    },

    current: null,
    currentParam: null,
    history: [],

    // Map screen → which nav tab should be highlighted
    navTabMap: {
        home: 'home',
        cities: 'cities',
        city: 'cities',      // city detail → highlight Villes
        monument: 'cities',  // monument detail → highlight Villes
        map: 'map',
        favorites: 'favorites',
        quiz: 'quiz',
    },

    navigate(screenName, param = null) {
        // Destroy current screen first
        if (this.current && this.current.destroy) {
            this.current.destroy();
        }

        // Save previous screen to history
        const prevScreen = this.currentScreen;
        const prevParam = this.currentParam;
        if (prevScreen && prevScreen !== 'splash' && prevScreen !== screenName) {
            this.history.push({ screen: prevScreen, param: prevParam });
        }

        this.currentScreen = screenName;
        this.currentParam = param;

        const screenFn = this.routes[screenName];
        if (!screenFn) { console.warn(`Unknown screen: ${screenName}`); return; }
        const screen = screenFn();
        this.current = screen;

        // Render HTML
        const html = screen.render(param);
        const container = document.getElementById('screen-container');
        const isSplash = screenName === 'splash';

        // Remove old screen
        const old = container.firstElementChild;
        if (old && !isSplash) {
            old.classList.add('screen-exit');
            setTimeout(() => { if (old.parentNode) old.remove(); }, 160);
        } else if (old) {
            old.remove();
        }

        // Mount new screen
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative; min-height:100dvh;';
        wrapper.innerHTML = html;
        if (!isSplash) wrapper.classList.add('screen-enter');

        const mountDelay = isSplash ? 0 : 90;
        setTimeout(() => container.appendChild(wrapper), mountDelay);

        // Show nav on all screens except splash
        const nav = document.getElementById('bottom-nav');
        if (nav) {
            nav.classList.toggle('hidden', isSplash);

            // Sync active nav tab
            const activeTab = this.navTabMap[screenName] || 'home';
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === activeTab);
            });
        }

        // Init screen after DOM settles
        setTimeout(() => {
            if (screen.init) screen.init(param);
        }, mountDelay + 120);
    },

    back() {
        if (this.history.length > 0) {
            const { screen, param } = this.history.pop();
            // Don't push to history again when going back
            this.current?.destroy?.();
            this.currentScreen = screen;
            this.currentParam = param;

            const screenFn = this.routes[screen];
            if (!screenFn) return;
            const scr = screenFn();
            this.current = scr;

            const html = scr.render(param);
            const container = document.getElementById('screen-container');
            const old = container.firstElementChild;
            if (old) { old.classList.add('screen-exit'); setTimeout(() => old.remove(), 160); }

            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position:relative; min-height:100dvh;';
            wrapper.innerHTML = html;
            wrapper.classList.add('screen-enter');
            setTimeout(() => container.appendChild(wrapper), 90);

            // Update nav
            const nav = document.getElementById('bottom-nav');
            if (nav) {
                nav.classList.remove('hidden');
                const activeTab = this.navTabMap[screen] || 'home';
                document.querySelectorAll('.nav-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.tab === activeTab);
                });
            }

            setTimeout(() => { if (scr.init) scr.init(param); }, 210);
        } else {
            this.navigate('home');
        }
    },
};
