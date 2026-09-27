# GitHub Pages setup — Harmart1/impressyourself

This corrected package is designed for **branch-root deployment**. The website's `index.html` and all public assets are at the repository root.

## Correct GitHub Pages settings

1. Open https://github.com/Harmart1/impressyourself
2. Go to **Settings → Pages**.
3. Under **Build and deployment** choose **Deploy from a branch**.
4. Select branch **main**.
5. Select folder **/ (root)**.
6. Click **Save**.

Expected public URL:

`https://harmart1.github.io/impressyourself/`

## Important

Do not select `/docs`. Do not rely on `/site`; GitHub Pages branch deployment does not support `/site` as a publishing folder.

The corrected repository root contains:

- `index.html`
- `services/`
- `guides/`
- `seo-pages.css`
- `impressyourself-butterfly-logo.svg`
- `social-preview.png`
- `robots.txt`
- `sitemap.xml`
- `404.html`
- `.nojekyll`

If an old Pages configuration is still active, change it to `main` + `/ (root)` and save again.
