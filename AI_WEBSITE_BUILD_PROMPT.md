# Barkat Website — AI Build Brief

Act as a senior UI/UX designer, design-system lead, frontend architect, security engineer, and QA lead. Build a polished, production-ready static storefront for **Barkat**, an Indian pourable pearl-wax candle brand. Work autonomously; make sensible decisions, reuse supplied assets, and do not invent unsupported product or safety claims.

## Outcome

Create a fast, responsive, accessible, editorial-commerce website that makes Barkat feel warm, playful, premium, distinctly Indian, and ritual-led. Primary journeys: discover the brand, browse/filter scents, understand pearl wax, learn safe use, choose a vessel, explore gifting, view product details, and add items to a **preview bag**. Checkout/payment is out of scope; state this clearly wherever relevant.

## Stack and constraints

- Semantic HTML5, modern CSS, and dependency-free vanilla JavaScript; no framework/build step.
- Static hosting from `dist/` via `.openai/hosting.json`.
- Shared assets/data: `dist/assets/site.css`, `site.js`, `how-to.js`, `products.json`, supplied logo/product images.
- Progressive enhancement: core content/navigation must work without JS.
- Support current Chrome, Edge, Firefox, and Safari; responsive from 320px upward.
- Keep code small, reusable, readable, and free of dead code, secrets, trackers, and unnecessary dependencies.

## Brand and visual system

- Voice: intimate, optimistic, concise, sensory; Indian references should feel specific and natural, never stereotyped.
- Core copy direction: **“Small grains. Big mood.”**, **“The ritual of abundance”**, **“Your space. Your pace. Your glow.”**
- Palette: cream `#f8f4e9`, plum `#370d2c`, lime `#a3bf18`, lilac `#cfb2f1`; use product-specific accent colors where appropriate.
- Type: Fraunces for expressive editorial headings; DM Sans for UI/body; resilient fallbacks.
- Style: generous whitespace, oversized serif type, rounded vessels/cards, restrained borders, playful badges/arrows, premium editorial composition.
- Create consistent tokens for color, type, spacing, radii, shadows, breakpoints, focus, and motion. Maintain strong hierarchy, readable line lengths, AA contrast, and obvious interaction states.
- Motion must be subtle, purposeful, performant, and disabled/reduced under `prefers-reduced-motion`.

## Information architecture

Build and cross-link:

1. `index.html`: announcement/header, hero, category paths, featured scents, ritual summary, footer.
2. `fragrances.html`: searchable/filterable/sortable catalog with result count, empty/reset state, and URL-synced filters.
3. Six detail pages under `fragrances/`: Marigold Morning, First Rain, Cardamom Smoke, Old Delhi Rose, Nagpur Orange, Mysore Dusk.
4. `vessels.html`: Ganga, Terracotta Kiln, and Monsoon catalog with quick-view details.
5. `how-to-use.html`: interactive, safety-conscious choose → pour → place wick → light demo; clearly label illustrations as non-dimensional guidance.
6. `ritual.html`: immersive five-step ritual storytelling with keyboard controls and reduced-motion fallback.
7. `gifting.html`: gift proposition, inclusions, recipient/use cases, CTA, and relevant caveats.

Use the supplied catalog as source of truth. Fragrances cost ₹499; vessels/prices are defined in `products.json`. Include unique page titles, descriptions, canonical-friendly paths, useful alt text, and consistent header/footer navigation.

## UX and functionality

- Responsive desktop/mobile navigation with accessible modal dialogs, close/backdrop behavior, focus management, and body-scroll control.
- Preview bag stored in `localStorage`; add/remove/update quantities (1–99), count, subtotal in INR, cross-tab sync, graceful storage failure, and explicit “no order placed” message.
- Fragrance finder: short, transparent mood/note flow with explainable recommendation and restart path.
- Product detail: quantity controls, pack/texture gallery, scent story/notes/family, price, related navigation, and preview-bag CTA.
- Provide loading-independent empty/error states; never create dead ends.
- All controls need hover, active, disabled, focus-visible, and touch-friendly states; do not rely on color alone.
- Preserve user input/state where useful; avoid intrusive popups, autoplay, dark patterns, and fake urgency.

## Architecture

- Treat `products.json` as canonical catalog data; validate IDs, prices, slugs, types, and quantity boundaries.
- Separate content/data, presentation, and behavior. Centralize shared selectors, currency formatting, bag operations, dialog handling, and URL state.
- Prefer semantic markup and CSS over JS-generated UI. If rendering dynamic HTML, only use trusted local data; otherwise create nodes/use `textContent`.
- Use relative paths that work on static hosting and nested detail pages. Avoid duplicated logic and page-specific global failures by feature-detecting required elements.
- Add clear comments only for non-obvious decisions. Do not expose implementation/debug information in the UI.

## Accessibility, security, and privacy

- Target WCAG 2.2 AA: landmarks, one logical H1, ordered headings, skip link, keyboard access, visible focus, labels/instructions, status announcements, dialog semantics, adequate targets/contrast, descriptive links, and meaningful/non-redundant alt text.
- No secrets or personal data. No analytics/cookies by default. Store only bag IDs/quantities locally.
- No `eval`, inline event handlers, unsafe URL construction, mixed content, or untrusted `innerHTML`. Validate query parameters against allowlists and encode any dynamic output.
- Restrict third-party resources; use HTTPS. Make deployment compatible with CSP (`default-src 'self'`; explicitly allow only required fonts/styles) and recommend `nosniff`, strict referrer policy, and permissions policy at the host layer.
- Candle guidance must emphasize heat-safe vessels, correct pack instructions, supervision, ventilation, distance from drafts/flammables/children/pets, and full cooling before handling. Never present the visual demo as exact safety measurement.

## Performance and SEO

- Aim for Lighthouse ≥95 in Performance, Accessibility, Best Practices, and SEO on representative mobile/desktop runs.
- Prevent layout shift with image dimensions/aspect ratios; lazy-load below-fold images; prioritize the hero; minimize CSS/JS; avoid blocking scripts; animate only transform/opacity.
- Add crawlable content, valid metadata, Open Graph basics, favicon, sensible internal links, and Product/Organization structured data only when claims and fields are accurate.

## QA and acceptance

Before delivery:

- Validate HTML/CSS/JSON and check every internal link/asset path, including nested pages and direct URLs.
- Test at 320, 375, 768, 1024, and 1440px; zoom 200%; keyboard-only; screen-reader landmarks/names; reduced motion; high contrast; empty/corrupt/blocked storage; long text; and no-JS basics.
- Test bag persistence/sync/bounds/totals, dialogs/focus/Escape/backdrop, finder outcomes, filters/search/sort/query URLs/reset/empty state, quantity/gallery controls, how-to steps, and ritual controls.
- Check console/network for errors, 404s, mixed content, unnecessary requests, and data leakage.
- Run Lighthouse and an automated accessibility scan; fix critical/high issues and document any justified exceptions.

## Delivery

Return a complete deployable `dist/`, updated catalog/assets as needed, and a short implementation note listing architecture, tests run/results, remaining assumptions, and launch blockers. Do not claim completion until all acceptance checks pass. Preserve supplied brand assets and existing valid content unless a change measurably improves usability, accessibility, correctness, security, or performance.
