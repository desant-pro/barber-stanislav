// ========================================
// THEME TOGGLE
// ========================================
(function () {
  const html = document.documentElement;
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);

  // Inject toggle button
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('data-theme-toggle', '');
  toggle.setAttribute('aria-label', 'Переключить тему');
  toggle.innerHTML = theme === 'dark'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  document.body.appendChild(toggle);

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', `Переключить на ${theme === 'dark' ? 'светлую' : 'тёмную'} тему`);
  });
})();

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 60);
        header.classList.toggle('hidden', y > lastY + 10 && y > 300);
        if (y < lastY || y < 300) header.classList.remove('hidden');
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ========================================
// BURGER / MOBILE MENU
// ========================================
(function () {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  let open = false;
  burger.addEventListener('click', () => {
    open = !open;
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      burger.classList.remove('open');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      open = false;
      burger.classList.remove('open');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

// ========================================
// ACTIVE NAV LINKS (INTERSECTION)
// ========================================
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--color-text)'
              : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => io.observe(s));
})();

// ========================================
// HERO COUNTER ANIMATION
// ========================================
(function () {
  const counters = document.querySelectorAll('.meta-num');
  if (!counters.length) return;

  const animate = (el, target, suffix) => {
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString('ru') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const text = el.textContent;
        if (text.includes('500')) animate(el, 1500, '+');
        if (text.includes('5.0')) { el.textContent = '5.0'; }
        if (text.includes('09')) { el.textContent = '09–21'; }
        io.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => io.observe(c));
})();

// ========================================
// GALLERY LIGHTBOX (simple)
// ========================================
(function () {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(10,9,7,0.95);
    display: flex; align-items: center; justify-content: center;
    cursor: zoom-out; opacity: 0; pointer-events: none;
    transition: opacity 280ms cubic-bezier(0.16,1,0.3,1);
  `;
  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 92vw; max-height: 90vh; object-fit: contain;
    border-radius: 8px; box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    transform: scale(0.95); transition: transform 280ms cubic-bezier(0.16,1,0.3,1);
  `;
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt;
    overlay.style.pointerEvents = 'all';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      img.style.transform = 'scale(1)';
    });
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 280);
    document.body.style.overflow = '';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const i = item.querySelector('img');
      if (i) open(i.src, i.alt);
    });
  });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ========================================
// FADE-IN FALLBACK (for browsers without
// scroll-driven animations support)
// ========================================
(function () {
  if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  fadeEls.forEach(el => { el.style.opacity = '0'; el.style.transition = 'opacity 0.6s ease'; });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  fadeEls.forEach((el) => io.observe(el));
})();

// ========================================
// LAZY-LOAD IFRAME (2GIS map)
// Loads the iframe only when the map
// container enters the viewport
// ========================================
(function () {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;
  const iframe = mapContainer.querySelector('iframe[data-src]');
  if (!iframe) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          iframe.src = iframe.getAttribute('data-src');
          iframe.removeAttribute('data-src');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '200px 0px' }  // start loading 200px before visible
  );

  io.observe(mapContainer);
})();
