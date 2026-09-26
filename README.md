# Barkat — home decor & gifting

Next.js App Router + React + TypeScript; plain CSS, local JSON catalog, self-hosted fonts through next/font. Static export is written to `out/`. The old `dist/` is retained as a reference and is not deployed.

## Run

Node.js 20.9+ (Node 24 used here).

```powershell
npm install
npm run dev
```

Open http://localhost:3000. For a production preview:

```powershell
npm run build
npm start
```

The build validates catalog data and creates static prefetch aliases required by generic static hosts. Netlify hosts the exported site with its CDN.

## Content

- `data/products.json`: canonical catalog; types wax/vessel/scent/hamper; prices and MRP in INR. Discount = round((1-price/mrp)*100). Existing fragrance/vessel prices were preserved; additional prices, MRP, shade names and hamper combinations are explicitly sample data, as requested.
- `data/contact.json`: verified brand email, international WhatsApp digits and HTTPS social links. Set `verified: true` only after supplying real destinations. Sample email uses the reserved .example domain. The form validates but does not transmit while unverified. No backend or personal-data storage.
- `public/assets/vessels/`: unchanged Vase1 reference, Vase2–Vase13 AI-retouched full-resolution PNGs and smaller WebP derivatives. See `docs/IMAGE_EDITS.md` for exact prompts and provenance.
- `components/`: shared bag/dialogs, catalogs, pricing, pour demo, ritual, contact, product controls.
- `lib/`: catalog validation, bag sanitation, currency and route metadata.
- New vessel display names and materials are provisional descriptions inferred from supplied images. Candle suitability and dimensions are not asserted.

## Checks

```powershell
npm test
npm run typecheck
npm run build
npm run test:e2e
```

Browser tests use installed Chrome. For optional browser smoke tests:

```powershell
npx playwright install firefox webkit
node scripts/cross-browser.mjs
```

With `npm start` running, `node scripts/check-routes.mjs`, `node scripts/screenshots.mjs`, and `node scripts/lighthouse.mjs` write reports to `qa/`. Automated checks do not replace manual screen-reader and actual-device review.

## GitHub and Netlify

Private repository: https://github.com/ultraodysseus07/barkat-website

Live preview: https://barkat-website-ultraodysseus07.netlify.app

Deploy from this repository directory using the authenticated Netlify CLI:

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'https://barkat-website-ultraodysseus07.netlify.app'
npm run build
npx netlify-cli deploy --prod --dir out --no-build
```

Deployment currently uses the CLI; pushing GitHub alone does not publish changes. Local Netlify account state is ignored. Existing Git history and unrelated legacy changes are preserved.

`netlify.toml` sets Node 24, build command `npm run build`, output `out`, canonical origin and security headers. Next.js runs as a static export, not a server plugin. Retain generated dotted prefetch aliases. Do not use the former OpenAI hosting config.

## Launch requirements

Confirm real prices/MRP/discounts, shade availability, hamper contents, material/dimension specifications, candle compatibility, and final photo accuracy. Replace illustrative hamper/hero compositions with approved photography if desired. Configure real social/contact destinations. Then set `NEXT_PUBLIC_LAUNCH_READY=true` and rebuild to allow indexing. Until then, intentional noindex lowers Lighthouse SEO. Checkout/payments remain out of scope.

`netlify.toml` sets nosniff, referrer policy, permissions policy and CSP. Static Next hydration currently requires inline scripts/styles; the policy permits those but no third-party scripts, fonts, objects, or framing. For a stricter script policy, adopt per-page build-time hashes or a nonce-capable server deployment; do not remove inline permission without supplying those mechanisms.

See `docs/IMPLEMENTATION.md` for verified results and limitations.
