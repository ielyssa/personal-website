import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = [
  { path: '/', title: 'IRANKUNDA Elyssa' },
  { path: '/work', title: 'Work' },
  { path: '/work/atas', title: 'ATAS' },
  { path: '/work/academiaplus', title: 'AcademiaPlus' },
  { path: '/work/imizi', title: 'IMIZI' },
  { path: '/writing', title: 'Writing' },
  { path: '/writing/building-atas-journey', title: 'Building ATAS' },
  { path: '/speaking', title: 'Speaking' },
  { path: '/press', title: 'Press' },
  { path: '/now', title: 'Now' },
  { path: '/contact', title: 'Contact' },
  { path: '/privacy', title: 'Privacy' },
];

function collectConsoleErrors(page: import('@playwright/test').Page) {
  const errors: string[] = [];
  const isExpectedExternalRequest = (url: string) =>
    url.includes('/_vercel/') || url.includes('plausible.io') || url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');

  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (text.startsWith('Failed to load resource') || text.includes('/_vercel/')) return;
    errors.push(text);
  });
  page.on('pageerror', (error) => errors.push(`Page error: ${error.message}`));
  page.on('requestfailed', (request) => {
    if (isExpectedExternalRequest(request.url())) return;
    errors.push(`${request.failure()?.errorText ?? 'Request failed'}: ${request.url()}`);
  });
  return errors;
}

test.describe('route smoke', () => {
  for (const route of ROUTES) {
    test(`renders ${route.path} with unique title`, async ({ page }) => {
      const consoleErrors = collectConsoleErrors(page);
      const response = await page.goto(route.path, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
      await expect(page).toHaveTitle(new RegExp(route.title));
    });
  }

  test('every route has a canonical link', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const href = await canonical.getAttribute('href');
      expect(href).toMatch(/^https:\/\/ielyssa\.com(\/|$)/);
    }
  });

  test('every route exposes complete SEO metadata and valid JSON-LD', async ({ page, request }) => {
    for (const route of ROUTES) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`https://ielyssa.com${route.path === '/' ? '' : route.path}`);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThanOrEqual(180);

      const metadata = [
        'og:title',
        'og:description',
        'og:url',
        'og:site_name',
        'og:type',
        'og:image',
        'og:image:width',
        'og:image:height',
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
        'twitter:site',
        'twitter:creator',
      ];

      for (const property of metadata) {
        const content = await page.locator(`meta[property="${property}"], meta[name="${property}"]`).getAttribute('content');
        expect(content, `${route.path} is missing ${property}`).toBeTruthy();
      }

      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toContain('index');
      expect(robots).toContain('follow');

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      const ogResponse = await request.get(new URL(ogImage!).pathname);
      expect(ogResponse.status(), `${route.path} OG image is unreachable`).toBe(200);

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(jsonLdScripts.length, `${route.path} has no JSON-LD`).toBeGreaterThan(0);
      for (const script of jsonLdScripts) {
        const parsed = JSON.parse(script);
        expect(parsed['@context']).toBe('https://schema.org');
        expect(parsed['@graph']).toBeInstanceOf(Array);
      }
    }
  });

  test('crawler endpoints are canonical and internally linked', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain('https://ielyssa.com/');
    expect(sitemapBody).toContain('https://ielyssa.com/writing/building-atas-journey');
    expect(sitemapBody).toContain('https://ielyssa.com/work/atas');

    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap: https://ielyssa.com/sitemap.xml');

    const feed = await request.get('/feed.xml');
    expect(feed.status()).toBe(200);
    const feedBody = await feed.text();
    expect(feedBody).toContain('<rss');
    expect(feedBody).toContain('https://ielyssa.com/writing');

    const llms = await request.get('/llms.txt');
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain('https://ielyssa.com/work/atas');
  });

  test('home includes structured data graph', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const jsonLd = page.locator('script[type="application/ld+json"]');
    expect(await jsonLd.count()).toBeGreaterThan(0);
    const content = await jsonLd.first().textContent();
    const parsed = JSON.parse(content ?? '{}');
    expect(parsed['@graph']).toBeDefined();
  });

  test('legacy URLs redirect', async ({ page }) => {
    await page.goto('/blog/1');
    expect(page.url()).toContain('/writing/building-atas-journey');
    await page.goto('/projects/edubridge');
    expect(page.url()).toContain('/work/edubridge');
    await page.goto('/atas');
    expect(page.url()).toContain('/work/atas');
  });

  test('unknown URL returns 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h4')).toContainText("doesn't exist");
  });

  test('home hero shows founder positioning', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('IRANKUNDA Elyssa');
    await expect(page.getByText(/I build AI companies that understand Rwanda/)).toBeVisible();
  });
});

test.describe('accessibility', () => {
  for (const path of ['/', '/writing/building-atas-journey', '/contact']) {
    test(`axe scan passes on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        const step = window.innerHeight / 2;
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 700));
      });
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical'
      );
      expect(
        serious.map(
          (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`
        )
      ).toEqual([]);
    });
  }
});

test.describe('contact form', () => {
  test('shows a direct contact channel when email form is unconfigured', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('link', { name: 'info@ielyssa.com' })).toBeVisible();
  });
});
