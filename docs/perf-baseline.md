# Performance Baseline — v4.0.0 (Next.js migration)

Measured locally, 2026-08-25. CI budgets in `lighthouserc.json` enforce the contract; field data comes from Vercel Speed Insights post-launch.

## Bundle size (from `next build`, gzip)

| Route | First Load JS | Budget | Status |
|---|---|---|---|
| `/` (home) | **219 kB** | 250 kB | ✅ |
| `/writing` | 165 kB | 300 kB | ✅ |
| `/work` | 175 kB | 300 kB | ✅ |
| `/work/[slug]` | 180 kB | 300 kB | ✅ |
| `/writing/[slug]` | 174 kB | 300 kB | ✅ |
| `/press` | 168 kB | 300 kB | ✅ |
| `/now` | 133 kB | 300 kB | ✅ |
| shared | 102 kB | — | — |

## Media weight

| Metric | v3 (Vite SPA) | v4 (this build) |
|---|---|---|
| Source images shipped | ~31 MB raw PNG | ~1.0 MB WebP masters |
| Homepage reachable images | ~25 MB | ~350 KB (AVIF/WebP delivered by `next/image`, per-viewport sizes) |
| Largest single image | 5.4 MB | ~102 KB |
| Blur placeholders | none | every image (zero CLS) |

## Runtime behavior

- No artificial loading delays (removed 800 ms/550 ms fake skeletons).
- No recurring JS timers on idle — carousel autoplay is timeout-based, pauses off-screen/hidden/hover/focus; progress bar is pure CSS.
- Carousels mount active + neighbor slides only.
- Fonts: one family, preloaded, `display: swap` with fallback metrics.
- All routes serve complete HTML without JS (verified via `curl` in e2e suite).

## Verification commands

```bash
pnpm run ci                      # lint + typecheck + unit + build (prints First Load JS table)
pnpm exec playwright test        # smoke + redirects + 404 + axe
npx @lhci/cli autorun            # Lighthouse budgets (needs Chrome)
```
