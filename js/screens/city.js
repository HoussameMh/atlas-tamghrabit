/* Screen 3 — City Page (with Gastronomie tab) */
'use strict';

const CityScreen = {
  city: null,
  activeTab: 'monuments',

  render(cityId) {
    const city = AtlasData.getCity(cityId);
    if (!city) return '<div style="padding:40px;text-align:center;">Ville introuvable</div>';
    this.city = city;
    this.activeTab = 'monuments';

    const monuments = AtlasData.getMonumentsByCity(cityId);
    const artList = AtlasData.artisanat[cityId] || [];
    const gastroList = AtlasData.getGastronomie(cityId);
    const gastroSubtitle = AtlasData.gastroSubtitles[cityId] || 'Saveurs du Maroc';

    const artCards = artList.map(item => Components.artisanatCard(item, city)).join('');
    const monCards = monuments.map(m =>
      Components.monumentCard(m, city, `App.navigate('monument', '${m.id}')`)
    ).join('');
    const foodCards = gastroList.map(dish => Components.foodCard(dish, city)).join('');

    return `
    <div class="city-screen page-scrollable" id="city-screen"
         style="--city-active:${city.color};--city-active-rgb:${city.colorRgb};--city-active-light:rgba(${city.colorRgb},0.12);">

      <div class="city-hero">
        <img class="city-hero-img" src=""
             data-unsplash-query="${city.unsplashQuery}"
             data-fallback="https://picsum.photos/seed/${city.id}/800/400"
             alt="${city.heroAlt}"
             style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite; ${city.heroPosition ? `object-position: ${city.heroPosition};` : ''}"/>
        <div class="city-hero-overlay"></div>
        <!-- Back button — floating top left over the hero -->
        <button class="back-btn hero-back-btn" onclick="App.back()" aria-label="Retour">
          ${Icons.back}
        </button>
        <div class="city-hero-content">
          <div class="city-hero-arabic" lang="ar">${city.nameAr}</div>
          <div class="city-hero-name">${city.name}</div>
          <div class="city-hero-coords">${city.coordsDisplay}</div>
        </div>
      </div>

      <div class="city-content">
        <div class="pill-tabs" id="city-tabs" style="margin-bottom:var(--space-6);">
          <button class="pill-tab active" id="tab-monuments"
                  onclick="CityScreen.switchTab('monuments')" aria-selected="true">🏛️ Monuments</button>
          <button class="pill-tab" id="tab-artisanat"
                  onclick="CityScreen.switchTab('artisanat')" aria-selected="false">🎨 Artisanat</button>
          <button class="pill-tab" id="tab-gastronomie"
                  onclick="CityScreen.switchTab('gastronomie')" aria-selected="false">🍽️ Gastronomie</button>
          <button class="pill-tab" id="tab-histoire"
                  onclick="CityScreen.switchTab('histoire')" aria-selected="false">📜 Histoire</button>
        </div>

        <!-- MONUMENTS TAB -->
        <div id="tab-content-monuments" class="city-section">
          <div class="section-header" style="margin-bottom:var(--space-4);">
            <div>
              <div class="section-subtitle" lang="ar">شهود التاريخ</div>
              <div class="section-title">Témoins de l'Histoire</div>
            </div>
          </div>
          <div class="city-monuments-grid stagger-children">${monCards}</div>
        </div>

        <!-- ARTISANAT TAB -->
        <div id="tab-content-artisanat" class="city-section hidden">
          <div class="section-header" style="margin-bottom:var(--space-4);">
            <div>
              <div class="section-subtitle" lang="ar">الحرف التقليدية</div>
              <div class="section-title">Artisanat Traditionnel</div>
            </div>
          </div>
          <div class="city-artisanat-scroll">${artCards}</div>
          <p style="padding:var(--space-3) var(--space-5) 0;font-size:var(--text-xs);color:var(--color-text-muted);text-align:center;">
            👆 Appuyez sur une carte pour en savoir plus
          </p>
        </div>

        <!-- GASTRONOMIE TAB -->
        <div id="tab-content-gastronomie" class="city-section hidden">
          <div class="section-header" style="margin-bottom:var(--space-2);">
            <div>
              <div class="section-subtitle" lang="ar">المطبخ المغربي</div>
              <div class="section-title">🍽️ Gastronomie</div>
            </div>
          </div>
          <p style="padding:0 var(--space-5);margin-bottom:var(--space-5);font-size:var(--text-sm);color:var(--city-active);font-style:italic;font-weight:600;">
            ${gastroSubtitle}
          </p>
          <div class="city-food-grid" id="city-food-grid">${foodCards}</div>
        </div>

        <!-- HISTOIRE TAB -->
        <div id="tab-content-histoire" class="city-section hidden">
          <div style="padding:0 var(--space-5);">
            <div style="background:white;border-radius:var(--radius-lg);padding:var(--space-6);box-shadow:var(--shadow-sm);border:1px solid var(--color-border);">
              <p class="monument-desc" style="line-height:1.9;margin-bottom:var(--space-4);">${city.intro}</p>
              <div style="display:flex;flex-wrap:wrap;gap:var(--space-3);margin-top:var(--space-4);">
                <div class="info-badge">📅 Fondée en ${city.founded}</div>
                <div class="info-badge">👥 ${city.population} hab.</div>
                <div class="info-badge">🗺️ ${city.region}</div>
              </div>
            </div>
            
            ${city.videoId ? `
            <div class="video-container" style="margin-top: 48px; background: rgba(${city.colorRgb}, 0.05); border-left: 4px solid ${city.color}; padding: 32px; border-radius: 16px;">
              <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; margin-top: 0; margin-bottom: 8px; color: #1A1208;">🎬 Découvrez l'Histoire en Vidéo</h3>
              <p style="margin-top: 0; margin-bottom: 24px; color: #6B5744;">${city.videoTitle}</p>
            
              <div style="position: relative; padding-bottom: 56.25%; height: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(26,18,8,0.15);">
                <iframe
                  src="https://www.youtube.com/embed/${city.videoId}?rel=0&modestbranding=1"
                  title="${city.videoTitle}"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>
            
              <p class="video-caption" style="margin-top: 16px; margin-bottom: 0; font-size: 12px; color: #A89080; text-align: right;">
                Source : Documentaire YouTube
              </p>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      <div style="height:calc(var(--nav-height, 64px) + var(--safe-bottom, 0px) + 24px);"></div>
    </div>`;
  },

  init(cityId) {
    const container = document.getElementById('city-screen');
    if (container) UnsplashService.loadAllInContainer(container);
  },

  destroy() {
    ['artisanat-modal', 'artisanat-backdrop'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
  },

  switchTab(tab) {
    ['monuments', 'artisanat', 'gastronomie', 'histoire'].forEach(t => {
      const content = document.getElementById('tab-content-' + t);
      const btn = document.getElementById('tab-' + t);
      if (content) content.classList.add('hidden');
      if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-selected', 'false'); }
    });
    const activeContent = document.getElementById('tab-content-' + tab);
    const activeBtn = document.getElementById('tab-' + tab);
    if (activeContent) {
      activeContent.classList.remove('hidden');
      UnsplashService.loadAllInContainer(activeContent);
    }
    if (activeBtn) { activeBtn.classList.add('active'); activeBtn.setAttribute('aria-selected', 'true'); }
    this.activeTab = tab;
  },
};
