# Runbook — ielyssa.com

Operational procedures for the production site. Read once before your first deploy; keep for incidents.

## 1. First launch checklist

- [ ] Vercel project connected to `github.com/ielyssa/personal-website`, branch `main`, framework Next.js (auto-detected), package manager pnpm.
- [ ] Env vars set in Vercel (Production + Preview): `NEXT_PUBLIC_SITE_URL=https://ielyssa.com`, plus optional `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_BUTTONDOWN_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- [ ] First deploy green; CI workflow passing on GitHub.
- [ ] Spot-check production: `/`, `/work/atas`, a post, `/press`, `/feed.xml`, `/llms.txt`, `/sitemap.xml`.
- [ ] Redirects live: `curl -I https://ielyssa.com/blog/1` → 308 → `/writing/building-atas-journey`; same for `/projects/academiaplus`, `/atas`.
- [ ] 404 live: any unknown URL returns HTTP 404 with the styled page.
- [ ] Security headers present: `curl -sI https://ielyssa.com | grep -iE 'x-content-type|referrer|strict-transport|security-policy'`.
- [ ] Google Search Console: verify domain, submit `https://ielyssa.com/sitemap.xml`, request indexing for `/`, `/work/atas`, `/writing`.
- [ ] Bing Webmaster: import from GSC.
- [ ] Rich Results Test on `/`, one post, `/work/atas` → 0 errors.
- [ ] Social previews: paste home + one post into WhatsApp, X, LinkedIn (or their debuggers) → branded OG card renders.
- [ ] Field check on a mid-range Android over 4G: LCP < 2.5 s, no layout shift, carousel pauses on touch.
- [ ] Vercel Analytics + Speed Insights receiving data (dashboard).

## 2. Routine publishing

**New post:** create `content/writing/<slug>.mdx` (copy an existing file's frontmatter shape) → commit → push. Build validates frontmatter; sitemap/RSS/`llms.txt` update automatically. OG card: add an entry in `scripts/generate-og.mjs` (or rely on the default card) → `pnpm run og` runs automatically at build.

**Content edit on a venture/press/speaking/now:** edit the file in `content/`, push.

**New image:** original → `content/originals/`, job line in `scripts/prep-media.mjs`, run `pnpm run media` locally, commit generated `public/media/*` + updated `src/lib/media-manifest.json`.

## 3. Rollback

Fastest: Vercel dashboard → Deployments → last good deployment → **Promote to Production** (instant, no rebuild).

Code-level: `git revert <bad-commit>` and push; CI re-gates. The pre-migration SPA is tagged `legacy-vite-spa` for emergency reference only — do not redeploy it (it would undo the SEO migration).

## 4. Incident playbook

| Symptom | Check | Action |
|---|---|---|
| Contact form errors | Vercel function logs for `/api/contact` | 503 = missing `RESEND_API_KEY`; 429 = rate limit working; 502 = Resend issue (fallback copy tells users to email directly) |
| OG previews stale | Scrapers cache aggressively | Use each platform's debugger "scrape again" after deploy |
| Search rankings dip | GSC coverage + Core Web Vitals report | Verify sitemap reachable, no new noindex, redirects intact |
| Build fails on content | CI "Unit tests" step names the file/field | Fix frontmatter (dates ISO, slugs kebab-case, cover path in manifest) |
| Analytics empty | Env var set? Script blocked? | Check `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / Vercel dashboard; site works fully without analytics |

## 5. Maintenance cadence

**Monthly (15 min):** GSC coverage/errors + Core Web Vitals field data; Vercel Speed Insights trends; dependency updates (`pnpm up --interactive` minor/patch only; run full verification after).

**Quarterly:** refresh `content/now.mdx`; verify speaking/press facts still true; review Plausible top-events; re-run `pnpm audit`.

**Yearly:** renew domain; review privacy page accuracy; bump Next.js major only after reading its migration guide.

## 6. Known operating notes

- `/_vercel/insights/script.js` 404s locally — expected; the endpoints only exist on Vercel.
- CSP runs **Report-Only**. After 2–4 clean weeks, flip to enforcing in `next.config.mjs`.
- OG cards are static PNGs generated prebuild — after changing titles/copy, they regenerate automatically on deploy.
- The contact form visibility is decided at build time (server reads `RESEND_API_KEY`); adding the key later requires a redeploy.
