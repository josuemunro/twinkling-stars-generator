# CLAUDE.md

Guidance for working in this repo. Keep it current when architecture or workflow changes.

## What this is

A single-file, zero-dependency **twinkling star-field background generator**. The whole app — UI, generator, and renderer — lives in `index.html` (inline CSS + vanilla JS, no framework, no build tooling). There is no package.json and no test suite; it's intentionally a static page.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire app: control panel, live preview, generator, and HTML export. |
| `scripts/version.js` | Build-time script that stamps the commit SHA into the version badge. Runs on Netlify; never throws. |
| `netlify.toml` | Static-site config. `command = "node scripts/version.js"`, `publish = "."`. |
| `README.md` | Public-facing project docs + live demo link. |

## Run / preview locally

No build. Open `index.html` directly, or serve the folder:

```bash
npx http-server -p 5577 -c-1 .
```

A `.claude/launch.json` defines a "stars" preview server on port 5577 (gitignored).

## Architecture & invariants

The code is split into a **CORE** section (pure, deterministic functions) and an **APP** section (DOM wiring). When editing, preserve these invariants:

1. **Determinism.** All randomness flows from `mulberry32(seed)`. The same seed + settings must always produce the identical field. Do not introduce `Math.random()` / `Date.now()` into generation.
2. **Preview === export.** The export feature serializes the CORE functions verbatim via `Function.prototype.toString()` (see the `core` array in `buildExport`). Therefore:
   - Any function used by the exported snippet **must** be listed in that `core` array, and
   - CORE functions must be **self-contained** — no closures over app-scope variables, no DOM access. Keep them pure.
   - If you add a CORE function used by export, add it to the `core` array too, or the export will throw `ReferenceError` at runtime.
3. **Placement model.** Stars are placed by rejection sampling over a value-noise fBm density field (`lsFbm`). Clumping = sharpening that field; "galactic band" = compressing one axis of the noise in a rotated frame.
4. **Animation cost.** Only `opacity` and `transform` are animated (compositor-friendly). Glow is a **static** `box-shadow`. Don't animate `box-shadow`/layout properties.
5. **Parallax.** Stars are bucketed into `LAYERS` (3) depth layers; each `.ls-layer` has a `data-speed` and is translated on scroll. Bigger/brighter stars bias toward nearer (faster) layers. `.ls-sky` is `position: sticky` so the field stays pinned while scrolling a field taller than one viewport. Field/viewport sizes are driven by the `--ls-field` / `--ls-vp` CSS vars (pixels in preview, `vh` in export).
6. **Density is per-screen.** `count` is multiplied by `heightVH` in `lsGenerateStars`, so raising field height keeps the on-screen density constant.

## Versioning

- The human version lives in `index.html`: `window.__APP_VERSION__ = "x.y.z"`. **Bump it for meaningful changes.**
- `window.__BUILD_REF__ = "dev"` is a placeholder. On Netlify, `scripts/version.js` replaces it with the short `COMMIT_REF` (commit SHA), so the bottom-right badge reads e.g. `v1.1.0 · a1b2c3d` and changes every deploy. Locally it shows `v1.1.0 · dev`.
- The version badge is app-only — it is **not** included in exported snippets.

## Deploy workflow

- Hosted on **Netlify** (team: Webdune), continuous deploy from the `main` branch of `josuemunro/twinkling-stars-generator`.
- **Every push to `main` auto-deploys.** The build runs `scripts/version.js` then publishes the repo root.
- Live: https://charming-griffin-f8a026.netlify.app/

## Conventions

- Keep it dependency-free and single-file. Resist adding a bundler/framework.
- CORE function names are prefixed `ls` (so they're unambiguous when serialized into an export).
- Test visual changes in the browser preview; there are no automated tests.
