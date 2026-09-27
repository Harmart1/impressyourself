# Production release notes — 2026-09-26

This release consolidates the final branding, responsive UX, SEO and GitHub Pages deployment work for impressyourself.

## Brand and visual system
- Refined butterfly/flow mark representing the two equal pillars: physical space and systems/process.
- Branded wordmark lockup with raspberry emphasis and a compact `spaces + systems` descriptor.
- Raspberry, cream, charcoal, sage and blush palette applied consistently.
- Primary and reverse SVG logo marks plus Apple touch and 192/512 app icons.
- New 1200 × 630 social/share image aligned with the production identity.
- Subtle butterfly, line and flow motifs used as supporting elements rather than decorative clutter.

## Positioning and conversion
- Equal prominence for physical-space organization and process/systems optimization.
- Booking is visible immediately and remains the primary conversion action.
- Copy focuses on functional outcomes: clearer spaces, easier retrieval, lower friction, repeatable routines and better workflows.
- Residential, workplace, administrative, digital and right-sizing services remain discoverable without diluting the two lead pillars.

## UX and accessibility
- Capability-aware responsive behavior for desktop, tablet and phone.
- Touch-sized controls, keyboard focus states, reduced-motion support and high-contrast accommodations.
- Mobile booking CTA and simplified navigation.
- Calendar privacy language and email fallback retained.

## Technical and SEO
- Root-deployable GitHub Pages structure for `Harmart1/impressyourself`.
- Canonical URLs, sitemap, robots, social metadata, web manifest and structured data.
- Dedicated service and guide pages with shared production styling.
- Homepage CSS/JS embedded to avoid the previous text-only Pages failure mode.
- All 11 public HTML pages validated for internal assets, duplicate IDs and JSON-LD syntax.
- Embedded JavaScript syntax checked with Node.

## Before launch
1. Upload this package's contents directly to the GitHub repository root.
2. Configure GitHub Pages to deploy from `main` → `/ (root)`.
3. Connect the Google Apps Script calendar endpoint if live booking is desired.
4. Confirm the preferred public mailing postal code before relying on the address for print/direct-mail use.
5. If a custom domain is added later, run `tools/set-site-url.py` and redeploy.
