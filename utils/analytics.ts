declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Load Google Analytics after idle — keeps gtag out of the critical path. */
export function initAnalyticsWhenIdle() {
  if (typeof window === 'undefined') return;

  const load = () => {
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XVGPV6TE2V';
    script.onload = () => {
      gtag('js', new Date());
      gtag('config', 'G-XVGPV6TE2V', { send_page_view: true });
    };
    document.head.appendChild(script);
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(load, { timeout: 8000 });
    return;
  }
  globalThis.addEventListener('load', () => setTimeout(load, 3500), { once: true });
}
