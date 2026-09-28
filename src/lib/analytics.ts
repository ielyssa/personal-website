type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'config' | 'event', name: string, params?: AnalyticsPayload) => void;
    plausible?: (name: string, options?: { props?: AnalyticsPayload }) => void;
  }
}

export function trackEvent(name: string, params: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  let sent = false;

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: params });
    sent = true;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
    sent = true;
  }

  if (!sent && process.env.NODE_ENV === 'development') {
    console.info('[analytics]', name, params);
  }
}
