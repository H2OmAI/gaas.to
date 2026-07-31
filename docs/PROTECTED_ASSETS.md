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
| `gaas-certified-seal.png` | Certification badge (Tier 3 trust program mark) |
| `gaas-certified-seal.webp` | WebP variant of the badge (better compression, same asset) |
| `gaas-shield.png` | Shield brand mark — **currently contains the old circular seal artwork**, see the note below |
| `constellation.js` | Animated background script — the animated star-field on the index page |
| `footer.css` | The single shared footer stylesheet, linked by every page |
| `shared.css` | Header chrome for `search.html` |
| `ASSET_CHECKSUMS.txt` | Integrity manifest for every binary in this directory |

These are **not** auto-generated. They were designed and placed here deliberately. Losing any one of them makes the docs look unstyled, unbranded, or broken until manually restored (typically a 30-minute interruption).

---

## Overwriting Is More Dangerous Than Deleting

A **deleted** asset produces a visibly broken page within minutes. An asset whose **bytes** were
replaced with different artwork renders fine and can persist for months.

That is not hypothetical. `gaas-shield.png` carried the wrong artwork for roughly 4.5 months:
commit `1073c9b` added the angular shield and pointed the footers at it, then `a64c175`
("fix(docs): correct footer seal") replaced the same filename's bytes with the old circular
"GaaS CERTIFIED" seal — `1 file changed, 0 insertions(+), 0 deletions(-)`,
`Bin 492473 -> 824894 bytes`. Zero HTML changed, so review, grep, and text-based CI all missed
it. See CLAUDE.md gotcha #43.

Any commit that changes a binary in this directory must:

1. State in the commit body what the **old** and **new** artwork are.
2. Regenerate the manifest in the **same** commit:
   `python scripts/verify-public-docs.py --update-assets`
3. Be reviewed by **rendering both versions**, never by reading the filename.

`scripts/verify-public-docs.py` (CI at `ci.yml:76`, pre-commit at `.pre-commit-config.yaml:35`)
fails on any unrecorded byte change.

To find a *replacement* rather than a deletion — note `--diff-filter=D` cannot see one:

```bash
git log --follow -p --stat -- docs/public/<file>   # look for "Bin <old> -> <new> bytes"
```

---

## Retained but Unreferenced — Do Not Garbage-Collect

As of the footer unification, three brand marks have **no reference from any file in
`docs/public/`**:

- `gaas-shield.png` (it was the footer seal; the footer no longer carries a mark)
- `gaas-certified-seal.png`
- `gaas-certified-seal.webp`

They are retained deliberately. **"Unused" here does not mean "safe to delete."**

Note that `gaas-certified-seal.png` is still live in the dashboard app from a **separate copy**
at `apps/dashboard/public/` (`LoginPage.tsx:143`, `SignupPage.tsx:69,190`,
`InvitePage.tsx:77,109,133`, `MfaVerifyPage.tsx:44`, `VerifyPage.tsx:43`). Deleting the
`docs/public/` copy would not break the dashboard — which makes it *more* likely someone
concludes it is dead. It is not.

---

## What "Updating the Docs" Means Here

When you add a new documentation page or update an existing one:

- **Do** create or edit `*.html` files for content.
- **Do** give any new page the canonical footer verbatim and a `footer.css` link after its
  inline `</style>` block. Never inline footer CSS, never add a footer variant — four divergent
  footers is how this directory ended up needing a cleanup sweep.
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
