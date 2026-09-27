# GitHub Pages deployment fix — Harmart1/impressyourself

## What was happening
GitHub's branch-based Pages deployment was successfully running, but it was processing this plain static site through Jekyll first. The site does not require Jekyll.

## Preferred production configuration
1. Upload this package to the root of the `main` branch.
2. In GitHub open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Commit/push to `main` if necessary.
5. Open **Actions** and confirm `Deploy impressyourself to GitHub Pages` completes successfully.
6. Visit: https://harmart1.github.io/impressyourself/
7. Diagnostic URL: https://harmart1.github.io/impressyourself/pages-healthcheck.txt

The included workflow publishes only the public website files. It does not publish `project-docs/`, `google-calendar/`, or `tools/`.

## If you insist on Deploy from a branch
Set **Source → Deploy from a branch**, **Branch → main**, **Folder → /(root)**. The included `.nojekyll` file tells Pages to treat the repository as static content. The GitHub Actions configuration above is still preferred because it removes Jekyll from the deployment path completely.

## Expected URL
https://harmart1.github.io/impressyourself/

There should be no `site/`, `docs/`, or `index.html` appended to the public URL.
