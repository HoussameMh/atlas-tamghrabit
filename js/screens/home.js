/* Screen 2 — Home (with Unsplash images) */
'use strict';

const HomeScreen = {
  currentHeroIndex: 0,
  heroTimer: null,

  render() {
    const { heroPanoramas, cities } = AtlasData;
    const hero = heroPanoramas[0];

    return `
      <div class="home-screen page-scrollable" id="home-screen">
        <!-- Top bar -->
        <div class="home-top">
          ${Components.logo()}
          <button class="notification-btn" aria-label="Notifications">
            ${Icons.bell}
            <span class="notif-dot"></span>
          </button>
        </div>

        <!-- Search bar -->
        <div class="home-section" style="margin-bottom: var(--space-5);">
          <div class="search-bar">
            <input type="search" 
                   class="search-input" 
                   id="home-search"
                   placeholder="Rechercher une ville, un monument…"
                   aria-label="Recherche"
                   oninput="HomeScreen.onSearch(this.value)"/>
            <span class="search-icon">${Icons.search}</span>
          </div>
        </div>

        <!-- Hero panorama -->
        <div class="home-section" id="hero-section">
          <div class="hero-card" 
               id="home-hero-card"
               onclick="App.navigate('city', '${hero.cityId}')"
               role="button"
               aria-label="${hero.title}">
            <img class="hero-card-img" 
                 id="home-hero-img"
                 src=""
                 data-unsplash-query="${hero.unsplashQuery}"
                 data-fallback="https://picsum.photos/seed/hero/900/300"
                 alt="${hero.title}"
                 style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>
            <div class="hero-card-overlay" id="home-hero-overlay">
              <div class="hero-card-label" id="home-hero-label">${hero.label}</div>
              <div class="hero-card-title" id="home-hero-title">${hero.title}</div>
              <div class="hero-card-sub" id="home-hero-sub">${hero.sub}</div>
            </div>
          </div>
          <!-- Hero dots -->
          <div style="display:flex; justify-content:center; gap:6px; margin-top:10px;">
            ${heroPanoramas.map((_, i) => `
              <button onclick="HomeScreen.setHero(${i})" 
                      id="hero-dot-${i}"
                      aria-label="Panorama ${i + 1}"
                      style="width:${i === 0 ? '20' : '8'}px; height:8px; border-radius:4px; 
                             background:${i === 0 ? 'var(--city-marrakech)' : 'var(--color-border)'}; 
                             border:none; cursor:pointer; transition:all 0.3s ease;"></button>
            `).join('')}
          </div>
        </div>

        <!-- Cities section -->
        <div class="home-section home-section-cities">
          <div class="section-header">
            <div>
              <div class="section-subtitle">استكشف</div>
              <div class="section-title">Cités & Joyaux</div>
            </div>
            <button class="section-link" onclick="App.navigate('cities')">Voir tout →</button>
          </div>
          <div class="scroll-x" id="cities-scroll-container" style="display:flex; gap:var(--space-4); padding: var(--space-2) var(--space-5) var(--space-4);">
            ${cities.map(city => `
              <div class="city-card" 
                   id="city-card-${city.id}"
                   style="--city-card-rgb: ${city.colorRgb}; --city-card-color: ${city.color};"
                   onclick="App.navigate('city', '${city.id}')"
                   role="button"
                   aria-label="Découvrir ${city.name}">
                <div class="city-target-overlay"></div>
                <img class="city-card-img" 
                     src=""
                     data-unsplash-query="${city.unsplashQuery}"
                     data-fallback="https://picsum.photos/seed/${city.id}/400/300"
                     alt="${city.heroAlt}"
                     style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite; ${city.heroPosition ? `object-position: ${city.heroPosition};` : ''}"/>
                <div class="city-card-info">
                  <div class="city-card-arabic" lang="ar">${city.nameAr}</div>
                  <div class="city-card-name">${city.name}</div>
                  <div class="city-card-sub">${city.subtitle}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Zellige divider -->
        <div class="zellige-divider"></div>

        <!-- Monuments section -->
        <div class="home-section" style="margin-top: var(--space-6);">
          <div class="section-header">
            <div>
              <div class="section-subtitle" lang="ar">شهود التاريخ</div>
              <div class="section-title">Témoins de l'Histoire</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); padding:0 var(--space-5);" class="stagger-children">
            ${AtlasData.monuments.slice(0, 6).map(m => {
      const city = AtlasData.getCity(m.cityId);
      return Components.monumentCard(m, city, `App.navigate('monument', '${m.id}')`);
    }).join('')}
          </div>
        </div>

        <div style="height:var(--space-8);"></div>
      </div>`;
  },

  init() {
    // Load all Unsplash images
    const container = document.getElementById('home-screen');
    if (container) UnsplashService.loadAllInContainer(container);

    // Auto-rotate hero
    this.heroTimer = setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % AtlasData.heroPanoramas.length;
      this.setHero(this.currentHeroIndex);
    }, 6000);
  },

  destroy() {
    if (this.heroTimer) clearInterval(this.heroTimer);
  },

  async setHero(index) {
    this.currentHeroIndex = index;
    const panorama = AtlasData.heroPanoramas[index];
    const img = document.getElementById('home-hero-img');
    const label = document.getElementById('home-hero-label');
    const title = document.getElementById('home-hero-title');
    const sub = document.getElementById('home-hero-sub');
    const card = document.getElementById('home-hero-card');
    if (!img) return;

    // Update text overlays
    if (label) label.textContent = panorama.label;
    if (title) title.textContent = panorama.title;
    if (sub) sub.textContent = panorama.sub;
    if (card) card.setAttribute('onclick', `App.navigate('city', '${panorama.cityId}')`);

    // Fade and load new image
    img.style.opacity = '0.4';
    await UnsplashService.loadImg(img, panorama.unsplashQuery, `https://picsum.photos/seed/hero${index}/900/300`);

    // Update dots
    AtlasData.heroPanoramas.forEach((_, i) => {
      const dot = document.getElementById(`hero-dot-${i}`);
      if (dot) {
        dot.style.width = i === index ? '20px' : '8px';
        dot.style.background = i === index ? 'var(--city-marrakech)' : 'var(--color-border)';
      }
    });
  },

  onSearch(query) {
    if (query.length > 2) Components.toast(`🔍 Recherche: "${query}"`);
  },
};
