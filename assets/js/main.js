(function () {
  const STORAGE_KEY = 'site-theme'; // 'light' | 'dark' | 'auto'
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  // Detect system preference
  const prefersDark = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply theme
  const applyTheme = (mode) => {
    if (mode === 'auto') {
      root.setAttribute('data-theme', prefersDark() ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', mode);
    }
    updateToggleIcon(mode);
  };

  // Update toggle button appearance
  const updateToggleIcon = (mode) => {
    if (!btn) return;
    const iconEl = btn.querySelector('.icon');
    let label = '';
    if (mode === 'light') {
      iconEl.textContent = '☀️';
      label = 'Switch to dark mode';
    } else if (mode === 'dark') {
      iconEl.textContent = '🌙';
      label = 'Switch to auto mode';
    } else {
      iconEl.textContent = '🖥️';
      label = 'Switch to light mode';
    }
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);
  };

  // Get/set mode in localStorage
  const getMode = () => localStorage.getItem(STORAGE_KEY) || 'auto';
  const setMode = (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
  };

  // On load
  applyTheme(getMode());

  // Listen for toggle button click
  if (btn) {
    btn.addEventListener('click', () => {
      const modes = ['auto', 'light', 'dark'];
      const current = getMode();
      const next = modes[(modes.indexOf(current) + 1) % modes.length];
      setMode(next);
    });
  }

  // Live update if in auto mode and system preference changes
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getMode() === 'auto') {
        applyTheme('auto');
      }
    };
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else if (mql.addListener) mql.addListener(onChange);
  }

  // Optional: smooth scroll for in-page anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
    }
  });
})();

