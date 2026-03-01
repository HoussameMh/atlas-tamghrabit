/* Screen — Cities List (Unsplash) */
'use strict';

const CitiesScreen = {
  render() {
    return `
      <div id="cities-screen" class="page-scrollable" style="padding-top: calc(var(--safe-top) + 80px);">
        <div class="screen-topbar">
          <div>
            <div class="screen-topbar-title">Villes Impériales</div>
            <div class="screen-topbar-arabic" lang="ar">المدن العريقة</div>
          </div>
          ${Components.logo()}
        </div>

        <div style="padding: 0 var(--space-5);">
          <div class="cities-grid stagger-children">
            ${AtlasData.cities.map(city => `
              <div class="city-card" 
                   style="flex:none; width:100%; height:220px; --city-card-rgb: ${city.colorRgb};"
                   onclick="App.navigate('city', '${city.id}')"
                   role="button"
                   aria-label="Découvrir ${city.name}">
                <img class="city-card-img" 
                     src=""
                     data-unsplash-query="${city.unsplashQuery}"
                     data-fallback="https://picsum.photos/seed/${city.id}/400/300"
                     alt="${city.heroAlt}"
                     style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>
                <div class="city-card-info">
                  <div class="city-card-arabic" lang="ar">${city.nameAr}</div>
                  <div class="city-card-name">${city.name}</div>
                  <div class="city-card-sub">${city.subtitle}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="height:var(--space-8);"></div>
      </div>`;
  },
  init() {
    const container = document.getElementById('cities-screen');
    if (container) UnsplashService.loadAllInContainer(container);
  },
  destroy() { },
};
