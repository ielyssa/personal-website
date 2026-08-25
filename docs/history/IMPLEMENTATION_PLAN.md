# ielyssa.com — Implementation Plan (v1.0 → Production-Ready)

> **Companion to:** `AUDIT.md` (same folder — findings referenced throughout by ID — `BRAND-*`, `PERF-*`, `SEO-*`, `ARCH-*`, `CODE-*`, `UX-*`, `INFRA-*`).
> **Contract:** When every task in this document is implemented **and** every item in the Definition of Done (§11) passes, ielyssa.com is production-ready. Nothing from the audit is left unresolved; anything intentionally deferred is explicitly listed in §10.

---

## 0. Locked Decisions

The audit ended with 7 open questions. This plan proceeds on the following locked decisions (change any of them before Phase 0 starts — after that they are load-bearing):

| # | Decision | Choice | Rationale |
|---|---|---|---|
| D1 | Rendering path | **Migrate to Next.js 15 (App Router) with static generation (SSG), deployed on Vercel. Vite SPA retired after parity.** | Only path that permanently fixes SEO-01/02, gives native image optimization, per-route metadata, OG image engine, MDX content layer, and zero-friction future features (forms, feeds). 6 routes = small migration surface. |
| D2 | Canonical LinkedIn | `https://www.linkedin.com/in/ielyssa` (per ATAS company doc) | Company doc is source of truth; old profile URL 301s are not possible cross-domain, so we simply standardize. |
| D3 | Canonical X | `https://x.com/_ielyssa` (per ATAS company doc) | Same as D2. Instagram stays `@_ielyssa`. GitHub stays `@ielyssa`. |
| D4 | Founding year | **2025, Kigali** (per ATAS company doc); Elyssa role: **Founder & CEO** (not Co-Founder) | Company doc is canonical. All site copy + structured data updated. |
| D5 | CV placement | Moved out of hero; lives in **`/press`** hub (media kit page). Recruiter path preserved but demoted for founder positioning. | BRAND-04. |
| D6 | Analytics | **Vercel Analytics (pageviews) + Vercel Speed Insights (Web Vitals) as baseline; Plausible Cloud behind the existing `trackEvent` facade for custom events (env-gated). GA4 swap-in remains trivial via facade.** | Privacy-friendly, zero-config on Vercel, ~1 KB Plausible script proxied to dodge adblockers. Disclosed on `/privacy`. |
| D7 | Speaking content | Page reframed as **"Speaking topics & media kit"** — only verified engagements listed; until real ones exist, an honest empty-state line replaces invented events. | BRAND-02 credibility rule: publish nothing unverifiable. |
| D8 | Blog scope | Keep all 4 posts, light founder-voice edits during content migration (fix "co-founded", align facts), new slug URLs. Writing section gets a proper index page. | SEO-07 + ARCH-02. |
| D9 | Typography | **Single font family: DM Sans Variable** (drop Barlow entirely). Headings differentiated by weight/tracking instead of second family. | PERF-07: −5 font files (~150–250 KB), kills heading FOUT risk; unified look. Visual QA gate included (T3.7). |
| D10 | Package manager | **pnpm** (single lockfile). Remove both `yarn.lock` and `package-lock.json`. | CODE-03 hygiene; fastest CI installs; first-class Vercel support. |

---

## 1. Target End-State (what "done" looks like)

### 1.1 Final stack

| Layer | v1 (today) | Target (this plan) |
|---|---|---|
| Framework | React SPA (Vite) | **Next.js 15 App Router, SSG-first**, server components for shells, client islands for interactivity |
| UI | MUI 7 + Emotion | MUI 7 + Emotion (kept), via `@mui/material-nextjs` App Router integration |
| Content | TS template strings | **MDX collections with zod-validated frontmatter**, build-time content checks |
| Media | Raw PNGs from `/public` | Optimized masters + **`next/image`** (AVIF/WebP, responsive srcsets, blur placeholders, automatic dimensions) |
| Fonts | 2 families, 6 files | DM Sans Variable via `next/font` (self-hosted, preloaded, zero layout shift) |
| SEO | Client-only meta | Metadata API per route, JSON-LD graph, dynamic OG images, `sitemap.ts`, `robots.ts`, RSS, `llms.txt` |
| Forms | None | Contact form (server action + Resend, env-gated), newsletter capture (Buttondown, env-gated) |
| Analytics | Events into void | Vercel Analytics + Speed Insights + Plausible custom events via one facade |
| Quality | None | pnpm scripts, ESLint flat config (next/core-web-vitals), Vitest units, Playwright smoke, Lighthouse CI budgets, content validation gate |

### 1.2 Final information architecture (URL map)

```
/                      Home: Hero → About → Focus → ATAS spotlight → Work highlights → Writing preview → Contact
/work                  Work index (ventures & research programs overview)          [NEW]
/work/[slug]           Venture detail pages:
                         /work/atas            ATAS — full company story (absorbs old /atas)
                         /work/academiaplus    Active product
                         /work/imizi           Long-term research program          [NEW]
                         /work/edubridge       Earlier initiative
                         /work/kinyarwanda-tts Language research
/writing               Writing index (all posts, tag filter)                           [NEW]
/writing/[slug]        Post detail (slugs replace /blog/:id)
/speaking              Topics & media kit
/press                 Press hub: bios (short/long), photos, CV, media kit, fact sheet [NEW]
/now                   What I'm building now                                           [NEW]
/contact               Dedicated contact page w/ form                                  [NEW]
/privacy               Privacy & analytics disclosure                                  [NEW]
/feed.xml              RSS feed                                                        [NEW]
/sitemap.xml, /robots.txt  Generated                                                   [NEW]
/llms.txt              Machine-readable site brief for AI crawlers                     [NEW]
/not-found             Real 404 with helpful navigation                                [FIX]
```

