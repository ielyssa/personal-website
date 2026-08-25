// @ts-check

const BLOG_REDIRECTS = {
  '1': '/writing/building-atas-journey',
  '2': '/writing/machine-learning-in-education',
  '3': '/writing/kinyarwanda-tts-project',
  '4': '/writing/data-science-skills-for-africa',
};

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

function buildCspReportOnly() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const scriptSrc = plausible ? ["'self'", "'unsafe-inline'", 'https://plausible.io'] : ["'self'", "'unsafe-inline'"];
  const connectSrc = plausible ? ["'self'", 'https://plausible.io'] : ["'self'"];
  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  return csp;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 828, 1080, 1280],
    imageSizes: [64, 96, 128, 192, 256, 384],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      ...Object.entries(BLOG_REDIRECTS).map(([id, destination]) => ({
        source: `/blog/${id}`,
        destination,
        permanent: true,
      })),
      { source: '/projects/:slug', destination: '/work/:slug', permanent: true },
      { source: '/atas', destination: '/work/atas', permanent: true },
      { source: '/assets/docs/:file*', destination: '/docs/:file*', permanent: true },
      { source: '/assets/profile-picture.png', destination: '/media/person/elyssa-avatar-800.webp', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy-Report-Only', value: buildCspReportOnly() },
        ],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/:base(brand|og|docs|media)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
