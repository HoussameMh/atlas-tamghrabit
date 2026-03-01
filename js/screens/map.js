/* Screen 5 — Interactive Map (Unsplash for bottom sheet) */
'use strict';

const MapScreen = {
  map: null,
  markers: [],
  activeFilter: 'all',
  activeCity: null,

  filters: [
    { id: 'all', label: 'Tous' },
    { id: 'mosque', label: '🕌 Mosquées' },
    { id: 'palace', label: '🏛️ Palais' },
    { id: 'rampart', label: '🏰 Remparts' },
    { id: 'nature', label: '🌿 Nature' },
  ],

  render() {
    return `
      <div class="map-screen" id="map-screen"
           style="--city-active: var(--city-marrakech); --city-active-rgb: var(--city-marrakech-rgb); --city-active-light: var(--city-marrakech-light);">
        <div class="map-container" id="main-map-container">
          <div id="main-leaflet-map" style="width:100%; height:100%;"></div>
        </div>
        <div class="map-header">
          <div class="map-title text-display">Carte Patrimoniale</div>
          <div class="map-filters" role="group" aria-label="Filtres carte">
            ${this.filters.map(f => `
              <button class="map-filter-pill ${f.id === 'all' ? 'active' : ''}" 
                      id="filter-${f.id}"
                      onclick="MapScreen.applyFilter('${f.id}')"
                      aria-pressed="${f.id === 'all'}">
                ${f.label}
              </button>
            `).join('')}
          </div>
        </div>
        </div>
        <div class="map-city-sheet" id="map-city-sheet" onclick="event.stopPropagation()">
          <div class="sheet-handle"></div>
          <div class="map-city-sheet-inner" id="map-sheet-content"></div>
        </div>
      </div>`;
  },

  init() {
    setTimeout(() => this.initMap(), 200);
  },

  destroy() {
    if (this.map) { this.map.remove(); this.map = null; }
    this.markers = [];
  },

  initMap() {
    const container = document.getElementById('main-leaflet-map');
    if (!container) return;
    if (this.map) { this.map.remove(); this.map = null; }

    this.map = L.map('main-leaflet-map', { zoomControl: false, center: [31.8, -6.5], zoom: 6 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(this.map);
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.addMarkers();
    this.map.on('click', () => this.hideSheet());
  },

  addMarkers() {
    if (!this.map) return;
    this.markers.forEach(m => m.marker && m.marker.remove());
    this.markers = [];

    AtlasData.monuments.forEach(monument => {
      const city = AtlasData.getCity(monument.cityId);
      const { lat, lng } = monument.coords;
      const color = city.color;

      const markerHtml = `
        <div style="position:relative; width:40px; height:52px; cursor:pointer;" role="img" aria-label="${monument.name}">
          <div style="position:absolute; inset:-6px; border-radius:50%; background:${color}; opacity:0.2; animation:marker-pulse 2.5s ease-out infinite;"></div>
          <svg viewBox="0 0 40 52" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:52px;">
            <filter id="shadow-${monument.id}"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/></filter>
            <path d="M20 0C8.95 0 0 8.95 0 20c0 14.56 20 32 20 32S40 34.56 40 20C40 8.95 31.05 0 20 0z" filter="url(#shadow-${monument.id})"/>
            <circle cx="20" cy="20" r="10" fill="white" opacity="0.92"/>
            <text x="20" y="24" text-anchor="middle" font-size="11">${monument.typeIcon}</text>
          </svg>
        </div>`;

      const marker = L.marker([lat, lng], {
        icon: L.divIcon({ html: markerHtml, iconSize: [40, 52], iconAnchor: [20, 52], className: '' }),
      });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.showSheet(monument, city);
        this.map.setView([lat, lng], 13, { animate: true });
      });
      marker.addTo(this.map);
      this.markers.push({ monument, marker });
    });
  },

  showSheet(monument, city) {
    this.activeCity = city;
    const sheet = document.getElementById('map-city-sheet');
    const content = document.getElementById('map-sheet-content');
    if (!sheet || !content) return;

    content.innerHTML = `
      <div style="width:80px; height:80px; border-radius:var(--radius-lg); overflow:hidden; flex-shrink:0; position:relative; background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;">
        <img id="map-sheet-img"
             src=""
             data-unsplash-query="${monument.unsplashQuery}"
             data-fallback="https://picsum.photos/seed/${monument.id}/200/200"
             alt="${monument.name}"
             style="width:80px;height:80px;object-fit:cover;display:block;"/>
      </div>
      <div style="flex:1;">
        <div style="font-size:var(--text-xs); color:${city.color}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">
          ${monument.typeIcon} ${monument.type} · ${city.name}
        </div>
        </div>
        <div style="font-family:var(--font-display); font-size:var(--text-lg); font-weight:700; margin-bottom:var(--space-3);">${monument.name}</div>
        <button onclick="event.stopPropagation(); App.navigate('monument', '${monument.id}')" 
                style="display:inline-flex; align-items:center; gap:4px; padding:8px 16px; border-radius:var(--radius-full); background:${city.color}; color:white; font-size:var(--text-sm); font-weight:700; border:none; cursor:pointer;">
          Explorer →
        </button>
      </div>`;

    sheet.classList.add('visible');
    document.getElementById('map-screen').style.setProperty('--city-active', city.color);
    document.getElementById('map-screen').style.setProperty('--city-active-rgb', city.colorRgb);

    // Load the thumb image
    const imgEl = document.getElementById('map-sheet-img');
    if (imgEl) UnsplashService.loadImg(imgEl, monument.unsplashQuery, `https://picsum.photos/seed/${monument.id}/200/200`);
  },

  hideSheet() {
    const sheet = document.getElementById('map-city-sheet');
    if (sheet) sheet.classList.remove('visible');
  },

  applyFilter(filterId) {
    this.activeFilter = filterId;
    this.filters.forEach(f => {
      const pill = document.getElementById(`filter-${f.id}`);
      if (pill) { pill.classList.toggle('active', f.id === filterId); pill.setAttribute('aria-pressed', f.id === filterId); }
    });

    const typeMap = { all: null, mosque: 'Mosquée', palace: 'Palais', rampart: 'Remparts', nature: 'Site naturel' };
    const filterType = typeMap[filterId];

    this.markers.forEach(({ monument, marker }) => {
      const show = !filterType || monument.type.toLowerCase().includes(filterType.toLowerCase()) || monument.type === filterType;
      if (show) { if (!this.map.hasLayer(marker)) marker.addTo(this.map); }
      else { if (this.map.hasLayer(marker)) marker.remove(); }
    });
  },
};
