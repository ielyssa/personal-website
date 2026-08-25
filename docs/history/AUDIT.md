# ielyssa.com — Technical & Brand Audit

> **Date:** August 25, 2026
> **Scope:** Full audit of codebase, performance, SEO, brand positioning, architecture, and infrastructure.
> **Purpose:** This document is the single source of truth for all findings. Implementation plans will be derived directly from it — every item has an ID (e.g. `PERF-01`) for traceability.

---

## 1. Executive Summary

The site is a **client-side-only React SPA** (Vite 6 + React 19 + MUI 7) deployed on Vercel. It looks good, but it has serious problems in five areas:

| Area | Grade | Headline finding |
|---|---|---|
| Brand positioning | 🔴 Critical | Site brands you as an *engineer with skills*, not a *founder building a company*. Factual conflicts with the ATAS company document (Co-Founder vs Founder & CEO, 2024 vs 2025). |
| Performance | 🔴 Critical | ~**31 MB of unoptimized PNGs**, ~25 MB reachable from the homepage alone. Artificial skeleton delays, 100 ms re-render loops, zero image pipeline. |
| SEO | 🔴 Critical | Empty HTML shell for crawlers/AI agents; per-route metadata only exists after JavaScript runs; invalid structured-data dates; relative `og:image`; soft-404 on every unknown URL. |
| Architecture | 🟠 High | 1,812-line monolith view, content welded into components, no content layer, naming debt from the repo rename, dead components and dependencies. |
| Infrastructure | 🟡 Medium | No cache headers, no security headers, no real analytics (events fire into the void), no CI, no tests, no error monitoring. |

**The strategic gap:** you want this to be the personal website of a *founder* — the front door to Elyssa and ATAS — that scales to many future features (writing, ventures, speaking, press, updates). The current code is a renamed portfolio template with sections bolted on. It needs a repositioned content model and a scalable structure more than it needs cosmetic fixes.

**Biggest lever, ranked by impact:**
1. Image pipeline (fixes the visible "images take forever" problem overnight).
2. Rendering strategy so every route returns real HTML (SEO + AI-era discoverability + instant LCP).
3. Repositioning copy from "engineer skill list" → "founder narrative" (this changes how humans and LLMs describe you).

---

## 2. Current State Snapshot

### 2.1 Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 19.1 + Vite 6 | Pure SPA, no SSR/SSG/prerender |
| Routing | react-router 7 | Mixed imports: `react-router` (main.tsx) and `react-router-dom` (everywhere else) |
| UI | MUI 7 + Emotion | Runtime CSS-in-JS |
| Icons | @iconify/react | Offline-bundled sets (`icon-sets.ts`, ~19 KB) — good, no runtime API fetches |
| Fonts | DM Sans Variable + Barlow ×5 weights via @fontsource | Self-hosted, no preload hints in HTML |
| Deploy | Vercel | `vercel.json` contains only a catch-all SPA rewrite |

### 2.2 Routes

| Route | Page | Content source |
|---|---|---|
| `/` | One long page: Hero, About, Focus, ATAS, Portfolio, Writing, Contact | Hardcoded in `personal-website-view.tsx` (1,812 lines) + data files |
| `/blog/:id` | Blog detail (`/blog/1` … `/blog/4`) | Full article text inside `blog-data.ts` TS template strings |
| `/projects/:slug` | Project detail (3 projects) | `project-data.ts` |
| `/atas` | Company page | Hardcoded in `atas-detail-view.tsx` |
| `/speaking` | Speaking & media page | Hardcoded in `speaking-media-view.tsx` |
| `*` | `<Navigate to="/" replace />` | Soft-404 (see SEO-05) |

### 2.3 Asset inventory (the smoking gun)

**~31.4 MB of images, all PNG, zero modern formats, zero responsive variants.**

| File | Size |
|---|---|
| `public/assets/images/blog/ml-education.png` | **5.42 MB** |
| `kinyarwanda-tss-02.png` / `edubridge-01.png` / `kinyarwanda-tss-01.png` / `kinyarwanda-tss-03.png` | 1.7–1.9 MB each |
| 11 more project/focus/atas images | 0.95–1.67 MB each |
| `profile-picture.png` (hero avatar + og:image!) | 447 KB |
| Logos (4 files) | 1.3 MB combined |

Homepage reachable weight: hero avatar + 4 focus slides + 3 ATAS slides + 9 portfolio slides + logos + blog covers ≈ **~25 MB**. On a typical Kigali mobile connection this is minutes of loading — this *is* the "images take longer to load" bug.

---

## 3. Findings

Severity scale: 🔴 Critical · 🟠 High · 🟡 Medium · ⚪ Low

