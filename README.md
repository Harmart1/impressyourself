# impressyourself

Production website for **impressyourself**, a professional organizing and process-design business in Sault Ste. Marie, Ontario.

Repository: `Harmart1/impressyourself`  
Production Pages URL: `https://harmart1.github.io/impressyourself/`

## What is included

- Booking-first responsive homepage
- Adaptive desktop / tablet / phone layouts
- Butterfly + raspberry visual identity
- Google Calendar-ready availability interface
- impressyourself Ease Index
- Sault Right-Size Roadmap
- Home, digital, life-admin, downsizing and process-design service pages
- Sault Ste. Marie downsizing resource guide
- Local/business structured data and SEO metadata
- `robots.txt` and XML sitemap
- GitHub Pages deployment workflow
- Pre-deployment validation

## Repository layout

```text
.github/
  workflows/pages.yml          GitHub Pages validation + deployment
  dependabot.yml               Keeps GitHub Actions dependencies current
docs/
  SEO-LAUNCH-CHECKLIST.md
google-calendar/
  Code.gs                      Google Apps Script backend; not deployed publicly
  GOOGLE-CALENDAR-SETUP.md
scripts/
  validate-site.py             CI validation used before deployment
site/                           Only this directory is published to Pages
  index.html
  404.html
  robots.txt
  sitemap.xml
  social-preview.png
  impressyourself-butterfly-logo.svg
  services/
  guides/
tools/
  set-site-url.py              Updates canonical/base URLs for a future custom domain
```

## Deploy

GitHub Pages should use **GitHub Actions** as its publishing source. The workflow in `.github/workflows/pages.yml`:

1. checks out `main`;
2. validates the public site;
3. configures Pages;
4. uploads only `site/`;
5. deploys it to GitHub Pages.

The current canonical/base URL is already set to:

`https://harmart1.github.io/impressyourself/`

See `GITHUB-PAGES-SETUP.md` for the exact first-deployment sequence.

## Google Calendar

The static website never needs Google account credentials. The optional booking backend runs separately as a Google Apps Script web app under the calendar owner's Google account.

Follow `google-calendar/GOOGLE-CALENDAR-SETUP.md`, then add the resulting `/exec` endpoint to `site/index.html`.

## Custom domain later

After configuring the custom domain in **Settings → Pages**, run:

```bash
python tools/set-site-url.py https://www.example.ca
python scripts/validate-site.py
```

Then commit the changed files.

## Local business details

Current site address:

**356 Queen Street East, Sault Ste. Marie, ON P6A 6K3**

Confirm the exact postal code before using the address for formal customer correspondence or Google Business Profile verification.
