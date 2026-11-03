# Portfolio

Portfolio site, served by GitHub Pages from the repository root at
https://onlychriz.github.io/Portfolio/. Plain static HTML, no build step.

All links are relative, so the site works on `github.io`, on a custom domain, and when a
file is opened directly from disk.

```
index.html                      Home
about/                          About
projects/                       Project list + one folder per project
home/specialization/            Specialization article (+ doxygen/ wrapper page)
bardo/, specialization/, doxygen/   Redirects from old WordPress URLs
404.html                        Not-found page (uses <base href="/Portfolio/">, see below)
assets/css/style.css            All styles (colour tokens at the top)
assets/js/main.js               Mobile menu, gallery lightbox, on-screen video playback, back-to-top
assets/media/                   Images and videos
assets/icons/                   Favicon and social icons
Docs/html/                      Generated Doxygen output (don't edit by hand)
```

## Preview locally

Open `index.html` directly, or run a local server (needed for the Doxygen iframe in some browsers):

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

Links are relative to each page, so a page two folders deep links to `../../assets/...`.

## Moving to christoffer-nilsson.com later

1. Add a `CNAME` file at the root containing `christoffer-nilsson.com`.
2. In `404.html`, change `<base href="/Portfolio/">` to `<base href="/">`.
3. Settings → Pages → Custom domain: `christoffer-nilsson.com`.
4. Point the domain's DNS at GitHub Pages (see GitHub's custom domain docs), then enable
   "Enforce HTTPS" once the certificate is issued.

Don't add `CNAME` before the DNS moves: GitHub would redirect the `github.io` address to the
domain, which still serves the old WordPress site.

## Content building blocks

- **Gallery card** – put images/videos in a `div.gallery`; the first four are previewed and
  clicking opens all of them in a lightbox.
  ```html
  <div class="gallery">
    <video src="/assets/media/clip.webm" data-autoplay muted loop playsinline preload="metadata"></video>
    <img src="/assets/media/shot.png" alt="Describe the image" loading="lazy">
  </div>
  ```
- **`data-autoplay`** on a `<video>` makes it a muted loop that only plays while on screen
  (skipped for visitors with reduced-motion or data-saver enabled).
- Layout helpers: `.panel`, `.columns`, `.media-text` (`--half` for 50/50), `.section-title`,
  `.notice`, `.button`, `.clip-grid`.