### A. Brand & Positioning (your core request)

The user brief is explicit: *entrepreneur and applied AI engineer, founder identity, no skill lists, personal website (not a portfolio site)*.

#### BRAND-01 🔴 — Identity framed as engineer-first, everywhere
- **Evidence:** `index.html:10–16` (meta description/keywords), `personal-website-view.tsx:32` ("Applied AI Engineer, AI Researcher, and Entrepreneur"), `:568–571` (skill chips: "AI Strategy", "Data Science", "Language AI"), `:1357–1369` (stack chips: React, Python, Scikit-learn…), `pages/*.tsx` JSON-LD `jobTitle`.
- **Impact:** Every touchpoint — meta tags, schema.org, hero, about, cards — leads with engineering labels. To a visitor (and to LLMs answering "who is IRANKUNDA Elyssa?") you read as a junior engineer listing skills, not a founder building a company. Skill chips are explicitly what you said you don't want.
- **Recommendation:** Rewrite the identity layer around one positioning line (e.g. *"Founder & CEO of ATAS — building AI that understands Rwanda"*), with "applied AI engineer" as supporting detail, not the headline. Remove skill/stack chips from public surfaces or convert them into *venture/outcome* language ("Kinyarwanda speech systems", "national education infrastructure"). Keep the technical story inside case-study pages where it adds credibility instead of defining you.

#### BRAND-02 🔴 — Factual conflicts with the ATAS company document
- **Evidence vs company doc:**
  - Site says "**Co-Founder** at ATAS" (`personal-website-view.tsx:33`, `:69`, `:933`, `:943`) and blog title "co-founded". Doc says: **Founder & CEO**, sole full-time member.
  - Site journey says ATAS started **2024** (`personal-website-view.tsx:97–99`). Doc says founded **2025**.
  - Speaking page lists venues/talks that don't appear anywhere in company material (`speaking-media-view.tsx:15–34`) — reads as placeholder/aspirational.
- **Impact:** Credibility risk. Journalists, investors, and schools cross-check. Founder-of-record inconsistency is the worst kind of bug because it's invisible to tests.
- **Recommendation:** Single source of truth: one `site.config` (see ARCH-02) holding bio facts, imported by UI *and* used to generate structured data. Reconcile: Founder & CEO; founding year; verify every speaking item before publishing or mark clearly as "selected topics" rather than past events.

#### BRAND-03 🟠 — Social links contradict official handles
- **Evidence:** Layout/footer use `linkedin.com/in/irankunda-elyssa-452001290/` (`layout.tsx:52`, `personal-website-view.tsx:169`, `:1723`) but the company doc lists `linkedin.com/in/ielyssa`. X links use `x.com/elyssa_ira` (`:181`) vs doc's `x.com/_ielyssa`. Two different X URLs even within the doc itself.
- **Impact:** Split engagement signals, broken link risk, SEO entity confusion.
- **Recommendation:** Decide canonical handles once, store in `site.config`, use everywhere including `sameAs` structured data and twitter meta tags (currently missing entirely — see SEO-06).

#### BRAND-04 🟠 — "Portfolio" framing contradicts "this is not a portfolio website"
- **Evidence:** Repo/layout named `portfolio` (`layouts/portfolio/`), nav label "Portfolio", hero CTA "Explore Portfolio" (`personal-website-view.tsx:451`), section heading "Portfolio case studies", CV download as primary hero action (`:458`).
- **Impact:** The site self-describes as a portfolio. You want: *personal website of a founder* — ventures, writing, speaking, contact — where selected work is one section among several.
- **Recommendation:** Rename the section concept to "Work" / "Ventures" / "Building"; make the hero CTAs founder-actions (e.g., "Explore ATAS", "Read my writing", "Get in touch"); demote CV download below media-kit/bio for non-recruiter audiences (or move CV to press kit page).

#### BRAND-05 🟡 — Engineer-stat metrics instead of venture outcomes
- **Evidence:** `IMPACT_METRICS` counts "AI Infrastructure Initiatives: 3", "Flagship Products and Prototypes: 3", "Years of Active Building: 4" (`personal-website-view.tsx:36–41`).
- **Impact:** Counts of artifacts signal "student resume". Founders are measured by direction and consequence, not artifact counts.
- **Recommendation:** Replace with venture-level claims tied to the ATAS doc: products in market (AcademiaPlus), research programs (IMIZI), language focus (Kinyarwanda), timeline consistency. Numbers only when they're real (e.g., "first schools onboard next term").

