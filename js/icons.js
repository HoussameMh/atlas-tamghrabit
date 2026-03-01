/* ═══════════════════════════════
   ATLAS TAMGHRABIT — SVG Icons
   Pure SVG Moroccan motif icons
   ═══════════════════════════════ */

const Icons = {
  // Moroccan star/geometric logo mark
  starMark: `<svg viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="32,4 38,22 57,22 42,34 48,52 32,40 16,52 22,34 7,22 26,22" fill="currentColor" opacity="0.9"/>
    <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.6"/>
  </svg>`,

  // Moroccan arch (used in logo and splsh)
  arch: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 56 L8 28 C8 14 24 8 32 8 C40 8 56 14 56 28 L56 56 Z" stroke="currentColor" stroke-width="3" fill="none"/>
    <path d="M16 56 L16 30 C16 20 24 14 32 14 C40 14 48 20 48 30 L48 56 Z" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
    <line x1="4" y1="56" x2="60" y2="56" stroke="currentColor" stroke-width="3"/>
  </svg>`,

  // Back arrow
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>`,

  // Heart / favorite
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>`,
  heartFilled: `<svg viewBox="0 0 24 24" fill="#E2725B" stroke="#E2725B" stroke-width="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>`,

  // Share
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>`,

  // Search
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`,

  // Bell
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>`,

  // Map pin
  pin: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,

  // Mosque icon
  mosque: `<svg viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 2 L16 8 L14 10 L14 14 L18 14 L18 10 Z"/>
    <path d="M4 14 C4 10 8 8 12 8 L20 8 C24 8 28 10 28 14 L28 28 L4 28 Z"/>
    <rect x="10" y="20" width="12" height="8"/>
    <rect x="2" y="26" width="28" height="2"/>
  </svg>`,

  // Palace
  palace: `<svg viewBox="0 0 32 32" fill="currentColor">
    <rect x="2" y="20" width="28" height="10"/>
    <rect x="5" y="14" width="5" height="8"/>
    <rect x="13.5" y="12" width="5" height="10"/>
    <rect x="22" y="14" width="5" height="8"/>
    <rect x="4" y="18" width="7" height="2" opacity="0.5"/>
    <rect x="12.5" y="16" width="7" height="2" opacity="0.5"/>
    <rect x="21" y="18" width="7" height="2" opacity="0.5"/>
  </svg>`,

  // Ramparts/wall
  wall: `<svg viewBox="0 0 32 32" fill="currentColor">
    <rect x="2" y="16" width="28" height="14"/>
    <rect x="2" y="10" width="5" height="8"/>
    <rect x="10" y="10" width="5" height="8"/>
    <rect x="18" y="10" width="5" height="8"/>
    <rect x="26" y="10" width="4" height="8"/>
  </svg>`,

  // Market / souk
  souk: `<svg viewBox="0 0 32 32" fill="currentColor">
    <path d="M4 14 C4 8 16 4 16 4 C16 4 28 8 28 14 L28 16 L4 16 Z"/>
    <rect x="4" y="14" width="24" height="14"/>
    <rect x="11" y="18" width="10" height="10"/>
  </svg>`,

  // Star (rating)
  star: `<svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>`,

  // Clock / historical
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>`,

  // Navigate/expand
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>`,

  // Zellige/tile (artisanat)
  tile: `<svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="9" height="9" rx="1" opacity="0.8"/>
    <rect x="13" y="2" width="9" height="9" rx="1" opacity="0.6"/>
    <rect x="2" y="13" width="9" height="9" rx="1" opacity="0.6"/>
    <rect x="13" y="13" width="9" height="9" rx="1" opacity="0.8"/>
  </svg>`,
};
