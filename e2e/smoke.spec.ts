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
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const location = message.location().url ?? '';
    if (location.includes('/_vercel/insights') || location.includes('/_vercel/speed-insights')) return;
    const text = message.text();
    if (text.includes('/_vercel/insights') || text.includes('/_vercel/speed-insights')) return;
    if (text.includes('Failed to load resource') && (location.includes('_vercel') || text.includes('_vercel'))) return;
    errors.push(text);
  });
  return errors;
}

test.describe('route smoke', () => {
  for (const route of ROUTES) {
    test(`renders ${route.path} with unique title`, async ({ page }) => {
      const consoleErrors = collectConsoleErrors(page);
      const response = await page.goto(route.path, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(route.title));
      expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
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
    await expect(page.getByText('I build AI companies that understand Rwanda.')).toBeVisible();
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
      expect(serious.map((violation) => `${violation.id}: ${violation.nodes.length} nodes`)).toEqual([]);
    });
  }
});

test.describe('contact form', () => {
  test('shows graceful fallback when email unconfigured', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('Prefer email?').or(page.getByText('Send a message'))).toBeVisible();
  });
});