#### BRAND-06 ⚪ — Misc content drift
- Footer copyright hardcoded "2026" (`layout.tsx:383`); blog dates stored as display strings reused as structured-data dates (see SEO-04); "Now building" items overlap but don't match ATAS doc language (`NOW_ITEMS`, `personal-website-view.tsx:84–88`).
- **Recommendation:** Derive year dynamically; adopt company-doc phrasing as canonical.

---

### B. Performance

#### PERF-01 🔴 — No image pipeline; 31 MB of raw PNGs
- **Evidence:** §2.3 inventory. All images served as-is from `public/`. No AVIF/WebP, no width variants, no compression step, no build-time processing (`vite.config.ts` has no asset plugins).
- **Impact:** This is the #1 cause of the slow-loading site. A 447 KB avatar where 30 KB would do; 5.4 MB blog cover; 1.5 MB carousel slides displayed at ~600 px wide.
- **Recommendation:** Adopt a real image pipeline:
  - **If staying on Vite:** build-time generation with `sharp` (script or `vite-imagetools`) producing AVIF + WebP at 3–4 widths + tiny blur-up placeholders; commit generated assets or generate in a prebuild step.
  - **If migrating to Next.js (ARCH-05):** `next/image` gives this for free on Vercel's CDN.
  - Target budget: ≤ 120 KB per content image, ≤ 60 KB avatar, WebP/AVIF first.

#### PERF-02 🔴 — All carousel slides mount immediately; hidden slides still load
- **Evidence:** Focus slider renders all 4 scenes stacked with `opacity: 0` (`personal-website-view.tsx:610–634`); ATAS slider same (`:984–1010`); portfolio card sliders render all 3 images per project ×3 projects (`:1239–1264`). They carry `loading="lazy"` but sit inside/near the viewport, so browsers fetch them anyway.
- **Impact:** Homepage downloads ~25 MB even though the visitor sees one slide at a time. Also causes transition jank on low-end devices (decode spikes).
- **Recommendation:** Render active slide + preload only the *next* slide; introduce slides progressively on hover/intent; combine with PERF-01 formats.

#### PERF-03 🔴 — Artificial loading delays block first paint
- **Evidence:** `setTimeout(() => setLoading(false), 800)` on homepage (`personal-website-view.tsx:220–223`) and 550 ms on `/atas` (`atas-detail-view.tsx:39–42`) — pure fake skeletons before content renders.
- **Impact:** Adds ~0.5–0.8 s to LCP on every visit for zero benefit. The skeleton isn't even preventing a flash — it *causes* one.
- **Recommendation:** Delete both timers and the skeleton states entirely. If a suspense fallback is wanted for route lazy-loading, keep the route-level fallback only (already exists in `sections.tsx`).

#### PERF-04 🟠 — 100 ms countdown intervals re-render the entire page tree
- **Evidence:** Portfolio countdown ticks state every 100 ms (`personal-website-view.tsx:252–265`); ATAS countdown same (`:281–294`). Each tick re-renders the full 1,800-line component tree (all sections) because state lives at the top.
- **Impact:** Constant main-thread work, battery drain, jank during scroll — painful exactly on the low-end Android devices that matter for your audience.
- **Recommendation:** Drive countdowns from CSS animations (conic-gradient ring or transform progress bar) or isolate them into memoized leaf components; co-locate state per section (also fixes ARCH-01).

#### PERF-05 🟠 — Background interval cycles every project's images whether visible or not
- **Evidence:** `projectImageIndexes` interval rotates all 3 projects' carousels every 4.3 s forever (`personal-website-view.tsx:267–279`), regardless of scroll visibility.
- **Recommendation:** Gate with `IntersectionObserver`; pause when off-screen or tab hidden (`document.visibilityState`).

#### PERF-06 🟡 — `srcSet`/`sizes` are dead code for local images
- **Evidence:** `buildUnsplashSrcSet()` only produces URLs for `images.unsplash.com` hosts (`personal-website-view.tsx:123–132`); every local image gets `srcSet={undefined}` while `sizes` remains set — misleading leftovers from an earlier iteration.
- **Recommendation:** Remove; replace with real generated srcsets from the new pipeline (PERF-01) via a shared `<SmartImage>` component (ARCH-03).

#### PERF-07 🟡 — Fonts: two families, six files, no preload, unused weights
- **Evidence:** `global.css:4–10` loads DM Sans Variable + Barlow 400/500/600/700/800. Typography uses Barlow only for h1–h3 (`theme/core/typography.ts:56–75`).
- **Impact:** Heading font arrives late → FOUT on the biggest text on screen (LCP element is often the h1). Extra weights cost ~30–80 KB each.
- **Recommendation:** Subset to used weights (likely 700/800 for headings), `<link rel="preload">` the two critical font files in `index.html`, add `font-display: swap` (fontsource default) and size-adjust fallback metrics. Consider dropping Barlow and using DM Sans everywhere to cut a family entirely.

