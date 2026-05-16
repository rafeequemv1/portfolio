/** Non-critical display fonts — loaded after first paint. */
export function loadDisplayFontsWhenIdle() {
  if (typeof window === 'undefined') return;

  const load = () => {
    void import('./fonts-display.css');
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(load, { timeout: 2500 });
  } else {
    setTimeout(load, 400);
  }
}
