# docs/public — Protected Brand Assets

> **READ BEFORE MODIFYING THIS DIRECTORY**
>
> This folder is the source for the GaaS public documentation site served at **https://gaas.to** via GitHub Pages. It is **not** a scratch directory — every file here is either a rendered doc page or a brand/layout asset that the pages depend on.

---

## Files You Must Not Delete, Rename, or Overwrite

| File | What it is |
|------|-----------|
| `CNAME` | GitHub Pages custom domain record — if deleted, gaas.to stops resolving |
| `index.html` | Docs homepage — contains all inline brand styles, nav, and hero layout |
| `favicon.png` | Browser tab icon |
| `logo.png` | GaaS wordmark / logo used in every page header |
| `gaas-certified-seal.png` | Certification badge used on landing and compliance pages |
| `gaas-certified-seal.webp` | WebP variant of the badge (better compression, same asset) |
| `constellation.js` | Animated background script — the animated star-field on the index page |

These are **not** auto-generated. They were designed and placed here deliberately. Losing any one of them makes the docs look unstyled, unbranded, or broken until manually restored (typically a 30-minute interruption).

---

## What "Updating the Docs" Means Here

When you add a new documentation page or update an existing one:

- **Do** create or edit `*.html` files for content.
- **Do not** touch the brand files listed above unless you are explicitly doing a brand refresh and you know what you are replacing them with.
- **Do not** run any script or glob delete that targets `*.png`, `*.webp`, `*.js`, or `CNAME` in this directory.
- **Do not** regenerate this folder from scratch (e.g., a static site generator output pass) without first confirming that all brand assets are preserved in the output.

---

## Why This File Exists

During routine private-repo work (doc updates, refactors, CI sweeps), AI assistants and automated scripts have occasionally swept up or garbage-collected brand assets alongside stale content. Because the public docs live in this same repo under `docs/public/`, those assets are always in scope for any broad file operation unless explicitly guarded.

This file is that guard.

---

## Restoring Assets (if something was accidentally removed)

1. `git log --diff-filter=D --summary -- docs/public/` — find the commit that deleted the file.
2. `git checkout <commit>^ -- docs/public/<filename>` — restore it from the commit just before the deletion.
3. Commit the restore with message `restore: recover <filename> in docs/public`.

If the deletion was pushed and GitHub Pages already re-deployed, the restore commit will re-trigger Pages within ~60 seconds.