#### PERF-08 🟡 — Unused heavy dependencies ship risk
- **Evidence:** `apexcharts` + `react-apexcharts` in `package.json:39–44` with zero imports in `src/` (verified by grep). Currently tree-shaken away, but any accidental future import drags ~500 KB.
- **Recommendation:** Remove both, plus prune other unused deps after dead-code cleanup (CODE-03).

#### PERF-09 ⚪ — Emotion runtime cost
- **Evidence:** All styling is runtime CSS-in-JS (MUI/Emotion).
- **Impact:** ~30–40 KB JS + per-render style serialization. Acceptable now; becomes relevant after the big wins land.
- **Recommendation:** Not worth a rewrite today. If migrating to Next.js later, enable MUI's RSC-style static extraction; otherwise leave as is and note it as accepted cost.

---

### C. SEO

#### SEO-01 🔴 — Client-only rendering: the public HTML is empty
- **Evidence:** `index.html` ships an empty `<div id="root">`; all content, titles, meta, and JSON-LD appear only after React hydrates. `vercel.json` rewrites everything to the same shell.
- **Impact:** Google executes JS (with delay/budget), but Bing, Yandex, DuckDuckGo, and — critically — **AI crawlers** (GPTBot, ClaudeBot, PerplexityBot) mostly don't. Today, to most machines, ielyssa.com is a blank page. For a founder whose reputation will increasingly be mediated by LLM answers, this is existential, not cosmetic.
- **Recommendation (decision point, see ARCH-05):**
  - **Option A (recommended): migrate to Next.js (SSG)** on Vercel — every route statically rendered, per-route metadata via Metadata API, sitemap/OG-image routes built-in. Highest ceiling, moderate migration cost given only ~6 routes.
  - **Option B: stay on Vite + prerender** (`vite-prerender-plugin` / custom puppeteer prerender of the 10 known URLs) — cheap, keeps stack, but every new feature needs prerender wiring discipline.
  - Either way, the *content layer* refactor (ARCH-02/03) is required and is portable across both options.

#### SEO-02 🟠 — Per-route metadata rendered through React, absent from initial HTML
- **Evidence:** Pages render `<title>/<meta>/<link rel=canonical>` as JSX relying on React 19 head hoisting (`pages/atas.tsx:49–67`, `pages/speaking.tsx:16–38`). Until JS runs, every URL shares the home metadata from `index.html`.
- **Impact:** Crawlers without JS see wrong/missing titles for all subpages; social scrapers (LinkedIn, WhatsApp — heavily used in Rwanda, X) never execute JS, so **share previews for every subpage show home data** — and currently a broken relative OG image (SEO-03).
- **Recommendation:** Server-rendered/static per-route `<head>` (automatic under either Option A/B above). Centralize metadata generation in one helper fed by the content layer (ARCH-02).

#### SEO-03 🟠 — Broken Open Graph image
- **Evidence:** `og:image`/`twitter:image` = `/assets/profile-picture.png` — a **relative URL** (`index.html:27,35`, repeated in all pages) plus it's a 447 KB portrait crop, wrong aspect for `summary_large_image`.
- **Impact:** Most scrapers require absolute URLs; previews render blank or ugly. Your links are being shared in WhatsApp/LinkedIn groups right now with degraded previews.
- **Recommendation:** Absolute URLs; produce dedicated 1200×630 OG images per page type (branded card: name + role line + photo/logo). Next.js `opengraph-image` / `@vercel/og` automates this; otherwise pre-generate static PNGs per route.

#### SEO-04 🟠 — Invalid structured data (dates), thin entity graph
- **Evidence:**
  - `Article` schema uses display strings: `datePublished: 'Dec 13, 2025'` (`pages/blog-detail.tsx:26–27` ← `blog-data.ts:51`). Google requires ISO 8601 (`2025-12-13`). Rich results will ignore/reject these.
  - Homepage has **no JSON-LD at all**; Person schema exists only on subpages; no `WebSite` node, no `sameAs` array tying your socials, no `Organization` for ATAS relationship.
  - ATAS page uses generic `CreativeWork` (`pages/atas.tsx:14–26`) instead of `Organization`/`ProfilePage` semantics.
- **Recommendation:** Store ISO dates in content; emit display strings at render. Build one graph: `WebSite` + `Person` (with `sameAs`, `worksFor` → `Organization ATAS`, founderOf) + `ProfilePage` on home; `Article`+`BreadcrumbList` on posts; `Organization` on `/atas`. Validate with Rich Results Test + Schema validator in CI.

