# GitHub Pages setup — Harmart1/impressyourself

This package is tailored for the existing public repository:

`https://github.com/Harmart1/impressyourself`

Default branch: `main`

Expected GitHub Pages URL:

`https://harmart1.github.io/impressyourself/`

## First deployment

1. Extract this package.
2. Copy **all files and folders in the package root** into the root of `Harmart1/impressyourself`.
3. Commit and push them to `main`.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **GitHub Actions**.
6. Open the **Actions** tab and confirm `Validate and deploy impressyourself to GitHub Pages` succeeds.
7. Open `https://harmart1.github.io/impressyourself/` and test desktop, tablet and phone layouts.

The workflow validates the static site before it deploys. A validation failure prevents a broken build from being published.

## Live Google Calendar booking

The booking calendar remains in preview/demo mode until the Apps Script web-app endpoint is connected.

Follow:

`google-calendar/GOOGLE-CALENDAR-SETUP.md`

Then place the resulting `/exec` URL in the calendar endpoint meta tag inside `site/index.html`.

Never commit Google passwords, OAuth client secrets, API keys, private tokens or service-account keys to this repository.

## SEO after the first successful deployment

1. Confirm that `https://harmart1.github.io/impressyourself/robots.txt` loads.
2. Confirm that `https://harmart1.github.io/impressyourself/sitemap.xml` loads.
3. Add the GitHub Pages property to Google Search Console.
4. Submit `https://harmart1.github.io/impressyourself/sitemap.xml`.
5. If a custom domain is adopted later, configure it in **Settings → Pages** and then run:

```bash
python tools/set-site-url.py https://www.yourdomain.ca
```

Commit the generated URL changes before asking search engines to index the new domain.
