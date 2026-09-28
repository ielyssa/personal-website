'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

type GoogleAnalyticsProps = {
  measurementId: string;
};

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    window.gtag?.('config', measurementId, {
      page_path: `${window.location.pathname}${window.location.search}`,
    });
  }, [measurementId, pathname]);

  return null;
}
