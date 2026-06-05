# ✨ Twinkling Stars Generator

A zero-dependency, single-file generator for **realistic twinkling star-field backgrounds**. Tune the look in a live editor, then export a self-contained HTML snippet you can drop into any site.

🔗 **Live demo:** **https://charming-griffin-f8a026.netlify.app/**

[![Netlify Status](https://api.netlify.com/api/v1/badges/ccb57319-8234-415b-9d23-591dde91295d/deploy-status)](https://app.netlify.com/projects/charming-griffin-f8a026/deploys) ![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen) ![Vanilla JS](https://img.shields.io/badge/built%20with-vanilla%20JS-yellow)

## What it does

Stars are rendered as DOM elements (`<div>`s with `border-radius:50%` + a static `box-shadow` glow) and animated purely with CSS. The placement is what makes it look real:

- **Density field (value-noise fBm)** decides _where stars want to clump_.
- **Rejection sampling** over that field scatters discrete stars — dense in clumps, sparse in the voids — instead of an even grid.
- **Per-star random hashes** drive size, luminance, colour-temperature tint, and twinkle phase/speed, so every star shimmers out of sync.
- **3 depth layers** with scroll-parallax: bigger/brighter stars sit "nearer" and drift faster for a sense of depth.

Everything is **deterministic from a seed** — the same seed + settings always reproduces the exact field, which is why the live preview and the exported snippet are pixel-identical.

## Controls

| Group | Options |
|-------|---------|
| **Star Field** | count, clumping, clump size, noise detail, galactic band + angle |
| **Star Look** | colour, tint variation, colour variation, luminance, min/max size, glow |
| **Twinkle** | speed, amount, twinkling fraction |
| **Scroll & Parallax** | field height (in screens), parallax depth |
| **Background** | top/bottom colour, vertical gradient |

Plus: **Randomise design**, **Copy settings** (JSON), and **Export HTML** (downloads a standalone snippet + copies it to clipboard).

## Usage

It's a static site — just open `index.html`, or serve the folder:

```bash
npx http-server -p 5577 -c-1 .
# then open http://localhost:5577
```

### Embedding the exported background

Hit **Export HTML** in the app. You get a self-contained file containing a `.ls-starfield` hero section (N viewports tall, with sticky scroll-parallax). Drop the `<style>` + `<div class="ls-starfield">` + `<script>` into your page. To use it as a full-page fixed background instead, set `.ls-starfield { position:fixed; inset:0; height:100vh; z-index:-1 }`. The export respects `prefers-reduced-motion`.

## How the noise works (the short version)

A single low-frequency **fBm value-noise** map is the shared "density field." Each candidate star is proposed at a random point and kept with a probability driven by that field — so clumps emerge naturally. Per-star attributes come from independent seeded draws, not the shared map. This layered approach (one map for placement + per-star randomness for everything else) is what separates a believable sky from a uniform sprinkle.

## Credits / inspiration

- [Overdraw.xyz — Using cellular noise to generate procedural stars](https://www.overdraw.xyz/blog/2018/7/17/using-cellular-noise-to-generate-procedural-stars)
- [CSS-Tricks — twinkling star animation](https://css-tricks.com/forums/topic/twinkling-star-animation/)
- David Hoskins' hash functions (the lineage behind the integer-hash noise)

## License

[MIT](./LICENSE) © Josue Munro / WebDune
