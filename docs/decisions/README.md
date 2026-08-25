# Decision Records

Short-lived rationale notes for architectural choices. Newest at bottom.

## 0001 — RSC boundaries with MUI/Emotion

MUI components are client components; function-valued `sx` cannot cross the server→client boundary. Convention: **pages stay server components** (metadata, data loading, static layout) and keep `sx` values serializable (CSS variables or literals); **interactive/animated trees are `'use client'`** (features/*, components with state). Client components still server-render their HTML, so SEO is unaffected. Escape hatch used where a hover-shadow needed a theme value inside a server page: static rgba string.

## 0002 — Single font family (DM Sans Variable)

Barlow (secondary heading font) removed: −5 font files, one preloaded variable font via `next/font`, no heading FOUT. Headings differentiated by weight 800 + tighter tracking. Visual QA gate passed on the cutover PR.

## 0003 — Third-party payload policy

Only allowed runtime third parties: analytics (Vercel Analytics/Speed Insights always; Plausible only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, loaded `lazyOnload`) and Resend (server-side only). No font CDNs, no chat widgets, no tag-manager sprawl. New third parties require a decision record.

## 0004 — Analytics stack

Vercel Analytics (pageviews) + Speed Insights (Web Vitals) as zero-config baseline; Plausible behind the single `trackEvent` facade for custom events, cookieless, disclosed in `/privacy`. GA4 remains a facade-swap away if ever needed.

## 0005 — Build-time OG image generation (deviation from plan)

Plan called for `opengraph-image.tsx` routes with `next/og` ImageResponse. Implemented instead as `scripts/generate-og.mjs` (sharp + SVG templates → 16 static PNGs in `public/og/`, run automatically prebuild). Rationale: deterministic output, no runtime/edge font-loading risk, zero serverless invocations, pixel-identical results; regeneration is automatic on every build. Outcome identical for scrapers.

## 0006 — Content gate via Vitest instead of standalone script

Plan listed `scripts/verify-content.mjs`. Implemented as `tests/content.test.ts` (zod-parses every collection, asserts ISO dates, unique slugs, manifest coverage) run in CI before build — same gate, no duplicate TS-runtime tooling.

## 0007 — pnpm 11 build-scripts approval

pnpm 11 blocks postinstall scripts by default. `sharp`/`esbuild`/`unrs-resolver` are approved via `pnpm-workspace.yaml` `onlyBuiltDependencies` (the `pnpm` field in package.json is deprecated in pnpm 11). CI uses pnpm 9 via `pnpm/action-setup` where the field is still read; both paths covered.
