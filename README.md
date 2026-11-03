# christoffer-nilsson.com

Portfolio site, served by GitHub Pages from the repository root (custom domain in `CNAME`).
Plain static HTML, no build step.

```
index.html                      Home
about/                          About
projects/                       Project list + one folder per project
home/specialization/            Specialization article (+ doxygen/ wrapper page)
bardo/, specialization/, doxygen/   Redirects from old WordPress URLs
404.html                        Not-found page (used automatically by GitHub Pages)
assets/css/style.css            All styles (colour tokens at the top)
assets/js/main.js               Mobile menu, gallery lightbox, on-screen video playback, back-to-top
assets/media/                   Images and videos
assets/icons/                   Favicon and social icons
Docs/html/                      Generated Doxygen output (don't edit by hand)
```

## Preview locally

Links are root-relative (`/assets/...`), so open the site through a local server rather than as a file:

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

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
