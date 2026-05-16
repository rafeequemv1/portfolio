/** Non-critical display fonts — loaded after first paint. */
export function loadDisplayFontsWhenIdle() {
  if (typeof window === 'undefined') return;

  const load = () => {
    void import('@fontsource/cormorant-garamond/latin-400.css');
    void import('@fontsource/cormorant-garamond/latin-400-italic.css');
    void import('@fontsource/cormorant-garamond/latin-600.css');
    void import('@fontsource/cormorant-garamond/latin-700.css');
    void import('@fontsource/dancing-script/latin-400.css');
    void import('@fontsource/inter/latin-500.css');
    void import('@fontsource/inter/latin-700.css');
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(load, { timeout: 2500 });
  } else {
    setTimeout(load, 400);
  }
}