**Legacy redirects (301):**

```
/blog/:id        → /writing/<slug>     (id→slug static map, 4 entries)
/projects/:slug  → /work/<slug>
/atas            → /work/atas
/#portfolio      → /#work              (nav relabel; hash redirects best-effort)
```

### 1.3 Target directory structure

```
personal-website/
├── content/
│   ├── site.ts                      # SINGLE SOURCE OF TRUTH: identity, contacts, socials, bio facts
│   ├── writing/                     # *.mdx + frontmatter (title, slug, summary, dates ISO, tags, cover)
│   ├── work/                        # atas.mdx, academiaplus.mdx, imizi.mdx, edubridge.mdx, kinyarwanda-tts.mdx
│   │   └── media/                   # images imported statically by mdx/pages (dimensions+blur auto)
│   ├── speaking.yaml                # topics[], verified engagements[] (may be empty)
│   ├── press.yaml                   # shortBio, longBio, factSheet rows, photo set, downloads
│   ├── now.md
│   └── home/                        # focus slides copy, metrics, collaboration items
├── src/
│   ├── app/
│   │   ├── layout.tsx               # root: fonts, theme providers, analytics, header/footer
│   │   ├── page.tsx                 # home
│   │   ├── work/page.tsx, work/[slug]/page.tsx (+ generateStaticParams)
│   │   ├── writing/page.tsx, writing/[slug]/page.tsx
│   │   ├── speaking/page.tsx, press/page.tsx, now/page.tsx, contact/page.tsx, privacy/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts, robots.ts, llms.txt/route.ts, feed.xml/route.ts
│   │   ├── opengraph-image.tsx, writing/[slug]/opengraph-image.tsx   # OG engine (ImageResponse)
│   │   └── api/contact/route.ts     # or server action — Resend integration
│   ├── theme/                       # MUI theme (palette, typography single-family, components overrides)
│   │   └── ThemeRegistry.tsx        # @mui/material-nextjs cache + ColorSchemeProvider ('use client')
│   ├── components/
│   │   ├── ui/                      # ButtonLink, ChipRow, SectionHeading, Prose (MDX renderer)
│   │   ├── media/SmartImage.tsx     # next/image wrapper: priority rules, aspect boxes, caption slot
│   │   ├── media/Carousel.tsx       # a11y slider: active+next render, IO pause, CSS progress, reduced-motion
│   │   ├── layout/Header.tsx, Footer.tsx, MobileNav.tsx, ScrollTopButton.tsx, ActiveSectionSpy.tsx
│   │   └── motion/Reveal.tsx, useReducedMotion.ts
│   ├── features/
│   │   ├── identity/Hero.tsx, AboutSection.tsx
│   │   ├── focus/FocusSection.tsx   # evidence/metrics band
│   │   ├── ventures/VentureSpotlight.tsx (home ATAS block), WorkHighlights.tsx
│   │   ├── writing/WritingPreview.tsx, WritingIndex.tsx (tag filter client island)
│   │   ├── speaking/SpeakingView.tsx
│   │   ├── contact/ContactSection.tsx, ContactForm.tsx (client island)
│   │   └── press/PressView.tsx
│   ├── lib/
│   │   ├── content.ts               # collection loaders (fs+gray-matter+zod), types, reading time
│   │   ├── seo.ts                   # buildMetadata(), JSON-LD graph builders (Person/Org/WebSite/Article/Breadcrumb)
│   │   ├── analytics.ts             # trackEvent facade → plausible/gtag/vercel
│   │   ├── nav.ts                   # NAV_ITEMS, paths registry
│   │   └── utils/date.ts            # ISO↔display formatters (dayjs kept, tree-shaken import)
│   └── styles/global.css
├── scripts/verify-content.mjs       # CI gate: zod-parse every collection, orphan/broken-link check
├── docs/                            # AUDIT.md, IMPLEMENTATION_PLAN.md, decisions/, runbook.md
├── .github/workflows/ci.yml
├── next.config.mjs                  # images config, headers, redirects
├── vercel.json                      # (thin) region + headers if needed; most moves into next.config
└── pnpm-lock.yaml                   # single lockfile
```

---

## 2. Phase 0 — Truth & Positioning (stack-independent) · fixes BRAND-01…06

> Everything here is content/config work that must be true regardless of framework. Draft copy is provided and reviewed with you before it ships.

### T0.1 — Create `content/site.ts` as the single identity source · BRAND-02, BRAND-03, BRAND-06
```ts
export const SITE = {
  name: 'IRANKUNDA Elyssa',
  shortName: 'Elyssa',
  initials: 'IE',
  url: 'https://ielyssa.com',
  email: 'info@ielyssa.com',
  phone: '+250 788 235 574',
  location: 'Kigali, Rwanda',
  roleLine: 'Founder & CEO of ATAS',
  tagline: 'Building AI that understands Rwanda',
  foundedAtas: '2025',
  socials: {                       // canonical, from ATAS doc (D2/D3)
    linkedin: 'https://www.linkedin.com/in/ielyssa',
    x: 'https://x.com/_ielyssa',
    instagram: 'https://www.instagram.com/_ielyssa/',
    github: 'https://github.com/ielyssa',
    atas: { site:'https://atas.rw', linkedin:'https://www.linkedin.com/company/atas-rwanda',
            x:'https://x.com/atas_rw', instagram:'https://www.instagram.com/atas.rw/',
            youtube:'https://www.youtube.com/@ATASRwanda' },
  },
} as const;
```
- **Accept:** every consumer (UI, meta, JSON-LD, footer year via `new Date().getFullYear()`) imports from here; grep proves zero other hardcoded handles/URLs/facts.