#### SEO-05 🟠 — Soft-404: every unknown URL returns the homepage
- **Evidence:** Route wildcard `<Navigate to="/" replace />` (`routes/sections.tsx:107–110`) + `vercel.json` rewrite serving `index.html` (HTTP 200) for anything.
- **Impact:** Typos and dead links silently "resolve" to home; search engines flag soft-404s; analytics polluted.
- **Recommendation:** Dedicated 404 route with helpful navigation; in Vercel config create a real 404 (status 404) for non-matching paths once routes are enumerable (trivial under SSG).

#### SEO-06 🟡 — Missing social/search essentials
- **Evidence (all in `index.html`):** no `twitter:site`/`twitter:creator`; duplicate favicon declarations (`:5` and `:39`); `theme-color` `#1877F2` conflicts with manifest `#ffffff` (`site.webmanifest:16`); keywords meta is obsolete noise (`:14–16`).
- **Recommendation:** Clean head template: unique favicons, consistent theme-color tokens (light/dark), twitter handles from BRAND-03, drop keywords meta.

#### SEO-07 🟡 — Non-descriptive blog URLs & sitemap gaps
- **Evidence:** Posts live at `/blog/1…4` (`routes/sections.tsx:68`, sitemap lines 33–52); sitemap lacks `lastmod`; URLs not derived from slugs.
- **Impact:** Keywords in URLs are a small but free ranking signal; numeric IDs leak nothing to shares/AI citations.
- **Recommendation:** Slug-based URLs (`/writing/building-atas-journey` etc.) with 301 redirects from old IDs; auto-generate sitemap from content layer with accurate `lastmod`.

#### SEO-08 ⚪ — Anchor-based navigation is fragile for deep links
- **Evidence:** Cross-route hash scrolling polls with `setInterval` up to 24 attempts (`layout.tsx:124–139`); sitemap/blog breadcrumbs reference `/#writing` (`pages/blog-detail.tsx:51`).
- **Recommendation:** Under SSG, prefer real routes per topic (`/writing`, `/ventures`) instead of mega-page anchors; keeps deep links stable and shareable.

---

### D. Architecture & Code Organization

#### ARCH-01 🔴 — Monolith view component (1,812 lines)
- **Evidence:** `personal-website-view.tsx` contains 8 page sections, 4 carousels, 20+ `useState/useEffect` hooks, data constants, and utility functions in one file.
- **Impact:** Any change risks regressions elsewhere; re-render blast radius (PERF-04); unreadable; unreviewable diffs.
- **Recommendation:** Decompose into section components under the new structure (§4), each owning its state; shared carousel/swipe logic extracted to hooks.

#### ARCH-02 🟠 — No content layer; content welded to components
- **Evidence:** Blog articles as TS template strings (`blog-data.ts:25–47`); project/speaking/focus data hardcoded beside views; bio facts scattered across 6 files (BRAND-02 evidence).
- **Impact:** Editing a post requires a TypeScript change + rebuild; impossible to add MDX/frontmatter, RSS, or future CMS; duplicates are already drifting.
- **Recommendation:** Introduce `content/` layer: typed collections (posts, ventures, speaking, updates) with frontmatter (title, slug, ISO dates, summary, cover, status). Vite: markdown loader + typed imports. Next.js: MDX/content collections natively. This is *the* enabler for "many different features later".

#### ARCH-03 🟠 — No shared primitives for cross-cutting concerns
- **Evidence:** SEO blocks duplicated verbatim per page (`pages/*.tsx`); `SITE_URL` constant re-declared in 4 files; image handling ad-hoc per usage (PERF-06); carousel logic implemented 3× with variations.
- **Recommendation:** Build small shared modules: `lib/seo.ts` (metadata builders), `config/site.ts` (single source of truth), `components/media/SmartImage`, `hooks/useCarousel`. Everything else consumes them.

#### ARCH-04 🟡 — Naming debt & structural confusion
- **Evidence:** `layouts/portfolio/` is actually the whole-site layout (repo was renamed from `ielyssa-portfolio`, README admits it); `sections/website/` mixes page views, section views, and data files; `kinyarwanda-sts-logo.png` vs directory `kinyarwanda-tts/` (typo legacy); `format-time/format-number/analytics` utilities partially unused.
- **Recommendation:** Full restructure per §4 with renames executed in one atomic PR.

