# Developer Guide — ielyssa.com

The complete reference for working on this project. Read [README.md](../README.md) first for the 1-minute overview; this document is the deep dive.

**Last verified:** 2026-08-25 against v4.0.0 (Next.js 15.5, MUI 7.3, React 19).

---

## Table of contents

1. [Mental model — how the site works](#1-mental-model)
2. [Local development](#2-local-development)
3. [Recipes — "how do I…?"](#3-recipes)
   - 3.1 Publish a blog post
   - 3.2 Edit a venture/case-study page
   - 3.3 Add a new venture
   - 3.4 Add or replace an image
   - 3.5 Change identity facts (name, role, socials, contacts)
   - 3.6 Change site-wide design (colors, fonts, spacing)
   - 3.7 Add a new page
   - 3.8 Edit the home page sections
   - 3.9 Update speaking engagements
   - 3.10 Update the press kit
   - 3.11 Regenerate social-share (OG) images
   - 3.12 Change navigation or footer links
4. [Architecture reference](#4-architecture-reference)
   - 4.1 Rendering model & the server/client boundary
   - 4.2 Content pipeline (frontmatter → zod → pages)
   - 4.3 Image pipeline
   - 4.4 SEO system (metadata, JSON-LD, sitemap, RSS, llms.txt)
   - 4.5 Theme & styling rules
   - 4.6 Icons
   - 4.7 Analytics
   - 4.8 Forms & email
5. [Testing & quality gates](#5-testing--quality-gates)
6. [Deployment](#6-deployment)
7. [Troubleshooting](#7-troubleshooting)
8. [Conventions & guardrails](#8-conventions--guardrails)

---

## 1. Mental model

The site is a **static, content-driven website**. Three layers, strictly separated:

```
content/          ← WHAT the site says (markdown + typed config) — edit freely
src/lib/          ← HOW content becomes data (loaders, SEO builders) — rarely touched
src/app/          ← WHERE data becomes pages (routes, metadata) — structural changes only
src/features/     ← WHAT pages look like (section components) — visual changes
```

**The golden rule:** content changes happen in `content/` and require **zero code changes**. If you find yourself editing a `.tsx` file to change what the site *says* (not how it looks), something is wrong — the content model probably needs a new field instead.

**Data flow for a blog post:**

```
content/writing/my-post.mdx
  → src/lib/content.ts (gray-matter parse + zod validate + reading-time)
    → src/app/writing/[slug]/page.tsx (generateStaticParams + generateMetadata + MDXRemote)
      → prebuilt HTML at /writing/my-post (also: sitemap.xml, feed.xml, llms.txt updated automatically)
```

Everything is prerendered at build time. There is no database, no CMS, no runtime content fetch. The only dynamic endpoint is `/api/contact` (email sending).

---

## 2. Local development

```bash
pnpm install                 # once
pnpm dev                     # dev server → http://localhost:3000
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build (runs OG generation first via `prebuild`) |
| `pnpm start` | Serve the production build locally |
| `pnpm lint` | ESLint (next/core-web-vitals + TS) |
| `pnpm typecheck` | `tsc --noEmit` (strict) |
| `pnpm test` | Vitest unit suite — **content validation gate** |
| `pnpm test:e2e` | Playwright: routes, redirects, 404, axe accessibility |
| `pnpm media` | Regenerate optimized WebP images from `content/originals/` |
| `pnpm og` | Regenerate social-share OG cards |
| `pnpm format` | Prettier write |

**Recommended pre-push check** (what CI runs): `pnpm run ci && pnpm exec playwright test`

Requirements: Node ≥ 20.9, pnpm ≥ 9 (`corepack enable` if missing).

---

## 3. Recipes

### 3.1 Publish a blog post

1. Create `content/writing/my-post-slug.mdx`:

```mdx
---
title: "My Post Title"            # quote it if it contains a colon!
slug: my-post-slug                # kebab-case, must match filename, unique
summary: "One-sentence summary used in listings, meta description, and RSS."
publishedAt: 2026-09-15           # ISO date (YYYY-MM-DD)
updatedAt: 2026-09-20             # optional
tags:
  - Entrepreneurship              # drives /writing tag filters
  - ATAS
cover: /media/blog/my-post.webp   # must exist in src/lib/media-manifest.json (see 3.4)
---

Your content in **markdown**. Starts with `##` sections — the H1 is rendered
from `title` automatically, so don't repeat it.

## A section

Normal markdown works: **bold**, [links](https://atas.rw), lists, `code`, > quotes.
```

2. Run `pnpm test` — the content gate validates frontmatter and tells you exactly what's wrong if not.
3. `pnpm dev` and check `/writing` and `/writing/my-post-slug`.

**Automatic side effects:** sitemap entry, RSS item, `llms.txt` listing, reading time, tag filter — all derived, nothing to register.

**OG image:** a default branded card is generated from the title. For a custom card, add an entry to `scripts/generate-og.mjs` (see 3.11).

> ⚠️ YAML gotcha: values containing `:` (like most titles) **must be quoted**. Dates must be ISO. The build fails with the file name and field if not.

### 3.2 Edit a venture/case-study page

Ventures live in `content/work/<slug>.mdx` (currently: `atas`, `academiaplus`, `imizi`, `edubridge`, `kinyarwanda-tts`).

```mdx
---
name: AcademiaPlus
slug: academiaplus
status: active            # active | research | earlier — drives chip color + ordering
period: 2025 — present
summary: "Shown on cards, meta description, and llms.txt."
cover: /media/work/academiaplus-01.webp
website: https://academiaplus.net    # optional "Visit" button
facts:                    # rendered in the sidebar "Facts" card
  Status: Entering first schools next term
  Users: Schools, teachers, students
gallery:                  # optional carousel under the header
  - src: /media/work/academiaplus-01.webp
    caption: Alt text + caption shown on the slide
---

Body markdown, rendered under the summary.
```

Order on listing pages: `active` → `research` → `earlier` (fixed in `src/lib/content.ts`).

### 3.3 Add a new venture

1. Create `content/work/new-venture.mdx` (copy an existing file's shape).
2. Add its logo to `src/app/work/[slug]/page.tsx` in the `LOGOS` map (or it falls back to a plain avatar).
3. Add an OG card entry in `scripts/generate-og.mjs` (`works` array) → `pnpm run og`.
4. It appears automatically on `/work`, home Work highlights (first 3 non-ATAS by status order), sitemap, and `llms.txt`.

### 3.4 Add or replace an image

Images are **never referenced from `content/originals/` directly**. The pipeline:

```
content/originals/<you-drop-here>.png
  → scripts/prep-media.mjs job line
    → public/media/<category>/<name>.webp + entry in src/lib/media-manifest.json
      → referenced as /media/<category>/<name>.webp in content or components
```

Steps:

1. Drop the original (PNG/JPG, any size) into `content/originals/` (subfolders by category: `projects/`, `blog/`, `focus/`, `logo/`).
2. Open `scripts/prep-media.mjs`, add a job line:

```js
{ input: 'blog/my-post.png', out: 'media/blog/my-post.webp', width: 1600, crop: [16, 9], quality: 80 },
```

   - `crop: [w, h]` = center-crop to aspect ratio; omit to keep aspect.
   - `quality`: 74–80 for photos/screens, 88+ for logos.
3. Run `pnpm media`. It prints each output's dimensions + size and updates the manifest (width/height/blur placeholder).
4. Reference `/media/blog/my-post.webp` in your content.

**Why the manifest matters:** `SmartImage` reads dimensions + blur placeholder from it, guaranteeing zero layout shift. If you reference a path not in the manifest you'll see a grey box and a dev-mode console warning. Tests will also catch it.

**Sizing guidance:** blog covers 1600×900 · venture screens 1440w · focus slides 1400w · logos 256w · avatar 800×800.

### 3.5 Change identity facts (name, role, socials, contacts)

**One file: `content/site.ts`.** Name, role line, positioning line, email, phone, location, founding year, all social URLs (personal + ATAS).

It feeds: header/footer, hero, about card, contact section, press page, all metadata, all JSON-LD (`sameAs`, `founder`, `worksFor`), `llms.txt`, RSS, contact form recipient. Change it once; everywhere updates.

Never hardcode these values in components — if you find one, move it to `site.ts`.

### 3.6 Change site-wide design

**Colors & component styles:** `src/theme/theme.ts`
- Brand palette is in the `brand` const (used by both light/dark schemes).
- Light/dark backgrounds + text: in `colorSchemes.light` / `colorSchemes.dark`.
- Component overrides (Button, Card, Chip): in `components`. Note the **contrast-tuned** values: contained buttons use `#0B63D8` (not brand blue) because white-on-#1877F2 fails WCAG AA — don't revert without re-running axe tests.
- `customShadows` are plain rgba strings (theme-safe for server components).

**Typography:** `src/theme/theme.ts` `typography` block. The font family is injected as `var(--font-dm-sans)` from `src/app/layout.tsx` (`next/font`). To change fonts: edit the `DM_Sans` import in `layout.tsx` + the string passed to `buildTheme` in `ThemeRegistry.tsx`. Keep to ONE family (decision 0002).

**Global CSS** (prose styling, selection, focus rings, reduced-motion): `src/app/globals.css`.

**Dark mode:** driven by `data-theme` attribute on `<html>`; the inline script in `layout.tsx` applies it pre-paint from `localStorage('mui-mode')` or system preference. The toggle in the header writes via MUI's `useColorScheme`. No flash by design — don't remove the inline script.

### 3.7 Add a new page

1. Create the route: `src/app/<name>/page.tsx`. Minimum:

```tsx
import { Container } from '@mui/material';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Page Title',
  description: 'One sentence for search + social.',
  path: '/<name>',
});

export default function Page() {
  return <Container sx={{ py: { xs: 6, md: 9 } }}>…</Container>;
}
```

   This alone gets you: unique title/canonical/OG/Twitter tags + a generated OG card (if a matching entry exists — else the default card).

2. Add an OG card entry in `scripts/generate-og.mjs` and run `pnpm og`.
3. If it should be in the sitemap: add to `src/app/sitemap.ts` `staticRoutes`.
4. If it should be in the header/footer: `src/lib/nav.ts` (`NAV_ITEMS` / `FOOTER_LINKS`).
5. If content-driven: put the content in `content/` and load it in the server component (see 4.2).

**Server/client rule:** keep `page.tsx` a server component (no `'use client'`, no event handlers, no function-valued `sx`). Interactive pieces go in `src/features/<domain>/Something.tsx` with `'use client'` at the top, receiving data via props. Function-valued `sx` (`(th) => …`) is **banned in server components** — it crashes the build; use CSS variables (`var(--mui-palette-…)`) or static rgba strings.

### 3.8 Edit the home page sections

Home composes sections in `src/app/page.tsx`. Each section is a component in `src/features/`:

| Section | File | Content source |
|---|---|---|
| Hero | `features/identity/Hero.tsx` | `content/site.ts` |
| About | `features/identity/AboutSection.tsx` | `content/site.ts` |
| Focus band | `features/focus/FocusSection.tsx` | `content/home.ts` (slides + metrics) |
| ATAS spotlight | `features/ventures/VentureSpotlight.tsx` | hardcoded copy + gallery array in the file |
| Work highlights | `features/ventures/WorkHighlights.tsx` | `content/work/*` (auto) |
| Writing preview | `features/writing/WritingPreview.tsx` | `content/writing/*` (auto) |
| Contact | `features/contact/ContactSection.tsx` | `content/site.ts`, `content/home.ts` |

To reorder/remove sections: edit `src/app/page.tsx`. To rewrite copy: prefer moving it to `content/` and passing props (the established pattern).

### 3.9 Update speaking engagements

`content/speaking.ts`: add to `engagements[]` (`title`, `venue`, `year`). The page shows the honest empty-state automatically while the array is empty.

### 3.10 Update the press kit

`content/press.ts`: `shortBio`, `longBio` (paragraphs separated by blank lines), `boilerplate`, `factSheet` rows, `downloads` (files live in `public/docs/` — replace the PDFs there, keep the same names or update paths).

### 3.11 Regenerate social-share (OG) images

OG cards are **static PNGs** generated by `scripts/generate-og.mjs` (sharp + SVG), run automatically before every build (`prebuild` script). 16 cards → `public/og/*.png`.

- Add/edit cards: edit the `cards` array in the script (title lines, subtitle, optional circular image), then `pnpm og`.
- Pages reference them via `buildMetadata({ ogImage: '/og/<name>.png' })` or the default path convention `/og/<route-with-dashes>.png`.
- Changing a page title does **not** auto-update its OG card text — edit the script entry too (this is deliberate: deterministic, zero-runtime images).

### 3.12 Change navigation or footer links

`src/lib/nav.ts`: `NAV_ITEMS` (header + mobile drawer; `kind: 'section'` links smooth-scroll on home, `kind: 'route'` navigates), `FOOTER_LINKS`, `SOCIAL_PROFILES`.

---

## 4. Architecture reference

### 4.1 Rendering model & the server/client boundary

Every page is **statically prerendered** at build (see the `○/●` table in `pnpm build` output). Only `/api/contact` is dynamic.

| Kind | Where | Rules |
|---|---|---|
| Server components | `src/app/**/page.tsx`, `layout.tsx` | Data loading (`lib/content`), `metadata` exports, static JSX. **No** event handlers, no `useState`, no function-valued `sx`. |
| Client components | `src/features/**` (marked `'use client'`), `components/layout/*`, `components/media/Carousel.tsx`, `components/motion/Reveal.tsx` | Interactivity. Still server-rendered to HTML on first load — SEO is unaffected. |

Data crosses the boundary as **props** (e.g. home page calls `getPosts()` and passes plain objects into `<WritingPreview posts={posts} />`).

`fs`-based loaders (`lib/content.ts`) must only be imported by server code. They're cached per build (`worksCache`/`postsCache`), so call them freely.

### 4.2 Content pipeline

`src/lib/content.ts`:
- Reads `content/writing/*.mdx`, `content/work/*.mdx`, `content/now.mdx` with `gray-matter`.
- Validates frontmatter with **zod schemas** (`postSchema`, `workSchema`) — invalid content fails the build with the exact field.
- Dates: YAML unquoted dates arrive as `Date` objects → preprocessed to ISO strings. Store ISO in frontmatter; format for display only at render (`lib/utils/date.ts`).
- `reading-time` computes `readingMinutes`.

The same validation runs in `tests/content.test.ts` (CI gate) — so `pnpm test` is your content linter.

### 4.3 Image pipeline

See recipe 3.4. Key invariants:
- `src/lib/media-manifest.json` is **generated** (`pnpm media`) — never hand-edit; it's committed because pages depend on it at build.
- `SmartImage` (`components/media/SmartImage.tsx`) is the only sanctioned way to render content images: it guarantees dimensions (no CLS) and blur-up. Modes: `aspect` (fixed ratio box), `fill` (absolute-fill inside a positioned parent), or intrinsic.
- `next/image` config lives in `next.config.mjs` (`formats`, `deviceSizes`). Delivery format/size is automatic per device.

### 4.4 SEO system

All centralized in `src/lib/seo.ts` + `src/lib/jsonld.ts`:

- `buildMetadata({ title, description, path, … })` → canonical, robots, Open Graph, Twitter tags, absolute OG image URL (`metadataBase` in root layout makes relative paths absolute).
- Title template: pages set `title: 'ATAS — ATAS Venture'` → rendered as `ATAS — ATAS Venture` (no suffix duplication; root layout sets the default for `/`).
- JSON-LD: one global graph in `layout.tsx` (`WebSite`, `ProfilePage`, `Person`, `Organization`) + per-page graphs (`Article`, `CreativeWork`, `BreadcrumbList`) via the `<JsonLd data={graph(...)} />` component. Nodes reference each other by `@id`.
- Generated routes: `src/app/sitemap.ts`, `robots.ts`, `feed.xml/route.ts`, `llms.txt/route.ts` — all `force-static`, all derived from the content layer.
- Legacy redirects + security headers + CSP-Report-Only: `next.config.mjs` `redirects()` / `headers()`.

**After changing titles/copy:** OG cards are static — regenerate (3.11) and let scrapers re-fetch (they cache; use platform debuggers).

### 4.5 Theme & styling rules

- MUI v7 with **CSS variables** (`cssVariables.colorSchemeSelector: 'data'`). Light/dark values both defined up front in `createTheme` — switching schemes is a attribute flip, no re-render.
- `ThemeRegistry` (`src/theme/ThemeRegistry.tsx`) is the client boundary: `AppRouterCacheProvider` (Emotion extraction for SSR) + `ThemeProvider` + `CssBaseline`.
- Styling is `sx` prop / `styled()` (Emotion). Two hard rules:
  1. No function-valued `sx` in server components (build crash).
  2. Respect `prefers-reduced-motion` for anything animated — use the existing `useMediaQuery('(prefers-reduced-motion: reduce)')` pattern (see `Carousel`, `Reveal`, `Footer`).
- Accessibility floors are theme-level (contained buttons `#0B63D8`, soft-filled chips, overlines `primary.dark`). Axe tests in CI enforce them — if you change colors, run `pnpm test:e2e`.

### 4.6 Icons

`src/lib/icon-sets.ts` holds **19 offline icon bodies** (fetched once from the Iconify API and embedded — 7.6 KB). `register-icons.ts` loads them into `@iconify/react`; `<Iconify icon="carbon:arrow-right" />` renders instantly with **zero network requests**.

**Adding an icon:** fetch its body from `https://api.iconify.design/<prefix>.json?icons=<name>`, add the entry to `icon-sets.ts` (match the existing format), use it. If an icon isn't in the set, `@iconify/react` silently falls back to a runtime API fetch — avoid that (it causes pop-in and breaks offline/adblock).

### 4.7 Analytics

One facade: `src/lib/analytics.ts` `trackEvent(name, params)` → Plausible (if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) → gtag → console (dev only).

- Vercel Analytics (pageviews) + Speed Insights (Web Vitals) are always on in production (`layout.tsx`); they 404 locally — harmless.
- Events already instrumented: `cta_click`, `venture_open`, `post_open`, `contact_channel_click`, `social_click`, `newsletter_signup`.
- To add tracking: call `trackEvent` in any client component. Server components can't track (no browser) — wrap the interaction in a client child if needed.

### 4.8 Forms & email

`src/app/api/contact/route.ts`: zod validation → honeypot field (`company`) → time-trap (`startedAt` ≥ 2.5 s) → IP rate limit (5/hour) → Resend send.

- **Without `RESEND_API_KEY`** the API returns 503 and the UI renders a mailto card instead (decided at build time — set the key, then redeploy).
- Newsletter block renders only when `NEXT_PUBLIC_BUTTONDOWN_URL` is set (plain form POST to Buttondown).

---

## 5. Testing & quality gates

| Suite | Command | Protects |
|---|---|---|
| Unit (Vitest) | `pnpm test` | Content validity (frontmatter, ISO dates, unique slugs, manifest coverage), SEO builders (absolute URLs, ISO dates in JSON-LD), date utils |
| E2E (Playwright) | `pnpm test:e2e` | All 12 routes render with unique titles + zero console errors, canonicals present, JSON-LD graph valid, legacy redirects, real 404, hero positioning copy, **axe accessibility** (serious/critical = 0 on 3 pages), contact fallback |
| Lighthouse CI | `npx @lhci/cli autorun` | Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO = 100, LCP/CLS/weight budgets (`lighthouserc.json`) |
| ESLint + tsc | `pnpm lint && pnpm typecheck` | Code health, RSC-boundary mistakes |

CI (`.github/workflows/ci.yml`) runs all of it on every PR to `main`. **The unit suite is also the content gate** — a bad frontmatter fails CI before deploy.

Playwright notes: it starts its own server on :3011 (kills any stale one first). The `/_vercel/insights` 404s seen locally are expected (Vercel-only endpoints) and filtered in tests.

---

## 6. Deployment

Vercel (auto-detected Next.js, region `fra1`, pnpm). Push to `main` → CI → deploy. Full procedures, env vars, launch checklist, rollback, and incident playbook: **[runbook.md](runbook.md)**.

Env vars (all optional except site URL): see `.env.example` and README table.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build error: `Functions cannot be passed directly to Client Components` | Function-valued `sx` in a server component | Use `var(--mui-palette-…)` or static rgba; or move the tree into a `'use client'` component |
| Build error: YAMLException on an `.mdx` file | Unquoted `:` in frontmatter value | Quote the value: `title: "My Title: Subtitle"` |
| Build error: `Expected string, received date` (zod) | Hand-edited manifest or non-ISO date | Dates must be `YYYY-MM-DD`; regenerate manifest with `pnpm media` |
| Grey box instead of an image | Path not in `media-manifest.json` | Add the prep job + `pnpm media` (see 3.4) |
| Icon renders blank / pops in late | Icon missing from offline `icon-sets.ts` | Add its body (see 4.6) |
| `getMediaEntry` returns undefined at build | Manifest out of date | `pnpm media` |
| Contact form hidden in production | `RESEND_API_KEY` unset at build time | Set env var in Vercel, redeploy |
| Dark mode flashes white on load | Inline scheme script removed/blocked | Restore the `<script dangerouslySetInnerHTML>` in `layout.tsx` body start |
| Playwright fails with server already running | Stale `next start` on :3011 | Kill node processes, re-run |
| pnpm skips native builds (sharp fails) | pnpm ≥ 11 blocks postinstall by default | `pnpm approve-builds` (allowlist lives in `pnpm-workspace.yaml`) |
| Lighthouse SEO < 100 | Usually robots/canonical regression | Check `robots.ts`, `buildMetadata`, and that `/sitemap.xml` resolves |

---

## 8. Conventions & guardrails

- **Imports:** `@/…` → `src/`, `@content/…` → `content/`. No relative `../../` chains deeper than one level.
- **Layer rules:** `features/*` may import from `components/*`, `lib/*`, `content/*` — never from another feature. `components/*` never import from `features/*`.
- **No hardcoded identity values** (name, email, socials, URLs) outside `content/site.ts`.
- **No raw `<img>`** for content images — use `SmartImage`.
- **No new runtime third-party scripts** without a decision record (`docs/decisions/`).
- **Dates are ISO in content**, formatted only at render.
- **Every color change must pass axe** (`pnpm test:e2e`).
- Commits: conventional-ish one-liners (`feat:`, `fix:`, `docs:`, `chore:`); releases update `CHANGELOG.md`.

**Historical documents:** the audit that started this and the implementation plan it was built from live in [`docs/history/`](history/) — useful context, not operating instructions.
