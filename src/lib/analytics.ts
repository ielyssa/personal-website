type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: AnalyticsPayload) => void;
    plausible?: (name: string, options?: { props?: AnalyticsPayload }) => void;
  }
}

export function trackEvent(name: string, params: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: params });
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', name, params);
  }
}

