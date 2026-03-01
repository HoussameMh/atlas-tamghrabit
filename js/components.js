/* Atlas Tamghrabit — Reusable Component Builders */
'use strict';

const Components = {

  // ── City Card ──
  cityCard(city, onClick) {
    return `
      <div class="city-card" 
           style="--city-card-rgb: ${city.colorRgb};"
           onclick="${onClick}"
           role="button"
           aria-label="Découvrir ${city.name}">
        <img class="city-card-img" 
             src="${city.cover}" 
             alt="${city.heroAlt}"
             loading="lazy"
             onerror="this.src='https://picsum.photos/seed/${city.id}/400/300'"/>
        <div class="city-card-info">
          <div class="city-card-arabic">${city.nameAr}</div>
          <div class="city-card-name">${city.name}</div>
          <div class="city-card-sub">${city.subtitle}</div>
        </div>
      </div>`;
  },

  // ── Food Card (Gastronomie) ──
  foodCard(dish, city) {
    const q = dish.unsplashQuery || dish.nom + ' Maroc plat traditionnel';
    const fallbackStyle = `background:linear-gradient(135deg,rgba(${city.colorRgb},0.85) 0%,rgba(${city.colorRgb},0.55) 100%);display:flex;align-items:center;justify-content:center;font-size:2.5rem;`;
    // If dish has a local asset, use it directly — no Unsplash needed
    const imgAttrs = dish.localImage
      ? `src="${dish.localImage}" loading="lazy"`
      : `src="" data-unsplash-query="${q}" data-fallback="" style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"`;
    return `
      <div class="food-card" role="img" aria-label="${dish.nom}">
        <div class="food-card-img-wrap">
          <img class="food-card-img ${dish.localImage ? 'local-img' : ''}"
               ${imgAttrs}
               alt="${dish.nom}"
               onerror="this.style.cssText='${fallbackStyle}width:100%;height:200px;';this.alt='🥘';"/>
          <div class="food-card-img-overlay" style="background:linear-gradient(transparent 50%,rgba(${city.colorRgb},0.35) 100%);"></div>
        </div>
        <div class="food-card-body">
          <div class="food-card-badge" style="background:rgba(${city.colorRgb},0.12);color:${city.color};">🏷️ Spécialité Locale</div>
          <div class="food-card-name">${dish.nom}</div>
          <div class="food-card-desc">${dish.description}</div>
        </div>
      </div>`;
  },

  // ── Monument Card (grid) ──
  monumentCard(monument, city, onClick) {
    const isFav = AtlasData.isFavorite(monument.id);
    const query = monument.unsplashQuery || monument.imageQueries?.[0] || `${monument.name} Morocco`;
    return `
      <div class="monument-card" 
           style="--city-active: ${city.color}; --city-active-rgb: ${city.colorRgb}; --city-active-light: rgba(${city.colorRgb}, 0.12);"
           onclick="${onClick}"
           role="button"
           aria-label="${monument.name}">
        <div class="monument-card-img-wrap" style="position:relative;">
          <img class="monument-card-img ${monument.localImage ? 'local-img' : ''}" 
               ${monument.localImage ? `src="${monument.localImage}"` : `src="" data-unsplash-query="${query}"`}
               data-fallback="https://picsum.photos/seed/${monument.id}/400/300"
               alt="${monument.name}"
               loading="lazy"
               style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>
          <button class="monument-fav-btn ${isFav ? 'active' : ''}" 
                  onclick="event.stopPropagation(); Components.toggleFavorite('${monument.id}', this)"
                  aria-label="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
            ${isFav ? Icons.heartFilled : Icons.heart}
          </button>
        </div>
        <div class="monument-card-body">
          <div class="monument-card-type">${monument.typeIcon} ${monument.type}</div>
          <div class="monument-card-name">${monument.name}</div>
        </div>
      </div>`;
  },

  // ── Artisanat Card (with modal onclick) ──
  artisanatCard(item, city) {
    const q = item.unsplashQuery || item.name + ' Morocco artisanat';
    const cId = city ? city.id : 'default';
    const cColor = city ? city.color : '#C9A84C';
    return `
      <div class="artisanat-card"
           onclick="Components.openArtisanatModal('${item.id}', '${cId}')"
           style="cursor:pointer;position:relative;flex:0 0 170px;">
        <img class="artisanat-card-img ${item.localImage ? 'local-img' : ''}" 
             ${item.localImage ? `src="${item.localImage}"` : `src="" data-unsplash-query="${q}"`}
             data-fallback="https://picsum.photos/seed/${item.id}/300/200"
             alt="${item.name}"
             style="background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>
        <div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.92);border-radius:20px;padding:3px 8px;font-size:10px;font-weight:700;color:${cColor};pointer-events:none;letter-spacing:0.3px;box-shadow:0 1px 4px rgba(0,0,0,0.1);">ℹ️ Détails</div>
        <div class="artisanat-card-body">
          <div class="artisanat-card-title">${item.name}</div>
          <div class="artisanat-card-sub">${item.sub}</div>
        </div>
      </div>`;
  },

  // ── Proximity Photo Card ──
  proximityPhotoCard(poi, cityColor, cityColorRgb, monumentId, pi) {
    const q = poi.imgQuery || poi.type + ' Morocco historic';
    return `
      <div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.07);display:flex;min-height:90px;">
        <div style="width:90px;flex-shrink:0;position:relative;overflow:hidden;">
          <img id="poi-img-${monumentId}-${pi}"
               class="${poi.localImg ? 'local-img' : ''}"
               ${poi.localImg ? `src="${poi.localImg}"` : `src="" data-unsplash-query="${q}"`}
               data-fallback="https://picsum.photos/seed/${monumentId}p${pi}/180/180"
               alt="${poi.name}"
               style="width:90px;height:90px;object-fit:cover;display:block;background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>
          <div style="position:absolute;inset:0;background:linear-gradient(transparent 45%,rgba(${cityColorRgb},0.42) 100%);"></div>
          <div style="position:absolute;bottom:5px;left:0;right:0;text-align:center;font-size:17px;line-height:1;">${poi.icon}</div>
        </div>
        <div style="padding:14px 16px;flex:1;display:flex;flex-direction:column;justify-content:center;gap:3px;">
          <div style="font-size:0.9375rem;font-weight:700;color:#1A1208;">${poi.name}</div>
          <div style="font-size:0.72rem;color:#A89080;text-transform:uppercase;letter-spacing:0.5px;">${poi.type}</div>
          <div style="font-size:0.875rem;font-weight:700;color:${cityColor};margin-top:3px;">📍 ${poi.dist}</div>
        </div>
      </div>`;
  },

  // ── Artisanat Modal ──
  openArtisanatModal(itemId, cityId) {
    const city = AtlasData.getCity(cityId);
    const artList = AtlasData.artisanat[cityId] || [];
    const item = artList.find(function (a) { return a.id === itemId; });
    if (!item || !city) return;

    ['artisanat-modal', 'artisanat-backdrop'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    const bd = document.createElement('div');
    bd.id = 'artisanat-backdrop';
    bd.className = 'bottom-sheet-backdrop';
    bd.onclick = function () { Components.closeArtisanatModal(); };
    document.getElementById('app').appendChild(bd);

    const modal = document.createElement('div');
    modal.id = 'artisanat-modal';
    modal.className = 'bottom-sheet';
    modal.setAttribute('role', 'dialog');
    modal.style.setProperty('--city-active', city.color);
    modal.style.setProperty('--city-active-rgb', city.colorRgb);
    modal.innerHTML =
      '<div class="sheet-handle"></div>' +
      '<div style="margin:0 16px 20px;border-radius:16px;overflow:hidden;height:220px;position:relative;box-shadow:0 8px 32px rgba(0,0,0,0.15);">' +
      '<img id="art-modal-img" src="' + (item.localImage || '') + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;display:block;background:linear-gradient(90deg,#F0E8DF 25%,#FAF4EE 50%,#F0E8DF 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;"/>' +
      '<div style="position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(' + city.colorRgb + ',0.75) 100%);"></div>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;padding:16px;">' +
      '<div style="font-family:\'Playfair Display\',serif;font-size:1.25rem;font-weight:700;color:white;">' + item.name + '</div>' +
      '<div style="font-size:0.75rem;color:rgba(255,255,255,0.82);text-transform:uppercase;letter-spacing:1px;margin-top:2px;">' + item.sub + '</div>' +
      '</div>' +
      '<button onclick="Components.closeArtisanatModal()" style="position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,250,245,0.94);border:none;cursor:pointer;font-size:15px;line-height:32px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.18);" aria-label="Fermer">✕</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 16px;">' +
      '<span style="padding:6px 14px;border-radius:99px;background:rgba(' + city.colorRgb + ',0.12);color:' + city.color + ';font-size:0.875rem;font-weight:700;">🏙️ ' + city.name + '</span>' +
      '<span style="padding:6px 14px;border-radius:99px;background:rgba(107,87,68,0.08);color:#6B5744;font-size:0.875rem;font-weight:700;">🎨 Artisanat</span>' +
      '</div>' +
      '<div style="padding:0 16px 20px;">' +
      '<div style="font-family:\'Playfair Display\',serif;font-size:1.125rem;font-weight:700;margin-bottom:12px;color:#1A1208;">Savoir-faire ancestral</div>' +
      '<p style="font-size:1rem;color:#6B5744;line-height:1.85;margin:0;">' + (item.description || item.sub) + '</p>' +
      '</div>' +
      '<div style="height:2px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:0 16px 16px;opacity:0.4;"></div>' +
      '<div style="text-align:center;padding:0 16px 32px;">' +
      '<div style="font-family:\'Noto Naskh Arabic\',serif;font-size:1.5rem;color:#C9A84C;direction:rtl;margin-bottom:8px;">الصنعة التقليدية المغربية</div>' +
      '<div style="font-size:0.75rem;color:#A89080;letter-spacing:1px;text-transform:uppercase;">Artisanat du Maroc</div>' +
      '</div>';

    document.getElementById('app').appendChild(modal);

    const imgEl = document.getElementById('art-modal-img');
    if (imgEl) {
      if (item.localImage) {
        imgEl.src = item.localImage;
      } else if (item.unsplashQuery) {
        UnsplashService.loadImg(imgEl, item.unsplashQuery, 'https://picsum.photos/seed/' + itemId + '/400/300');
      }
    }
  },

  closeArtisanatModal() {
    const modal = document.getElementById('artisanat-modal');
    const bd = document.getElementById('artisanat-backdrop');
    if (modal) {
      modal.style.cssText += ';transition:transform 0.3s ease;transform:translateX(-50%) translateY(100%);';
      setTimeout(function () { if (modal.parentNode) modal.parentNode.removeChild(modal); }, 320);
    }
    if (bd) {
      bd.style.cssText += ';transition:opacity 0.3s ease;opacity:0;';
      setTimeout(function () { if (bd.parentNode) bd.parentNode.removeChild(bd); }, 320);
    }
  },

  // ── Proximity Item (legacy, kept for back compat) ──
  proximityItem(poi) {
    return `
      <div class="proximity-item">
        <div class="proximity-icon">${poi.icon}</div>
        <div class="proximity-info">
          <div class="proximity-name">${poi.name}</div>
          <div class="proximity-type">${poi.type}</div>
        </div>
        <div class="proximity-dist">${poi.dist}</div>
      </div>`;
  },

  // ── Skeleton cards ──
  skeletonCard(height = 200) {
    return `<div class="skeleton" style="height:${height}px; border-radius: var(--radius-lg);"></div>`;
  },

  // ── Toggle favorite helper ──
  toggleFavorite(monumentId, btn) {
    const isNowFav = AtlasData.toggleFavorite(monumentId);
    btn.classList.toggle('active', isNowFav);
    btn.innerHTML = isNowFav ? Icons.heartFilled : Icons.heart;
    btn.classList.add('heartbeat');
    setTimeout(() => btn.classList.remove('heartbeat'), 600);
    if (document.querySelector('[data-tab="favorites"]')) App.refreshFavoritesBadge();
    Components.toast(isNowFav ? '❤️ Ajouté aux favoris' : '🤍 Retiré des favoris');
    document.querySelectorAll(`.monument-fav-btn[onclick*="${monumentId}"]`).forEach(b => {
      if (b !== btn) { b.classList.toggle('active', isNowFav); b.innerHTML = isNowFav ? Icons.heartFilled : Icons.heart; }
    });
  },

  // ── Toast ──
  toast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.getElementById('app').appendChild(t);
    setTimeout(() => t.remove(), 2600);
  },

  // ── Zellige SVG background ──
  zelligeBg(opacity = 0.4) {
    return `<svg class="zellige-bg" style="opacity:${opacity};" preserveAspectRatio="xMidYMid slice">
      <rect width="100%" height="100%" fill="url(#zellige-pattern)"/>
    </svg>`;
  },

  // ── App Logo ──
  logo() {
    return `
      <div class="app-logo">
        <div class="logo-mark" aria-hidden="true" style="background: transparent; display: flex; align-items: center; justify-content: center;">
          <img 
            src="/assets/images/morocco-map.png"
            alt="Maroc"
            style="width: 36px; height: 44px; filter: brightness(0) saturate(100%) invert(73%) sepia(45%) saturate(456%) hue-rotate(5deg) brightness(95%) contrast(90%); object-fit: contain;"
          />
        </div>
        <div class="logo-text">Atlas <span>Tamghrabit</span></div>
      </div>`;
  },
};