### T0.2 — Founder-first copy deck (reviewed once, then frozen) · BRAND-01, BRAND-05
Draft copy to approve/edit:

**Hero**
- Eyebrow: `Founder & CEO — ATAS · Alliance for Transformative AI Systems`
- H1: `IRANKUNDA Elyssa`
- Positioning line: `I build AI companies that understand Rwanda.`
- Support paragraph: `I founded ATAS in Kigali to build AI systems that genuinely understand Rwanda — its languages, geography, and everyday realities. Today that means AcademiaPlus, our national education platform entering schools this academic term, and IMIZI, our long-term contextual intelligence infrastructure.`
- CTAs: `[Explore ATAS]` `[Read my writing]` · tertiary link: `Press kit →` (CV download removed from hero — D5).

**About section**
- P1: `I'm IRANKUNDA Elyssa, founder and CEO of ATAS (Alliance for Transformative AI Systems). I lead the company's research, products, and engineering end to end — from Kinyarwanda language technology to national education infrastructure.`
- P2: `I believe African intelligence should be built and narrated by Africans. ATAS exists to turn that belief into systems people actually use — built in Rwanda, for Rwanda first, then for every market like it.`

**Basic-info card** → Role: *Founder & CEO at ATAS* · Based in: *Kigali, Rwanda* · Founded: *ATAS, 2025* · Focus chips (domains, not skills): `AI Infrastructure` `Kinyarwanda Language AI` `Education Technology`.

**Metrics band rewrite (venture-outcome framing)**
| Old (engineer stats) | New (founder outcomes) |
|---|---|
| AI Infrastructure Initiatives: 3 | **Products & programs at ATAS: 2 tracks** — one product in schools, one long-term research program |
| Core Research Themes: 4 | **Language: Kinyarwanda-first** — speech & understanding built natively, not translated |
| Flagship Products & Prototypes: 3 | **AcademiaPlus enters schools** — Rwanda's curriculum infrastructure, first onboardings next term |
| Years of Active Building: 4 | **Founded 2025, building in public** — research → product, one pipeline |

- **Accept:** no skill lists anywhere public (`grep -ri "Data Science\|Python\|React"` over rendered copy returns nothing outside venture detail technical notes); "Co-Founder" appears nowhere; year reads 2025.

### T0.3 — Work/venture truth pass · BRAND-02
Rewrite venture blurbs from the ATAS doc:
- `academiaplus`: national curriculum infrastructure for secondary education — complete curriculum, human-authored exam repository, grading/analytics engine; Practice Hub & Competition Hub following; institutional pricing, early adopters get first term free. Status: **Active — nearing first school onboardings**.
- `imizi` (**new page**): Rwanda's first Contextual Intelligence Infrastructure — informal place descriptions → structured understanding; underlying infrastructure, not an app. Status: **R&D**.
- `edubridge`: earlier predictive-analytics initiative. Status: **Earlier work**.
- `kinyarwanda-tts`: Kinyarwanda text-to-speech research feeding ATAS's language program. Status: **Research**.
- Fix folder/logo typo legacy: `kinyarwanda-sts-logo.png` → renamed asset (ARCH-04 cleanup rides along).
- **Accept:** each venture page states status, period, one-line outcome; nothing contradicts the company doc.

### T0.4 — Speaking honesty policy · BRAND-02, D7
`speaking.yaml`: `topics[]` (from doc themes), `engagements[]` starts empty; view renders topics + "Selected engagements" empty-state ("First public sessions will be listed here") + invite CTA + media-kit downloads.
- **Accept:** no invented venues/years render.

### T0.5 — Writing edits list · BRAND-06, D8
Post 1: title keeps "at 20" only if you approve age-forward framing (default: retitle *"Building ATAS: Starting an AI Company in Rwanda"*); body "co-founded"→"founded"; facts aligned. Posts 2–4 light voice edits. Slugs assigned (see §1.2).
- **Accept:** edits applied in migrated MDX; no factual conflicts remain site-wide.

---

## 3. Phase 1 — Next.js Foundation & Parity Migration · fixes ARCH-04/05 groundwork, retires SPA safely

> Strategy: build the Next.js app alongside the Vite app in a new `web/` workspace? **No** — cleaner: migrate in-place on a branch (`next-migration`), keep deploying Vite from `main` until parity checklist passes, then switch Vercel Root Directory/build command in one cutover commit.

### T1.1 — Scaffold Next.js 15 + tooling · D1, D10, CODE-03
- `pnpm init`, add `next@15 react@19 react-dom@19`, dev: `typescript`, `@types/*`, `eslint-config-next`, `prettier`.
- Delete: `apexcharts`, `react-apexcharts`, `simplebar-react`, `es-toolkit` (only used by dead components), `react-router-dom`, `vite*` deps after cutover. Remove `yarn.lock`, `package-lock.json`; add `pnpm-lock.yaml`; engines `node >=20`.
- Scripts: `dev/build/start/lint/typecheck/test/content:check/e2e`.
- **Accept:** `pnpm build && pnpm start` serves placeholder shell; lockfile count = 1.

