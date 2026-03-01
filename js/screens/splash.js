/* Screen 1 — Splash / Onboarding */
'use strict';

const SplashScreen = {
    render() {
        return `
      <div class="splash-screen" id="splash-screen">
        <!-- Zellige background pattern -->
        <svg class="splash-pattern" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="100%" height="100%" fill="url(#arabesque-pattern)"/>
        </svg>
        <!-- Animated particles -->
        <div id="splash-particles" aria-hidden="true"></div>
        <!-- Content -->
        <div class="splash-content logo-reveal">
          <!-- Emblem -->
          <div class="splash-emblem glow-pulse" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="white">
              <polygon points="32,4 38,22 57,22 42,34 48,52 32,40 16,52 22,34 7,22 26,22" opacity="0.9"/>
              <circle cx="32" cy="32" r="8" opacity="0.5"/>
            </svg>
          </div>
          <!-- Arabic title -->
          <div>
            <div class="splash-arabic" lang="ar" dir="rtl">أطلس تمغرابيت</div>
            <div class="splash-divider"></div>
          </div>
          <!-- Latin title -->
          <div>
            <div class="splash-title">Atlas Tamghrabit</div>
            <div class="splash-subtitle">Patrimoine Marocain</div>
          </div>
          <!-- CTA -->
          <button class="splash-cta cta-btn" id="splash-cta" onclick="App.enterApp()" aria-label="Explorer le patrimoine marocain">
            <span aria-hidden="true">✦</span> Explorer <span aria-hidden="true">✦</span>
          </button>
        </div>
      </div>`;
    },

    init() {
        this.spawnParticles();
        // Auto-advance after 8 seconds
        setTimeout(() => {
            if (document.getElementById('splash-screen')) {
                App.enterApp();
            }
        }, 8000);
    },

    spawnParticles() {
        const container = document.getElementById('splash-particles');
        if (!container) return;

        const shapes = ['✦', '✧', '◇', '◆', '⬡', '✺', '❋', '⊕'];
        const colors = ['#C9A84C', '#E2725B', '#A07C2F', '#E8C97A', '#D4A853'];

        for (let i = 0; i < 28; i++) {
            const el = document.createElement('div');
            el.className = 'particle';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const dx = (Math.random() - 0.5) * 120 + 'px';
            const dy = -(Math.random() * 160 + 40) + 'px';
            const rot = (Math.random() * 360) + 'deg';
            const dur = (Math.random() * 3 + 3) + 's';
            const delay = (Math.random() * 4) + 's';
            const size = Math.random() * 14 + 8;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            el.style.cssText = `
        left: ${x}%; top: ${y}%; 
        font-size: ${size}px; 
        color: ${color};
        --dx: ${dx}; --dy: ${dy}; --rot: ${rot};
        --dur: ${dur}; --delay: ${delay};
        animation-delay: ${delay};
      `;
            el.textContent = shape;
            container.appendChild(el);
        }
    },
};