#### ARCH-05 🟠 — Rendering strategy decision (ties to SEO-01)
- Summarized tradeoffs:
  - **Stay Vite SPA + prerender:** lowest effort, keeps MUI setup, but permanent tax: manual prerender list, manual metadata plumbing, no server features later (forms, OG image gen, ISR-like freshness).
  - **Next.js SSG on Vercel (recommended):** native fit with current host; static export of all routes; `next/image`, Metadata API, `opengraph-image`, app router file conventions = the exact feature set this site needs; MUI works with proper provider setup (documented pattern). Migration surface is small: 6 routes, no backend.
  - **Astro:** best-in-class content sites, but MUI integration is awkward (islands + Emotion friction) — not recommended given existing MUI investment.
- **Recommendation:** Decide before Phase 2. All Phase-1 work (images, copy, cleanup, headers) is valuable under either path.

#### CODE-03 🟡 — Dead code & dependency drift
- **Evidence:** Unused components: `Scrollbar`, `Label`, `SvgColor`, `ColorUtils/color-picker` (grep-verified zero usages outside their own folders). Unused deps: `apexcharts`, `react-apexcharts`; `simplebar-react` + `es-toolkit` exist mainly to serve the dead components. Both `yarn.lock` and `package-lock.json` committed (mixed package managers — scripts reference yarn, README says npm).
- **Recommendation:** Delete dead components + their exclusive deps; pick ONE package manager (recommend pnpm or keep npm; remove the other lockfile).

#### CODE-04 ⚪ — Minor hygiene
- Mixed `react-router` / `react-router-dom` imports; `CONFIG` imports `package.json` into the client bundle just for version; commented-out debris (`personal-website-view.tsx:377–378`); `prefetchRouteModules` exported but unused; eslint/prettier configs fine but no CI enforcement.

---

### E. Accessibility & UX Edge Cases

#### UX-01 🟠 — Motion accessibility ignored in carousels
- **Evidence:** `prefers-reduced-motion` respected only for scrolling (`layout.tsx:84–96`); autoplaying crossfades/slides, glow pulses, theme-toggle rotation run regardless (`personal-website-view.tsx` transitions; `layout.tsx:340–344`).
- **Recommendation:** Global reduced-motion guard: disable autoplay, transforms, and decorative animations; respect `matchMedia('(prefers-reduced-motion: reduce)')` in carousel hooks.

#### UX-02 🟠 — Autoplay cannot be paused via keyboard; touch targets too small
- **Evidence:** Sliders pause on mouse hover only (`onMouseEnter/onMouseLeave`); pagination dots are 8 px tall hit areas (`personal-website-view.tsx:702–717`, `1096–1112`, `1405–1425`) — WCAG 2.2 target-size minimum is 24×24 px.
- **Recommendation:** Pause on focus-within + expose play/pause button; enlarge dot hit areas with padding/transparent overlay.

#### UX-03 🟡 — Countdown chips ("8s") add noise
- **Evidence:** Visible seconds-countdown badges on ATAS + portfolio sliders (`:1020–1043`, `1267–1289`).
- **Impact:** Gimmick that draws attention to mechanics, requires the expensive 100 ms loop (PERF-04), and means nothing to visitors.
- **Recommendation:** Remove; if progress affordance desired, use subtle progress line driven by CSS.

#### UX-04 🟡 — Layout shift (CLS) from unsized images & late fonts
- **Evidence:** No `width`/`height`/`aspect-ratio` on any `<img>`; gradient-text h1 depends on late-loaded Barlow.
- **Recommendation:** Mandatory dimensions via `SmartImage` (aspect-ratio boxes), font fallback metric overrides (PERF-07).

#### UX-05 ⚪ — Route change doesn't manage focus; anchor CTA bypasses smooth-scroll system
- **Evidence:** After navigation focus stays on body (skip-link target exists but isn't focused programmatically); hero "Explore Portfolio" uses raw `href="#portfolio"` (`personal-website-view.tsx:443–452`) which triggers default jump instead of the layout's offset-aware smooth scroll (`layout.tsx:84–96`).
- **Recommendation:** Focus `#main-content` on pathname change; route CTA through the same `scrollToSection` util.

#### UX-06 ⚪ — Contrast risks on overlays
- White caption text over translucent glass panels atop photos (`:659–718`, `1076–1093`) can fail WCAG AA depending on the underlying image brightness. Verify against final imagery; add stronger scrim if needed.

---

### F. Infrastructure, Analytics & DevEx

#### INFRA-01 🟠 — Vercel configuration is minimal
- **Evidence:** `vercel.json` = one rewrite. Missing: immutable long-cache headers for hashed `/assets/*` builds, sane caching for images/docs, security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP frame-ancestors, HSTS), clean URL handling, real 404 (SEO-05).
- **Recommendation:** Add `headers` block (security + caching), `cleanUrls: true`, trailing-slash policy, 404 handling; revisit CSP once analytics choice settles.