### T1.2 — MUI 7 + Emotion App Router integration · ARCH-05
- Add `@mui/material-nextjs` (`AppRouterCacheProvider` in root layout), port `src/theme/**` (palette unchanged initially), `ColorSchemeProvider` + `InitColorSchemeScript` (no-flash dark mode — see T5.4).
- Convention documented in `docs/decisions/0001-rsc-boundaries.md`: **pages/metadata = server components; interactive trees marked `'use client'`** (Emotion constraint). Home sections stay client islands where stateful; static prose renders server-side.
- **Accept:** light/dark toggle works; no hydration mismatch warnings; FOUC-free first paint in both schemes.

### T1.3 — Fonts via `next/font` · PERF-07, D9
- Remove @fontsource packages & CSS imports. `next/font/google` DM Sans Variable, `display:'swap'`, subsets latin, preload; wire into theme tokens; delete Barlow; adjust h1–h3 weights (-0.01em tracking) to preserve hierarchy.
- **Accept:** exactly 1 font family, ≤2 preloaded files, no FOUT flash on reload throttle test; visual QA sign-off on headings (T3.7 gate).

### T1.4 — Route tree, layout chrome, redirects, 404 · SEO-01 groundwork, SEO-05, UX-05
- Port Header/MobileNav/Footer/ScrollTop as components under `components/layout/`; nav labels: Home, About, Focus, ATAS, Work, Writing, Speaking, Contact (portfolio→**Work** — BRAND-04).
- `next.config.mjs` `redirects()` implementing §1.2 legacy map (301s). Custom `not-found.tsx` (real 404 status, search-path links, personality allowed).
- Smooth-scroll util for same-page anchors; cross-route anchor links replaced by real routes (no more polling hack — UX/SEO-08).
- **Accept:** every legacy URL 301s correctly (script-checked); unknown URL returns HTTP 404; nav active states correct.

### T1.5 — Parity checklist & cutover · INFRA safety
Checklist (must be ✅ before switching Vercel to Next build):
- [ ] All §1.2 routes render with correct unique `<title>`/meta in **view-source** (server HTML)
- [ ] Home sections visually at parity (screenshot diff review)
- [ ] Downloads work (`/docs/*` moved under `public/docs/`)
- [ ] Analytics pageviews firing (Vercel dashboard shows traffic)
- [ ] Lighthouse perf ≥ current SPA baseline
- Cutover: merge branch → flip Vercel Root Directory/framework preset → verify prod → keep Vite code tagged `legacy-vite-spa` for instant rollback (revert commit restores prior deployment).
- **Accept:** production runs Next.js; rollback procedure tested once on preview.

---

## 4. Phase 2 — Content Layer & Feature Rebuild · fixes ARCH-01/02/03, PERF-03/04/05, UX-01…03

### T2.1 — Content system · ARCH-02
- Deps: `gray-matter`, `zod`, `reading-time`; MDX via `@next/mdx` (posts support JSX embeds later).
- Frontmatter schemas (zod): Writing `{title, slug, summary, publishedAt(ISO), updatedAt?, tags[], cover}`; Work `{name, slug, status: 'active'|'research'|'earlier', period, summary, cover, gallery[], facts{}}`; Speaking/Press/Now YAML/MD equivalents.
- `lib/content.ts` loaders used by `generateStaticParams`/`generateMetadata`; **`scripts/verify-content.mjs`** validates all collections + internal link integrity → wired into `pnpm build`.
- **Accept:** adding a post = drop `.mdx` file, zero TS changes; invalid frontmatter fails build with precise error.

### T2.2 — Decompose the monolith into features · ARCH-01
Rebuild home as composed sections (each <300 lines, own state):
`identity/Hero` (static), `AboutSection`, `focus/FocusSection` (metrics band + scene slider), `VentureSpotlight` (ATAS), `WorkHighlights` (cards), `WritingPreview`, `contact/ContactSection`.
- Delete: artificial skeleton timers (PERF-03) — sections render immediately; route-level suspense fallback only.
- **Accept:** no `setTimeout` fake-loading anywhere (`grep setTimeout src/` → only legit uses); largest component file <300 lines.

### T2.3 — Carousel rebuild (shared `media/Carousel.tsx`) · PERF-02, PERF-04, PERF-05, UX-01, UX-02, UX-03
Spec:
- Renders **active slide + next slide only** (rest unmounted); preload next image via `next/image priority` on the neighbor.
- Autoplay default 6 s; pauses on hover, focus-within, touch, `document.hidden`, off-screen (`IntersectionObserver`); honors `prefers-reduced-motion` (autoplay off, crossfade → simple swap).
- Progress affordance = CSS animation bar restarted via key change — **zero JS intervals** (kills 100 ms loops).
- A11y: roledescription carousel, `aria-roledescription`, tablist dots ≥44 px hit area, arrow buttons labelled, keyboard arrows navigate, live-region announces slide change politely. Countdown badges removed (UX-03).
- Used by: Focus scenes, VentureSpotlight gallery, venture detail galleries, WorkHighlights cards (cards may use manual-only mode).
- **Accept:** axe scan clean on carousels; CPU profile shows no recurring rAF/interval while idle; reduced-motion emulation disables autoplay.

