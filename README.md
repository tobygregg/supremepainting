# Supreme Painting & Decorating Ltd — website

Static one-page site. Plain HTML + compiled Tailwind CSS + a little vanilla JS. No framework, no build step needed to host it.

## Folder layout

```
index.html              ← all page content (sections are labelled with big comment banners)
assets/css/styles.css   ← compiled Tailwind (don't edit by hand — rebuild instead)
assets/js/main.js       ← menu, hero brush animation, van, gallery, lightbox, quote form
assets/fonts/           ← Chakra Petch + Instrument Sans (self-hosted, OFL licence)
images/                 ← logo cut-outs, van graphic, favicons, OG share image
images/gallery/         ← job photos (webp)
src/input.css           ← Tailwind source + custom animations
tailwind.config.js      ← brand colours + fonts
```

## Editing

- **Text** → edit `index.html`, save, done.
- **New Tailwind classes** → run `npm install` once, then `npm run build` (or `npm run watch` while editing). If a class you added doesn't show up, it's because CSS wasn't rebuilt.
- **Brand colours** → `tailwind.config.js` → rebuild.

### Adding a gallery photo
1. Export it as `.webp` (~1400px on the long side) into `images/gallery/`.
2. In `index.html` find the `OUR WORK` section and copy one `<li class="g-item">…</li>`.
3. Change the image `src`, `data-full`, `alt`, caption text and `data-cat` (`interior`, `exterior` or `spraying`).

## Before going live — checklist

- [ ] Replace `https://www.example.gg` with the real domain (canonical, `og:url`, `og:image`, JSON-LD in `<head>`).
- [ ] Paste Supreme's real Facebook page URL into the Facebook link in the `CONTACT` section (currently a Facebook search link).
- [ ] **Activate the form:** submit the quote form once on the live site. FormSubmit emails an activation link to supremedecorltd@gmail.com — click it once and every request after that lands in the inbox.
- [ ] Optional: after activation FormSubmit gives a random alias for the email. Swap it into the form `action` so the address isn't in the page source.
- [ ] Get the client to sign off the copy (process steps, "what you can expect" points) — nothing in there makes claims about insurance, years trading or numbers of jobs.

## Images

- Phone number was removed from the banner photo (`exterior-render-prep.webp`) and from the side of the van photo (`supreme-van.webp`), as requested. No phone number appears anywhere on the site — email + form only.
- `logo-full.png` / `.webp` are transparent cut-outs of the logo (decorative background lines removed) — handy for anything else Supreme needs.

## Hosting (Cloudflare Pages)

Push this folder to the GitHub repo → Cloudflare Pages → Connect to Git → framework preset **None**, build command **empty**, output directory **/**. (`node_modules/` is git-ignored and isn't needed to host.)