#### INFRA-02 🟠 — Analytics is theater right now
- **Evidence:** `trackEvent` fires CustomEvents + optional `window.gtag` (`utils/analytics.ts`) — but **no gtag/GA script is loaded anywhere**, so every event vanishes. 20+ instrumented interactions produce zero data.
- **Recommendation:** Decide the privacy-friendly path (Plausible/Fathom — simple, GDPR-light, fits public-figure brand) or GA4; load script conditionally, keep `trackEvent` as the single facade, add outbound-link/file-download tracking.

#### INFRA-03 🟡 — No monitoring, CI, or safety nets
- **Evidence:** No GitHub Actions, no Lighthouse/perf budgets in CI, no error boundary reporting (ErrorBoundary exists but logs nowhere), no deploy previews enforcement.
- **Recommendation:** Minimal CI: typecheck + lint + build + Lighthouse CI budget assertion + link checker on PRs. Add Sentry (free tier) or Vercel telemetry for runtime errors.

#### INFRA-04 ⚪ — Docs drift
- README structure section roughly matches but omits theme/, components/, config-global; no contribution/architecture docs; CHANGELOG present but manual.
- **Recommendation:** Rewrite README against the new structure (§4); add `docs/` conventions page; consider changesets later.

---

## 4. Proposed Target Directory Structure

Designed for: founder-personal-site today; many features later (writing engine, ventures, press, speaking, newsletter, updates/changelog, EN/RW readiness). Feature-sliced, content-driven, framework-portable (paths identical under Vite or Next.js except `app/` ↔ `pages/` mapping).

```
ielyssa/
├── public/
│   ├── brand/                      # logos, icons, favicon set, og-default
│   ├── docs/                       # cv.pdf, media-kit.pdf (press-ready names)
│   ├── media/
│   │   ├── …(generated)            # optimized AVIF/WebP variants + placeholders (prebuild output)
│   │   └── originals/              # source images (never served directly)
│   ├── robots.txt
│   └── site.webmanifest
│
├── content/                        # THE content layer — editable without touching UI
│   ├── site.ts                     # identity: name, role line, bio, contacts, canonical socials (BRAND-02/03 fix)
│   ├── ventures/                   # ATAS + future companies (replaces "projects")
│   │   ├── atas.mdx
│   │   └── academiaplus.mdx …      # frontmatter: slug, status, period, role, summary, cover, gallery
│   ├── writing/                    # posts (slug URLs, ISO dates, tags, reading time computed)
│   │   └── *.mdx
│   ├── speaking/index.yaml         # topics, engagements (verified only)
│   ├── now.md                      # /now page source
│   └── press/                      # boilerplate bios (short/long), fact sheet, photos
│
├── src/
│   ├── app/                        # bootstrap only
│   │   ├── providers/              # ThemeProvider, AnalyticsProvider, ErrorBoundary
│   │   ├── router/                 # routes.tsx, paths.ts (single URL registry + redirects map)
│   │   └── main.tsx
│   ├── config/
│   │   └── site.ts                 # re-export of content/site.ts + env-derived SITE_URL (one definition total)
│   ├── lib/                        # framework-agnostic helpers
│   │   ├── seo/                    # metadata builders, JSON-LD graph builders (Person/Organization/Article/WebSite)
│   │   ├── analytics.ts            # trackEvent facade + provider adapters
│   │   └── utils/                  # date formatting (ISO↔display), cn(), etc.
│   ├── components/                 # design-system, domain-free
│   │   ├── ui/                     # Button wrappers, Chip, Card patterns…
│   │   ├── media/                  # SmartImage (dimensions, srcset, placeholder), Carousel (a11y, reduced-motion)
│   │   ├── layout/                 # Header, Footer, MobileNav, ScrollTop
│   │   └── motion/                 # ScrollReveal, useReducedMotion
│   ├── features/                   # vertical slices — own their data-fetch/state/route bits
│   │   ├── home/                   # composes sections below
│   │   ├── identity/               # hero, about (consumes content/site)
│   │   ├── ventures/               # list section + [slug] detail view
│   │   ├── writing/                # list section + [slug] detail view
│   │   ├── speaking/
│   │   ├── contact/                # channels, collaboration paths (+ future form)
│   │   └── press/                  # media-kit page
│   ├── theme/                      # existing MUI theme, slimmed (fonts, palette, components overrides)
│   └── styles/global.css
│
├── scripts/
│   ├── optimize-images.mjs         # sharp: AVIF/WebP, widths, blur placeholders (prebuild)
│   └── generate-sitemap.mjs        # from content/ (until framework-native)
├── docs/                           # AUDIT.md, PLAN.md, decisions/
├── .github/workflows/ci.yml
└── (single lockfile)
```