### T2.4 — `SmartImage` adoption everywhere · PERF-06, UX-04
- Wrapper enforcing: static imports (auto width/height/blurDataURL), explicit `sizes` per layout slot, `priority` only for true LCP images (hero avatar), captions/alt from content files, optional `aspect` prop.
- Delete `buildUnsplashSrcSet` legacy helpers.
- **Accept:** zero raw `<img>` in `src/` except OG internals; CLS budget met (§11).

---

## 5. Phase 3 — Media Excellence · finishes PERF-01…09

### T3.1 — Master preparation script (`scripts/prep-media.mjs`) · PERF-01
Even though `next/image` optimizes delivery, sources must stop being absurd:
- Inputs from `content/**/originals/`; outputs resized masters (max 2400 px long edge) as high-quality WebP into `content/work/media/` (and blog covers etc.), plus tiny blurred placeholders (20 px WebP → base64) when not using static-import auto-blur.
- One-time run + rerun-on-add workflow documented in README; originals never served.
- Special cases: hero portrait re-shot/exported at 800×800 master (~60 KB target); logos → SVG where possible (ATAS/AcademiaPlus/EduBridge/TTS marks), PNG fallbacks ≤40 KB; blog covers standardized 1600×900.
- **Accept:** repo media total ≤ **4 MB** masters (from 31 MB); largest single master ≤350 KB; delivery sizes (via next/image transforms) within §11 budgets.

### T3.2 — `next.config` image pipeline tuning · PERF-01
- `images: { formats:['image/avif','image/webp'], deviceSizes:[420,640,828,1080,1280], imageSizes:[96,192,256,320,384] , minimumCacheTTL: 2678400 }`; Vercel CDN caches transforms ~forever (immutable URLs).
- **Accept:** homepage transferred weight ≤1.5 MB slow-4G emulation; spot-check AVIF served to Chromium.

### T3.3 — Font loading final pass · PERF-07
Covered by T1.3; verification here: waterfall shows font fetch starting from HTML parse (preloaded), `size-adjust` fallback metrics tuned so h1 doesn't shift.
- **Accept:** CLS contribution from text ≈0; LCP element = hero text/avatar with no late swap.

### T3.4 — Bundle diet · PERF-08, PERF-09, CODE-03
- Route-level analysis (`@next/bundle-analyzer`) recorded in `docs/perf-baseline.md`; initial JS budget enforced in CI (§11).
- Dayjs kept but imported per-plugin; icon usage audited (offline sets already lean).
- Emotion accepted cost documented (decision record); revisit only if budget breached.
- **Accept:** first-load JS home ≤250 KB gz; no route >300 KB.

### T3.5 — Runtime discipline sweep · PERF-05 leftovers
Global rules encoded in eslint (`no-restricted-syntax` for `setInterval` outside approved lib) + visibility gating util `usePageVisible`.
- **Accept:** idle main-thread quiet on home after animations settle (performance panel screenshot in PR).

### T3.6 — Third-party payload policy
Only allowed runtime third parties: analytics snippets (proxied), Resend server-side. No font CDNs, no chat widgets, no jQuery-era scripts. Documented in `docs/decisions/0003-third-party-policy.md`.

### T3.7 — Visual regression gate for design changes (fonts/theme) · D9 safety
Screenshot harness (Playwright) capturing home/work/writing at 3 breakpoints on the font-cutover PR; human sign-off recorded in PR description template.
- **Accept:** side-by-side review approved by you before merge.

---

## 6. Phase 4 — SEO & AI-Era Discoverability · fixes SEO-01…08

### T4.1 — Per-route metadata via Metadata API · SEO-02, SEO-06
- `lib/seo.ts`: `buildMetadata({title, description, path, image, type, noindex?})` → title template `%s — IRANKUNDA Elyssa`, default meta, canonical always absolute, `robots` defaults with per-route override, OG/Twitter complete incl. `twitter:site '@_ielyssa'`/`twitter:creator`, `og:locale en_RW`, keywords meta dropped.
- Root `layout.tsx` exports base metadata + `viewport` export (themeColor light/dark pair — fixes manifest conflict; dedupe favicons; single SVG favicon + PNG fallbacks + maskable 512).
- **Accept:** every route's `curl` HTML contains unique title/desc/canonical/OG absolutes (CI script asserts).

### T4.2 — JSON-LD entity graph · SEO-04
Builders in `lib/seo.ts` emitting one coherent graph:
- Global (layout): `WebSite` + `Person` (url, jobTitle *Founder & CEO*, worksFor→`Organization(ATAS)` with logo/url/sameAs, person `sameAs`=D2/D3 handles) .
- Home: `ProfilePage` referencing Person.
- Work pages: `Organization` (for ATAS itself) / `CreativeWork`+`SoftwareApplication` where apt + `BreadcrumbList`.
- Writing: `Article` with **ISO-8601** dates from frontmatter, author→Person, publisher→Organization(ATAS), `mainEntityOfPage`, keywords.
- **Accept:** Rich Results Test: 0 errors on /, one post, /work/atas; schema validator clean; unit tests assert date serialization.

