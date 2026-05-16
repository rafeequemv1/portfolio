declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = 'G-XVGPV6TE2V';

let analyticsReady = false;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

/** Load Google Analytics after idle — keeps gtag out of the critical path. */
export function initAnalyticsWhenIdle() {
  if (typeof window === 'undefined') return;

  const load = () => {
    if (analyticsReady) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => {
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
      analyticsReady = true;
      trackPageView(window.location.pathname + window.location.search);
    };
    document.head.appendChild(script);
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(load, { timeout: 8000 });
    return;
  }
  globalThis.addEventListener('load', () => setTimeout(load, 3500), { once: true });
}

/** SPA route changes — virtual pageview for GA4. */
export function trackPageView(pagePath: string) {
  if (typeof window === 'undefined') return;
  const path = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  if (!analyticsReady) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}
