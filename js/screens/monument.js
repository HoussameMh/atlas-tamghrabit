/* Screen 4 — Monument Detail (no back button, uses bottom nav) */
'use strict';

const MonumentScreen = {
  monument: null,
  city: null,
  map: null,

  render(monumentId) {
    const monument = AtlasData.getMonument(monumentId);
    if (!monument) return '<div style="padding:40px;text-align:center;">Monument introuvable</div>';
    const city = AtlasData.getCity(monument.cityId);
    this.monument = monument;
    this.city = city;

    const isFav = AtlasData.isFavorite(monument.id);
    const queries = monument.imageQueries || [monument.unsplashQuery, monument.unsplashQuery, monument.unsplashQuery];
    const primaryQ = queries[0] || monument.unsplashQuery;

    // Proximity photo cards via Components
    const proximityCards = monument.nearby.map((poi, pi) =>
      Components.proximityPhotoCard(poi, city.color, city.colorRgb, monument.id, pi)
    ).join('');

    // Gallery thumbnails
    const localImages = monument.localImages || (monument.localImage ? [monument.localImage] : []);
    const itemsCount = Math.max(queries.length, localImages.length);
    const galleryItems = [];
    for (let i = 0; i < itemsCount; i++) {
      const locImg = localImages[i];
      const q = queries[i] || primaryQ;
      const imgAttrs = locImg
        ? `src="${locImg}"`
        : `src="" data-unsplash-query="${q}"`;

      galleryItems.push(`
      <img class="gallery-thumb ${i === 0 ? 'active' : ''} ${locImg ? 'local-img' : ''}"
           id="gallery-thumb-${i}" 
           ${imgAttrs}
           data-fallback="https://picsum.photos/seed/${monument.id}g${i}/200/140"
           alt="${monument.name} photo ${i + 1}"
           onclick="MonumentScreen.setGalleryImage(${i})"
           style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>`);
    }
    const galleryThumbs = galleryItems.join('');
    return `
    <div class="monument-screen page-scrollable" id="monument-screen"
         style="--city-active:${city.color};--city-active-rgb:${city.colorRgb};--city-active-light:rgba(${city.colorRgb},0.12);">

      <!-- Hero — back button top-left, fav/share top-right -->
      <div class="monument-hero" id="monument-hero">
        <img class="monument-hero-img ${localImages[0] ? 'local-img' : ''}" id="monument-main-img" 
             ${localImages[0] ? `src="${localImages[0]}"` : `src="" data-unsplash-query="${primaryQ}"`}
             data-fallback="https://picsum.photos/seed/${monument.id}/800/500"
             alt="${monument.name}"
             style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>
        <div class="monument-hero-overlay"></div>
        <!-- Back button — floating top left -->
        <button class="back-btn hero-back-btn" onclick="App.back()" aria-label="Retour">
          ${Icons.back}
        </button>
        <!-- Action buttons — floating top right -->
        <div class="hero-action-btn">
          <button class="back-btn monument-fav-btn-hero ${isFav ? 'active' : ''}"
                  id="hero-fav-btn"
                  onclick="Components.toggleFavorite('${monument.id}', this)"
                  aria-label="Favoris">
            ${isFav ? Icons.heartFilled : Icons.heart}
          </button>
          <button class="back-btn" aria-label="Partager">${Icons.share}</button>
        </div>
        <div class="monument-hero-content">
          <div class="monument-hero-type">${monument.typeIcon} ${monument.type}</div>
          <div class="monument-hero-name">${monument.name}</div>
          <div class="monument-hero-arabic" lang="ar">${monument.nameAr}</div>
        </div>
      </div>

      <div class="monument-content">
        <div class="monument-section">
          <div class="monument-badges">
            <div class="info-badge">${Icons.clock} ${monument.yearDisplay}</div>
            <div class="info-badge" style="background:rgba(${city.colorRgb},0.10);color:${city.color};">🏙️ ${city.name}</div>
            ${monument.height ? `<div class="info-badge">📐 ${monument.height}</div>` : ''}
          </div>
        </div>

        <div class="monument-section">
          <h3>Histoire & Patrimoine</h3>
          <div class="expandable-text collapsed" id="monument-desc">
            <p class="monument-desc">${monument.description}</p>
          </div>
          <button class="expand-btn" id="expand-btn" onclick="MonumentScreen.toggleDesc()">
            Lire plus ${Icons.chevronDown}
          </button>
        </div>

        <div class="monument-section" style="padding:0;">
          <div class="section-header" style="padding:0 var(--space-5);margin-bottom:var(--space-3);">
            <h3 style="margin:0;">Galerie Photos</h3>
          </div>
          <div class="photo-gallery" id="photo-gallery">${galleryThumbs}</div>
        </div>

        <div class="monument-section">
          <h3>Localisation</h3>
          <div class="map-preview">
            <div id="monument-leaflet-map" style="height:160px;border-radius:var(--radius-lg);"></div>
          </div>
          <div style="margin-top:var(--space-2);">
            <span style="font-size:var(--text-xs);color:var(--color-text-muted);">
              📍 ${monument.coords.lat.toFixed(4)}° N, ${Math.abs(monument.coords.lng).toFixed(4)}° O
            </span>
          </div>
        </div>

        <div class="monument-section">
          <h3>À Proximité</h3>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);" id="proximity-list">
            ${proximityCards}
          </div>
        </div>
      </div>
      <!-- Extra space so content doesn't hide behind fixed bottom nav -->
      <div style="height:calc(var(--nav-height, 64px) + var(--safe-bottom, 0px) + 24px);"></div>
    </div>`;
  },

  init() {
    const container = document.getElementById('monument-screen');
    if (container) UnsplashService.loadAllInContainer(container);
    setTimeout(() => this.initMap(), 350);
  },

  destroy() {
    if (this.map) { this.map.remove(); this.map = null; }
  },

  initMap() {
    const el = document.getElementById('monument-leaflet-map');
    if (!el || !this.monument) return;
    if (this.map) { this.map.remove(); this.map = null; }

    const { lat, lng } = this.monument.coords;
    const color = this.city.color;

    this.map = L.map('monument-leaflet-map', {
      zoomControl: false, scrollWheelZoom: false, dragging: false, doubleClickZoom: false,
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(this.map);

    L.marker([lat, lng], {
      icon: L.divIcon({
        html: `<div style="width:36px;height:44px;"><svg viewBox="0 0 36 44" fill="${color}" xmlns="http://www.w3.org/2000/svg"><filter id="msd"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/></filter><path d="M18 0C8.06 0 0 8.06 0 18c0 12.42 18 26 18 26S36 30.42 36 18C36 8.06 27.94 0 18 0z" filter="url(#msd)"/><circle cx="18" cy="18" r="8" fill="white" opacity="0.9"/></svg></div>`,
        iconSize: [36, 44], iconAnchor: [18, 44], className: '',
      }),
    }).addTo(this.map);
  },

  async setGalleryImage(index) {
    const queries = this.monument.imageQueries || [this.monument.unsplashQuery];
    const localImages = this.monument.localImages || (this.monument.localImage ? [this.monument.localImage] : []);
    const query = queries[index] || queries[0];
    const mainImg = document.getElementById('monument-main-img');
    const thumbs = document.querySelectorAll('.gallery-thumb');

    if (mainImg) {
      mainImg.style.opacity = '0.3';
      const locImg = localImages[index];
      if (locImg) {
        mainImg.src = locImg;
        mainImg.removeAttribute('data-unsplash-query');
        mainImg.onload = () => mainImg.style.opacity = '1';
      } else {
        await UnsplashService.loadImg(mainImg, query, 'https://picsum.photos/seed/' + this.monument.id + index + '/800/500');
        mainImg.style.opacity = '1';
      }
    }
    thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
  },

  toggleDesc() {
    const desc = document.getElementById('monument-desc');
    const btn = document.getElementById('expand-btn');
    if (!desc) return;
    const collapsed = desc.classList.contains('collapsed');
    desc.classList.toggle('collapsed', !collapsed);
    desc.classList.toggle('expanded', collapsed);
    if (btn) btn.innerHTML = (collapsed ? 'Lire moins ' : 'Lire plus ') + Icons.chevronDown;
  },
};