### T4.3 — OG image engine · SEO-03
- `opengraph-image.tsx` routes using `next/og ImageResponse`: branded 1200×630 card (gradient bg, name/role, venture/post title auto-fit, portrait circle). Per-post images inherit summary/title/tags. Static-sized, edge-cached, `content-type` asserted.
- Fallback static `public/brand/og-default.png` for anything unexpected.
- **Accept:** WhatsApp/X/LinkedIn/debugger previews show branded card on /, a post, /work/atas.

### T4.4 — Sitemap, robots, RSS, `llms.txt` · SEO-07 + advancement
- `app/sitemap.ts` generated from collections (lastmod = `updatedAt ?? publishedAt`, accurate frequencies); `app/robots.ts` (allow all, disallow `/api/`, sitemap ref).
- `feed.xml` route: RSS 2.0 with content:encoded summaries, absolute URLs, self-referencing atom link.
- **`llms.txt`** route: concise markdown brief — who Elyssa is (founder narrative), ventures one-liners, key links, content map — so LLM crawlers that do read plain files represent you correctly.
- **Accept:** sitemap valid w/ lastmod; RSS validates (W3C feed validator); `curl /llms.txt` sane; GSC submission step in runbook.

### T4.5 — URL semantics & soft-404 elimination · SEO-05, SEO-08
Slugs shipped in Phase 1/2; this task verifies: internal links never point at legacy IDs; `not-found` returns 404 status (Next does when rendering not-found); add `X-Robots-Tag: noindex` for `/api/*`.
- **Accept:** crawler sim (script) reports zero 200-for-unknown-URLs; zero legacy-ID links.

### T4.6 — Search Console & ops wiring · INFRA runbook
Runbook steps (documented, executed at launch): GSC property + sitemap submit, Bing Webmaster import, monitor Core Web Vitals field data, monthly "coverage/errors" check reminder.

---

## 7. Phase 5 — Advancements (new value beyond audit fixes)

### T5.1 — `/writing` index + tag filtering · D8, SEO-07
Server-rendered list (cover, title, summary, reading time, dates) + client island tag-filter chips (URL-synced `?tag=`), empty-state handling. Featured post pinned.

### T5.2 — `/now` page · advancement
Rendered from `now.md` ("What I'm building now": ATAS tracks, current focus, last-updated stamp). Nav/footer link. Standard personal-site pattern that signals aliveness to humans & crawlers.

### T5.3 — `/press` hub · BRAND-04, D5
Sections: short bio (50w), long bio (150w), fact sheet (founded/role/location/focus), photo set (portrait + ATAS logo pack), downloads (CV PDF, Media Kit PDF), speaking topics teaser, contact CTAs. Files under `public/docs/` with descriptive names.

### T5.4 — Dark-mode systemization · UX-01 adjacent
`InitColorSchemeScript` inline pre-paint (no flash), toggle persists (`localStorage` + system default), `colorScheme` meta pairs, ScrollTop/theme animations gated by `useReducedMotion` (completes UX-01 for remaining transitions).

### T5.5 — Contact form (server action + Resend) · advancement
- `api/contact` route: zod-validated `{name,email,message,company?}`; honeypot + ≥3 s time-trap; naive IP throttle (in-memory Map, note Upstash upgrade path); sends via Resend to `info@ielyssa.com`; success/error states; **if `RESEND_API_KEY` unset → form hidden, mailto CTA shown** (graceful degrade, still production-safe).
- Spam policy + privacy note links to `/privacy`.

### T5.6 — Newsletter capture (Buttondown, env-gated) · advancement
Email input posting to Buttondown endpoint from `NEXT_PUBLIC_BUTTONDOWN_URL`; absent env → block hidden. Placement: writing index footer + contact section. (No vendor lock: facade function `subscribe(email)`.)

### T5.7 — `/privacy` disclosure · required by D6
Plain-language: what Vercel Analytics/Speed Insights/Plausible collect (no cookies for VA; Plausible cookieless), contact form data handling, no ads/trackers. Linked from footer.

### T5.8 — Micro-interaction polish pass (motion-disciplined) · UX-06
Reveal-on-scroll unified through `motion/Reveal` (IO-based, once-only, respects reduced motion), hover lifts standardized, scrim contrast fix on image overlays (AA-checked against final imagery).

### T5.9 — Colophon mini-page (optional, ship if trivial)
Stack credits + design notes — founder-credibility flourish. Marked optional; excluded from DoD if cut.

---

## 8. Phase 6 — Quality Engineering, Hardening & Launch Ops · fixes INFRA-01…04, CODE-04, UX-05

### T6.1 — Lint/format/TS strictness · CODE-04
ESLint flat config: `next/core-web-vitals` + existing stylistic rules; prettier single source; `typecheck` script strict; import boundaries lint (`features` may not import each other, only via `components/lib`). Mixed router imports die with the SPA.

### T6.2 — Unit tests (Vitest) · INFRA-03
Targets: `lib/seo.ts` builders (ISO dates, absolute URLs, graph shape), `lib/content.ts` loaders (fixture collections), date utils. Coverage threshold modest (≥70% on `lib/`).

### T6.3 — E2E smoke (Playwright) · INFRA-03
Script: visit all §1.2 routes → expect 200, unique titles, zero console errors; axe scan on home + a post (serious violations fail); contact-form happy path (mocked Resend) + honeypot rejection.

