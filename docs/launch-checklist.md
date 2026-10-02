# M1 launch checklist

Story 5.7 (#46). Work top to bottom before pointing people at the site. Tick each box in the PR or issue that does the launch.

## 1. Before launch

- [ ] **Open questions answered** in `docs/product-plans/learn-insurance.md`: domain name, and who reviews the legal pages.
- [ ] **Fresh facts re-checked** (story 10.7, #84): TRIA, NFIP, ACA enrollment dates and short-term health plan rules, each with a source.
- [ ] **Legal pages filled in and reviewed**: About, Privacy and Terms of use have no `[TO FILL]` left.
  - Check with `grep -rn "TO FILL" src/content/pages`.
  - Edit them in Keystatic (`/keystatic`) or in `src/content/pages/*.mdoc`.
- [ ] **CI green on `main`**: Lint, typecheck, test, build · Browser tests · Lighthouse budget.
- [ ] **Branch rule on `main`** requires all three CI checks.

## 2. Domain and production deploy

- [ ] Domain bought and added in Vercel → Project → Settings → Domains. Follow Vercel's DNS steps.
- [ ] HTTPS works on the domain, and `www` (or the bare domain) redirects to the main one.
- [ ] The domain is set as the project's **production** domain. The build reads it from `VERCEL_PROJECT_PRODUCTION_URL` for canonical links, the sitemap and `robots.txt`.
- [ ] Redeploy `main` after setting the domain, so the canonical links use it.
- [ ] Production environment variables are set in Vercel (names in `.env.example`). M1 needs none. Epic 6 adds Clerk, Neon and PostHog.

## 3. Smoke test the live site

```bash
BASE_URL=https://<your-domain> pnpm test:smoke
```

This checks that home, a term page, Terms A–Z, search, `robots.txt`, the sitemap and the legal pages load. Then check by hand:

- [ ] Search for a misspelling (e.g. "deductable") shows "Did you mean".
- [ ] Theme picker switches light / dark / high contrast.
- [ ] Cookie banner appears on first visit; "Cookie settings" in the footer reopens it.
- [ ] View the page source of a term page: canonical link and JSON-LD use the real domain.

## 4. Search Console (story 4.7, #38)

- [ ] Add the domain as a property in Google Search Console and verify it (DNS record is easiest).
- [ ] Submit `https://<your-domain>/sitemap-index.xml`.
- [ ] Use URL Inspection on the home page and one term page; request indexing.
- [ ] Optional: run one term page through Google's Rich Results Test (DefinedTerm, FAQ, breadcrumbs).

## 5. After launch

- [ ] Watch Vercel's deployment logs and Search Console coverage for the first week.
- [ ] Note anything that went wrong as a `TODO(edge-cases)` or a new issue.
