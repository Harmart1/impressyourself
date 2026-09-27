# impressyourself — production website

Production-ready GitHub Pages build for `Harmart1/impressyourself`.

## Positioning
Two equal core pillars:
1. Physical-space organization — homes, offices, workspaces, storage, downsizing and right-sizing.
2. Process & systems optimization — workflows, SOPs, digital information, administration and repeatable routines.

## Branding
The site uses the refined butterfly/flow identity, raspberry + cream + sage palette, editorial serif/sans typography, branded browser icons and a production social-share image. See `project-docs/BRAND-GUIDE.md`.

## GitHub Pages deployment
Upload the contents of this package directly to the repository root and set:
- Branch: `main`
- Folder: `/ (root)`

Expected URL: `https://harmart1.github.io/impressyourself/`

## Calendar
The booking interface remains in preview mode until the endpoint from `google-calendar/Code.gs` is deployed and inserted in `index.html`. See `google-calendar/GOOGLE-CALENDAR-SETUP.md`.

## Production notes
- Main homepage CSS/JS is embedded for deployment reliability.
- Service and guide pages share `seo-pages.css`.
- No external font or framework dependency is required.
- `site.webmanifest`, favicons, social image, `robots.txt`, sitemap and 404 page are included.


## Adaptive device optimization
The production build automatically adapts to phone, tablet, and desktop layouts using viewport size plus input capabilities (touch/coarse pointer, mouse/trackpad, hover), orientation, VisualViewport changes, safe-area insets, reduced-motion and contrast preferences. It intentionally avoids brittle user-agent sniffing.