### T6.4 — CI (GitHub Actions) · INFRA-03
PR pipeline: `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `content:check` → `test` → `build` → Lighthouse CI vs budgets (§11) on preview URL → Playwright smoke. Main merges auto-deploy via Vercel. Required status checks enabled.

### T6.5 — Security & caching headers · INFRA-01, SEO-05 tag
In `next.config headers()`:
```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy-Report-Only: (default-src 'self'; img-src 'self' data: blob: https://*.vercel-cdn.example; script-src 'self' 'unsafe-inline' https://plausible.io; …)   # enforce after report window
X-Robots-Tag on /api/: noindex
```
Static assets: immutable long-cache (hashed builds); `/docs/*` cache 1 h s-max 1 d.

### T6.6 — Observability & error surfacing · INFRA-03
Vercel Observability + Speed Insights adopted (D6). ErrorBoundary ported with structured logging to console + Vercel drain; Sentry explicitly deferred (§10) with decision record.

### T6.7 — Focus management & final a11y sweep · UX-05
Route-change focus moves to `main` (`usePathname` effect), skip-link retained, drawer focus trap verified, visible-focus styles consistent, target-size audit (dots/buttons ≥24 px effective).

### T6.8 — Docs refresh · INFRA-04
README rewritten to target architecture (quickstart pnpm, content-authoring guide "how to add a post/venture", env var table, deploy notes); `docs/runbook.md` (launch checklist, rollback, monthly maintenance); decision records folder seeded (0001 RSC boundaries, 0002 single-font, 0003 third-party policy, 0004 analytics choice).

### T6.9 — Launch sequence (executed, ticked in runbook)
1. Merge final → Vercel prod deploy green.
2. Verify redirects table live (spot curl).
3. GSC: submit sitemap; request indexing for 5 key URLs; Bing import.
4. Rich Results Test ×3 routes; social debugger refresh ×3 routes.
5. Field-device smoke (mid-range Android, 4G): LCP/CLS/INP within budget; analytics receiving.
6. Announce-ready state: press hub + og cards confirmed visually in WhatsApp group test.
7. Tag release `v4.0.0`; CHANGELOG entry; archive legacy branch note.

---

## 9. Execution Order & Effort

Dependency-ordered; effort assumes focused solo work (S ≤½ day, M ≈1 day, L ≈2–3 days):

| Order | Task | Effort | Depends on |
|---|---|---|---|
| 1 | T0.1–T0.5 (truth & copy) | M+M+M+S+S | your copy approval |
| 2 | T1.1 scaffold/deps | S | — |
| 3 | T1.2 MUI/Next, T1.3 fonts, T1.4 routes/redirects/404 | L | 1 |
| 4 | T2.1 content system | L | 3 |
| 5 | T2.2 decompose, T2.3 carousel, T2.4 SmartImage | L+L+M | 4 |
| 6 | T3.1–T3.7 media & bundle | L | 5 (masters can start early) |
| 7 | T4.1–T4.6 SEO suite | L | 5 |
| 8 | T5.1–T5.8 advancements | L total | 5 (form/newsletter need env keys) |
| 9 | T6.1–T6.8 quality/hardening | L | parallel from 5 onward |
| 10 | T1.5 parity cutover + T6.9 launch | M | everything above |

Critical path: 1→3→4→5→7→10. Realistic calendar: **~3 weeks focused**, calendar-safe **4 weeks** with review gates (copy sign-off, font visual sign-off, cutover sign-off).

**Env vars to provision early:** `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_BUTTONDOWN_URL?`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN?`.

---

## 10. Explicit Non-Goals (deferred, with reasons)

| Item | Why deferred |
|---|---|
| Full EN/RW localization (hreflang, dual content) | High value later; needs translation quality bar. Structure already locale-ready (content collections keyed by file, `og:locale` centralized). |
| Comments (Giscus), webmentions | Audience-dependent; revisit once writing cadence exists. |
| Offline PWA/service worker | Personal site; SW staleness risks > benefit. Manifest/icons polished only. |
| CMS admin UI (Decap/Payload) | MDX-in-repo is fine solo; revisit if non-dev editors appear. |
| Sentry | Vercel observability sufficient at this scale; decision record allows cheap addition. |
| Client-side search, command palette | Writing index + tags covers discovery at n≈posts<50. |
| CSP enforcement (from Report-Only) | Second iteration after report window. |

---

## 11. Definition of Done — Production-Ready Checklist

The site is declared production-ready **only when every box below passes**. Budget numbers are enforced by CI where marked ⚙️.

**Truth & brand**
- [ ] Zero instances of "Co-Founder", wrong year, skill chips, or non-canonical handles (automated copy-lint + human pass) · BRAND-01…06
- [ ] Every public claim traceable to ATAS doc or your explicit approval

**Performance (⚙️ budgets in CI)**
- [ ] Homepage transfer ≤1.5 MB on throttled slow-4G; no route >2 MB · PERF-01/02
- [ ] No fake loading delays; idle CPU quiet after settle · PERF-03/04/05
- [ ] LCP <2.0 s · CLS <0.05 · INP <200 ms (Lab + field Speed Insights) · PERF-07, UX-04
- [ ] First-load JS ≤250 KB gz (home), ≤300 KB worst route · PERF-08/09
- [ ] Exactly one font family, preloaded, no FOUT · D9/PERF-07

**SEO & discoverability**
- [ ] 100% routes serve unique title/meta/canonical/OG in raw HTML (no JS) · SEO-01/02
- [ ] Rich Results Test: 0 errors; ISO dates validated by unit test · SEO-04
- [ ] OG cards render correctly in X/LinkedIn/WhatsApp debuggers · SEO-03
- [ ] Sitemap (with lastmod), robots, RSS, llms.txt all live & valid · SEO-07 + advancements
- [ ] Unknown URLs → real 404; legacy URLs → 301 map verified · SEO-05
- [ ] GSC submitted; zero coverage errors after first crawl cycle · T4.6

**Experience & accessibility**
- [ ] Carousels: pause controls, ≥44 px targets, reduced-motion honored, no countdown badges · UX-01/02/03
- [ ] Keyboard-only walkthrough completes all tasks; focus managed on navigation · UX-05
- [ ] axe serious violations = 0 on key pages · UX-06
- [ ] Dark mode: no flash, consistent tokens, AA contrast on overlays

**Engineering & operations**
- [ ] Single lockfile (pnpm); zero unused deps; monolith gone (largest component <300 lines) · CODE-03/04, ARCH-01
- [ ] Content layer: adding a post/venture requires only a content file (validated by dry-run) · ARCH-02
- [ ] CI green gate: lint, typecheck, content check, unit, e2e smoke, Lighthouse budgets · INFRA-03
- [ ] Headers suite live; CSP report-only running clean · INFRA-01
- [ ] Analytics receiving (VA + Speed Insights + Plausible events); `/privacy` accurate · D6, INFRA-02
- [ ] Runbook executed end-to-end; rollback tested; release tagged · T6.9

---

## 12. Traceability Matrix — Audit ID → Resolution

| Audit ID | Resolved by | Verified in |
|---|---|---|
| BRAND-01 | T0.2, T2.2 | §11 truth checks |
| BRAND-02 | T0.1, T0.3, T0.4, T0.5 | §11 truth checks |
| BRAND-03 | T0.1 (D2/D3), T4.1 | meta assertion script |
| BRAND-04 | T1.4 (nav/IA), T5.3 (press), hero CTAs T0.2 | IA §1.2 live |
| BRAND-05 | T0.2 metrics rewrite | copy review |
| BRAND-06 | T0.1 (dynamic year), T0.5 | grep checks |
| PERF-01 | T3.1, T3.2 | transfer budget ⚙️ |
| PERF-02 | T2.3 | network waterfall review |
| PERF-03 | T2.2 | grep + LCP lab |
| PERF-04/05 | T2.3, T3.5 | profiler screenshots |
| PERF-06 | T2.4 | zero raw img |
| PERF-07 | T1.3, T3.3 | font waterfall, CLS |
| PERF-08 | T1.1 dep purge, T3.4 | bundle analyzer ⚙️ |
| PERF-09 | T3.4 decision record | docs/decisions |
| SEO-01/02 | T1.x cutover + T4.1 | view-source assertions ⚙️ |
| SEO-03 | T4.3 | debugger screenshots |
| SEO-04 | T4.2 + unit tests | Rich Results |
| SEO-05 | T1.4 404 + T4.5 + T6.5 | crawler sim |
| SEO-06 | T4.1 head cleanup | head audit |
| SEO-07 | slugs (T1.4/T2.1), sitemap T4.4 | sitemap diff |
| SEO-08 | real routes replace anchors (T1.4) | nav audit |
| ARCH-01 | T2.2 decomposition | LOC lint |
| ARCH-02 | T2.1 content system | dry-run author flow |
| ARCH-03 | shared modules T2.3/T2.4/T4.1 | code review |
| ARCH-04 | T1 structure + rename sweep | repo tree |
| ARCH-05 | D1 migration (Phase 1) | cutover checklist |
| CODE-03 | T1.1, T6.1 | depcount/lockfile ⚙️ |
| CODE-04 | T6.1 | lint clean ⚙️ |
| UX-01 | T2.3 + T5.4 | emulation test |
| UX-02 | T2.3 targets/pause | axe + manual |
| UX-03 | T2.3 (badges removed) | visual |
| UX-04 | T2.4 + T3.3 | CLS ⚙️ |
| UX-05 | T6.7 | keyboard walkthrough |
| UX-06 | T5.8 | contrast audit |
| INFRA-01 | T6.5 | header curl suite |
| INFRA-02 | D6 + T5.7 + facade | dashboards live |
| INFRA-03 | T6.2–T6.4, T6.6 | CI green ⚙️ |
| INFRA-04 | T6.8 | docs review |

**Advancements delivered beyond audit fixes:** `/writing` index + filters, `/now`, `/press` hub, `/contact` form infra, newsletter capture, RSS, `llms.txt`, dynamic OG engine, dark-mode systemization, single-font design refresh, content validation gate, full CI quality gate, colophon (optional).

---

## 13. Risk Register (top 5)

| Risk | Mitigation |
|---|---|
| MUI/Emotion RSC friction inflates Phase 1 | Decision record locks client-island pattern; escape hatch documented; parity gate protects quality |
| Copy approval stalls Phase 0 | Draft deck provided upfront (T0.2); async approval deadline; plan proceeds on drafts marked provisional |
| Image masters reveal missing/low-res sources | T3.1 audit step lists assets needing re-export; placeholders acceptable short-term, flagged in PR |
| Legacy inbound links to /blog/N break trust | 301 map + GSC monitoring in runbook; redirect tests in CI |
| Scope creep during advancements (T5.*) | Advancements env-gated & severable; DoD unaffected if a T5 item ships dark (hidden without env keys) |

---

*End of implementation plan. Build order begins at Phase 0 upon your copy-deck approval.*
