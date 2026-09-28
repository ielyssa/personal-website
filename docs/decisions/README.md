# Decision Records

Short-lived rationale notes for architectural choices. Newest at bottom.

## 0001 — RSC boundaries with MUI/Emotion

MUI components are client components; function-valued `sx` cannot cross the server→client boundary. Convention: **pages stay server components** (metadata, data loading, static layout) and keep `sx` values serializable (CSS variables or literals); **interactive/animated trees are `'use client'`** (features/*, components with state). Client components still server-render their HTML, so SEO is unaffected. Escape hatch used where a hover-shadow needed a theme value inside a server page: static rgba string.

## 0002 — Single font family (DM Sans/system stack)

Barlow (secondary heading font) removed: headings use one DM Sans-first system stack, differentiated by weight 800 + tighter tracking. The stack is defined locally so builds do not depend on a font CDN and the browser can use DM Sans when installed, with deterministic system fallbacks otherwise.

## 0003 — Third-party payload policy

Only allowed runtime third parties: analytics (Vercel Analytics/Speed Insights always; Plausible only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, loaded `lazyOnload`; Google Analytics 4 only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set). No font CDNs, no email vendor, no chat widgets, no tag-manager sprawl. New third parties require a decision record.

## 0004 — Analytics stack

Google Analytics 4 is the owner-facing measurement system for pageviews and interaction events when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured. Vercel Analytics remains as a privacy-friendly aggregate pageview baseline and Speed Insights remains the performance signal; Plausible remains available for cookieless custom events. The shared `trackEvent` facade sends to every configured event provider so enabling GA4 does not silently discard existing measurements.

## 0005 — Build-time OG image generation (deviation from plan)

Plan called for `opengraph-image.tsx` routes with `next/og` ImageResponse. Implemented instead as `scripts/generate-og.mjs` (sharp + SVG templates → 22 configured static PNGs in `public/og/`, run automatically prebuild). Existing files are preserved by default so externally designed cards are not overwritten; `--force` explicitly regenerates fallback cards. Rationale: deterministic output, no runtime/edge font-loading risk, zero serverless invocations, pixel-identical results. Outcome identical for scrapers.

## 0006 — Content gate via Vitest instead of standalone script

Plan listed `scripts/verify-content.mjs`. Implemented as `tests/content.test.ts` (zod-parses every collection, asserts ISO dates, unique slugs, manifest coverage) run in CI before build — same gate, no duplicate TS-runtime tooling.

## 0007 — pnpm 11 build-scripts approval

pnpm 11 blocks postinstall scripts by default. `sharp`/`esbuild`/`unrs-resolver` are approved via `pnpm-workspace.yaml` `onlyBuiltDependencies` (the `pnpm` field in package.json is deprecated in pnpm 11). CI uses pnpm 9 via `pnpm/action-setup` where the field is still read; both paths covered.
