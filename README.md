# ielyssa.com — Personal Website of IRANKUNDA Elyssa

> **Founder & CEO of ATAS** (Alliance for Transformative AI Systems) — building AI that understands Rwanda.
> Live: [ielyssa.com](https://ielyssa.com) · Company: [atas.rw](https://atas.rw)

Production Next.js 15 (App Router) website — statically rendered, content-driven, accessibility-audited, and CI-gated.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router (SSG-first) + React 19 + TypeScript (strict) |
| UI | MUI v7 + Emotion (CSS variables, light/dark via `data-theme`, no-flash init script) |
| Content | MDX collections in `content/` with zod-validated frontmatter |
| Media | `sharp` master pipeline → WebP + blur placeholders → `next/image` (AVIF/WebP) |
| Fonts | DM Sans Variable via `next/font` (single family, preloaded) |
| Email | Resend (contact form, env-gated) · Buttondown (newsletter, env-gated) |
| Analytics | Vercel Analytics + Speed Insights; Plausible behind `trackEvent` facade (env-gated) |
| Testing | Vitest (content + SEO gates) · Playwright (smoke + axe a11y) · Lighthouse CI budgets |
| CI | GitHub Actions — lint → typecheck → unit → build → e2e |

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Full verification (what CI runs):

```bash
pnpm run og     # regenerate OG images (also runs automatically prebuild)
pnpm run ci     # lint + typecheck + unit tests + build
pnpm exec playwright test   # e2e smoke + accessibility (builds must exist)
```

## Editing content (no code required)

| To change… | Edit… |
|---|---|
| Name, role line, contacts, socials | `content/site.ts` |
| Home hero/about copy, focus metrics | `src/features/identity/*`, `content/home.ts` |
| A venture / case study | `content/work/<slug>.mdx` (frontmatter: name, status, period, summary, cover, facts, gallery) |
| A blog post | `content/writing/<slug>.mdx` (frontmatter: title, slug, summary, publishedAt, updatedAt, tags, cover) |
| Speaking topics / engagements | `content/speaking.ts` |
| Press bios & fact sheet | `content/press.ts` |
| “Now” page | `content/now.mdx` |

Rules enforced by tests + build:
- Dates are ISO (`YYYY-MM-DD`).
- Slugs are kebab-case and unique.
- Every image referenced must exist in `src/lib/media-manifest.json` (run `pnpm run media` after adding originals to `content/originals/`).

### Adding an image

1. Drop the original into `content/originals/<folder>/`.
2. Add a job line in `scripts/prep-media.mjs`.
3. Run `pnpm run media` — the WebP master + blur entry are generated.
4. Reference the `/media/...` path in content.

## Routes

```
/                      Home (hero, about, focus, ATAS spotlight, work, writing, contact)
/work                  Venture index        /work/[slug]        Venture detail
/writing               Writing index        /writing/[slug]     Post detail
/speaking              Speaking topics      /press              Press kit
/now                   Current focus        /contact            Contact
/privacy               Privacy              /feed.xml           RSS
/sitemap.xml           Generated            /robots.txt         Generated
/llms.txt              AI-crawler brief
```

Legacy URLs (`/blog/:id`, `/projects/:slug`, `/atas`, `/assets/docs/*`) 301-redirect in `next.config.mjs`.

## Environment variables

Copy `.env.example` → `.env.local`. Everything except the site URL is optional; features degrade gracefully.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (defaults to `https://ielyssa.com`) |
| `RESEND_API_KEY` | Enables the contact form (without it: mailto fallback) |
| `CONTACT_FROM` / `CONTACT_TO_EMAIL` | Email routing overrides |
| `NEXT_PUBLIC_BUTTONDOWN_URL` | Enables the newsletter block |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Enables Plausible custom-event analytics |

## Project structure

```
content/            # single source of truth for identity + all content
  originals/        # source images (never served directly)
src/
  app/              # routes, metadata, sitemap/robots/feed/llms, api/contact
  features/         # page sections grouped by domain (identity, ventures, writing, …)
  components/       # design-system: ui/, media/ (SmartImage, Carousel), layout/, motion/
  lib/              # content loaders (zod), SEO/JSON-LD builders, analytics, nav, media manifest
  theme/            # MUI theme + client ThemeRegistry
scripts/            # prep-media.mjs (sharp), generate-og.mjs (branded OG cards)
e2e/                # Playwright smoke + axe accessibility
tests/              # Vitest: content validation + SEO/JSON-LD gates
docs/               # audit, implementation plan, runbook, decision records
```

## Performance budgets (CI-enforced via Lighthouse)

- LCP < 2.5 s · CLS < 0.05 · total page weight < 1.6 MB
- Performance ≥ 90 · Accessibility ≥ 95 · Best practices ≥ 95 · SEO = 100
- First-load JS: home 219 kB gz (budget 250 kB)

## Deployment (Vercel)

- Framework preset: Next.js (auto). Region: `fra1`. Package manager: pnpm.
- Set the env vars above in the Vercel dashboard.
- Deploys run on every push to `main` (CI must pass first).
- See `docs/runbook.md` for launch/rollback/maintenance procedures.

## License

MIT — © IRANKUNDA Elyssa
