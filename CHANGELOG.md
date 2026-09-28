### Unreleased

- [New] Add the `/biography` route with a long-form founder story, named-people directory, internal name anchors, and Biography navigation.
- [New] Add biography-specific metadata, ProfilePage/Person/ItemList JSON-LD, sitemap and `llms.txt` coverage, and a dedicated OG card.
- [Fixed] Ensure only one header item is marked active at a time while scrolling the home page.
- [Fixed] Replace the obsolete `gray-matter` YAML bridge with the supported `js-yaml` loader so static generation works with the locked dependency graph.
- [Changed] Add env-gated Google Analytics 4 pageviews/events while retaining Vercel Speed Insights and aggregate Web Analytics.
- [Changed] Remove build-time Google Font fetching; typography now uses the local DM Sans/system fallback stack.
- [Removed] Remove the unused Resend contact API and Buttondown newsletter configuration; contact now uses direct links only.
- [Changed] Document biography editing, entity SEO, navigation registration, and production verification requirements.

---

### v4.0.0

###### Aug 25, 2026

- [New] Migrate from Vite SPA to Next.js 15 App Router — every route is now statically rendered with full server HTML (SEO, social previews, AI-crawler visibility).
- [New] Content layer: MDX collections with zod-validated frontmatter (`content/`) — adding a post or venture requires no code changes.
- [New] Founder-first repositioning across all copy, structured data, and metadata (Founder & CEO of ATAS; no skill-chip branding).
- [New] Pages: `/work` index + 5 venture pages (incl. new IMIZI page), `/writing` index with tag filters, `/press` kit, `/now`, `/contact`, `/privacy`.
- [New] Image pipeline: `scripts/prep-media.mjs` (sharp) — 31 MB of PNGs became ~1 MB of WebP masters with blur placeholders; served via `next/image` (AVIF/WebP, responsive srcsets).
- [New] Branded OG image engine: 16 generated 1200×630 cards via `scripts/generate-og.mjs` (runs prebuild).
- [New] SEO suite: per-route Metadata API, JSON-LD entity graph (Person/Organization/WebSite/Article/Breadcrumb), generated `sitemap.xml` + `robots.txt`, RSS feed (`/feed.xml`), `llms.txt` for AI crawlers, legacy 301 redirects, real 404.
- [New] Accessibility: a11y carousel (keyboard, focus-pause, reduced-motion, ≥44px targets), skip link, focus management, AA contrast pass (axe-verified in CI).
- [New] Contact form (Resend, env-gated with mailto fallback), newsletter capture (Buttondown, env-gated).
- [New] Analytics: Vercel Analytics + Speed Insights + Plausible facade behind one `trackEvent` API.
- [New] Quality engineering: Vitest unit suite (content + SEO gates), Playwright e2e smoke + axe scans, GitHub Actions CI, Lighthouse CI budgets, security headers + CSP report-only.
- [Changed] Single font family (DM Sans/system fallback stack); Barlow removed.
- [Changed] Dark mode systemized with no-flash inline script and `data-theme` CSS variables.
- [Removed] Vite, react-router, apexcharts, simplebar, es-toolkit, dead components; duplicate lockfiles (now pnpm-only).

---

### v3.0.0

###### Apr 3, 2025

- Support MUI v7.
- Support React v19.
- Support Eslint v9.
- Upgrade and restructure the directory.
- Upgrade some dependencies to the latest versions.

---

### v2.0.0

###### Aug 24, 2024

- [New] Migrate to typescript.
- Upgrade and restructure the directory.
- Upgrade some dependencies to the latest versions.

---

### v1.8.0

###### Wed 11, 2023

- [New] Migrate to vite.js.
- Upgrade and restructure the directory.
- Upgrade some dependencies to the latest versions

---

### v1.7.0

###### Feb 21, 2023

- Upgrade some dependencies to the latest versions

---

### v1.6.0

###### Oct 17, 2022

- Upgrade and restructure the directory.
- Upgrade some dependencies to the latest versions

---

### v1.5.0

###### Jul 04, 2022

- Support react 18.
- Upgrade some dependencies to the latest versions

---

### v1.4.0

###### Apr 12, 2022

- Update `src/components`.
- Update `src/sections`.
- Update `src/pages`.
- Update `src/layouts`.
- Update `src/theme`.
- Upgrade some dependencies to the latest versions

---

### v1.3.0

###### Feb 21, 2022

- Support react-script v5.0.0
- Source code improvement
- Upgrade some dependencies to the latest versions

---

### v1.2.0

###### Sep 18, 2021

- Support MIU v5.0.0 official release
- Upgrade some dependencies to the latest versions
- Update `src/theme/typography.js`
- Upgrade some dependencies to the latest versions

---

### v1.1.0

###### Jul 23, 2021

- Support MUI v5.0.0-beta.1
- Upgrade some dependencies to the latest versions

---

### v1.0.0

###### Jun 28, 2021

Initial release.