Key properties:
- **Content ≠ presentation**: marketing edits happen in `content/` (and later via CMS like Decap/Payload without code changes).
- **Feature slices**: adding "Newsletter" = new `features/newsletter/` + route entry; no monolith surgery.
- **One source of truth** for identity facts, URLs, SEO graph — kills the drift class of bugs permanently.
- **Generated media** is reproducible from `originals/`; repo stays light if we later move to CDN.

---

## 5. Prioritized Roadmap (input for implementation plan)

### Phase 0 — Truth & Positioning (no architecture needed) ~1 day
| Item | ID |
|---|---|
| Reconcile founder facts (Founder & CEO, year, handles) into one config | BRAND-02, BRAND-03 |
| Rewrite identity copy: founder-first headline/about/metrics; strip skill chips from surfaces | BRAND-01, BRAND-05 |
| Rename portfolio framing → Work/Ventures; reorder hero CTAs | BRAND-04 |
| Fix footer year, speaking content verification | BRAND-06 |

### Phase 1 — Performance quick wins (stays on current stack) ~2–3 days
| Item | ID |
|---|---|
| Image pipeline: sharp script → AVIF/WebP + sizes + blur placeholders; swap all references; target −90% weight | PERF-01 |
| Kill artificial delays & fake skeletons | PERF-03 |
| Carousel: render active+next only; pause off-screen; remove 100 ms loops (CSS-driven progress or leaf isolation) | PERF-02, PERF-04, PERF-05, UX-03 |
| Add dimensions everywhere (CLS=0), font preload + subset | PERF-07, UX-04 |
| Remove dead components/deps; pick lockfile | PERF-08, CODE-03 |
| Vercel headers (cache + security), dedupe favicons, absolute OG URLs + real OG image set | INFRA-01, SEO-03, SEO-06 |

### Phase 2 — Structure & correctness ~3–5 days
| Item | ID |
|---|---|
| Execute directory restructure (§4) atomically incl. renames | ARCH-01, ARCH-04, CODE-04 |
| Content layer (typed collections), slug URLs + redirects, ISO dates | ARCH-02, SEO-07 |
| Shared seo/config/media modules; JSON-LD graph (Person/Org/WebSite/sameAs); validate in Rich Results | ARCH-03, SEO-04 |
| Real 404; a11y pass (reduced motion, targets, focus management) | SEO-05, UX-01, UX-02, UX-05 |
| Analytics decision + install; CI (typecheck/lint/build/Lighthouse budgets) | INFRA-02, INFRA-03 |

### Phase 3 — Strategic upgrade (decision gate) ~1–2 weeks
| Item | ID |
|---|---|
| Choose rendering path: **recommended Next.js SSG migration on Vercel** vs Vite prerender | SEO-01, SEO-02, ARCH-05 |
| Automated sitemap/OG-image generation; RSS feed for writing; press page | INFRA/SEO follow-ons |
| Foundation for future features (newsletter, contact form, /now, changelog) | scalability goal |

### Success budgets (enforceable in CI)
| Metric | Target |
|---|---|
| Total homepage transfer | < 1.5 MB (from ~25 MB) |
| LCP (4G, mid-range Android) | < 2.0 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| JS shipped (gzip, initial route) | < 250 KB |
| Routes with server-visible HTML + unique meta | 100% |
| Structured data validity (Rich Results) | 0 errors |
| Lighthouse (Perf/A11y/BP/SEO) | ≥ 95 each |

---

## 6. Open Decisions Needed From You

1. **Rendering path** (Phase 3 gate): OK to plan a Next.js SSG migration, or must we stay pure-Vite? (Recommend Next.js; everything before Phase 3 is identical either way.)
2. **Canonical handles**: LinkedIn `in/ielyssa` vs `in/irankunda-elyssa-452001290`; X `_ielyssa` vs `elyssa_ira` — which are live/canonical?
3. **Founding year**: company doc says 2025; site says 2024. Which is correct for public bio?
4. **CV**: keep as a prominent download (recruiter-facing) or fold into a press/press-kit page?
5. **Analytics preference**: privacy-friendly (Plausible — recommended) vs GA4 vs none?
6. **Speaking content**: keep only verified engagements, or reframe as "topics I speak on" until real ones exist?
7. **Blog scope**: keep the 4 posts as-is (light edit for founder voice), or treat Phase 2 as the moment to establish the writing section properly?

---

*End of audit. Next artifact: implementation plan(s) derived from the IDs above.*
