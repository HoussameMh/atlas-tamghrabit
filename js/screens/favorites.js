/* Screen 6 — Favorites (Unsplash) */
'use strict';

const FavoritesScreen = {
  render() {
    const favMonuments = AtlasData.getFavoriteMonuments();

    return `
      <div id="favorites-screen" class="page-scrollable" style="padding-top: calc(var(--safe-top) + 80px);">
        <div class="screen-topbar">
          <div>
            <div class="screen-topbar-title">Mes Favoris</div>
            <div class="screen-topbar-arabic" lang="ar">المفضلة</div>
          </div>
          <div style="font-size:var(--text-sm); color:var(--color-text-muted); font-weight:700;">
            ${favMonuments.length} lieu${favMonuments.length !== 1 ? 'x' : ''}
          </div>
        </div>

        <div style="padding: 0 var(--space-5);">
          ${favMonuments.length === 0 ? this.renderEmpty() : this.renderGrid(favMonuments)}
        </div>
        <div style="height:var(--space-8);"></div>
      </div>`;
  },

  renderEmpty() {
    return `
      <div class="favorites-empty">
        <div class="favorites-empty-arabic" lang="ar">لا مفضلات بعد</div>
        <div class="favorites-empty-icon float-ornament">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
        <div class="favorites-empty-title">Aucun favori</div>
        <p class="favorites-empty-sub">Ajoutez vos lieux préférés en appuyant sur ❤️ sur n'importe quel monument.</p>
        <button onclick="App.navigate('home')" 
                style="display:inline-flex; align-items:center; gap:6px; padding:12px 24px; border-radius:var(--radius-full); background:var(--color-text-primary); color:white; font-size:var(--text-sm); font-weight:700; margin-top:var(--space-2); cursor:pointer; border:none;">
          🏛️ Explorer les monuments
        </button>
      </div>`;
  },

  renderGrid(monuments) {
    return `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); margin-top:var(--space-4);" class="stagger-children">
        ${monuments.map(m => {
      const city = AtlasData.getCity(m.cityId);
      return Components.monumentCard(m, city, `App.navigate('monument', '${m.id}')`);
    }).join('')}
      </div>`;
  },

  init() {
    const container = document.getElementById('favorites-screen');
    if (container) UnsplashService.loadAllInContainer(container);
  },
  destroy() { },
};
