import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { JsonLd } from '@/components/ui/json-ld';
import { SITE } from '@content/site';
import { graph, organizationNode, personNode, profilePageNode, websiteNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { ThemeRegistry } from '@/theme/ThemeRegistry';

import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({
    title: `${SITE.name} — ${SITE.roleLine}`,
    description: `${SITE.positioningLine} Founder of ATAS, building Rwanda-first AI infrastructure: AcademiaPlus in schools today, IMIZI as long-term research.`,
    path: '/',
  }),
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'technology',
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/brand/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/brand/icons/favicon.ico',
    apple: '/brand/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: SITE.shortName,
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.match(/^G-[A-Z0-9]+$/i)?.[0];

const colorSchemeScript = `(function(){try{var t=localStorage.getItem('mui-mode');var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var m=t==='light'||t==='dark'?t:(d?'dark':'light');if(m==='dark'){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
        <ThemeRegistry>
          <SiteChrome>{children}</SiteChrome>
        </ThemeRegistry>
        <JsonLd data={graph(websiteNode(), profilePageNode(), personNode(), organizationNode())} />
        {gaMeasurementId ? (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: true });
              `}
            </Script>
            <GoogleAnalytics measurementId={gaMeasurementId} />
          </>
        ) : null}
        <Analytics />
        <SpeedInsights />
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
