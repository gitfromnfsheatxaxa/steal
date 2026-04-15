/**
 * Theme initialization script - runs before hydration
 * Must be inline to prevent FOUC (flash of unstyled content)
 */
(function() {
  try {
    const stored = localStorage.getItem('st-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ?? (prefersDark ? 'dark' : 'light');
    
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  } catch (e) {
    // localStorage not available, default to dark
    document.documentElement.classList.remove('light');
  }
})();