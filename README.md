# Portfolio

Portfolio site built with [Eleventy](https://www.11ty.dev/) and published to GitHub Pages at
https://onlychriz.github.io/Portfolio/.

Pages are plain HTML with a short front-matter block at the top. Eleventy adds the shared
`<head>`, header, menu and footer, and builds the project cards and the Projects menu from the
project pages' front matter. Pushing to `main` builds and deploys the site
(`.github/workflows/deploy.yml`).

```
index.html                      Home
about/                          About
projects/                       Project list + one folder per project
home/specialization/            Specialization article (+ doxygen/ wrapper page)
bardo/, specialization/, doxygen/   Redirects from old WordPress URLs
404.html                        Not-found page
<page>/media/                   Images and videos used by that page (e.g. projects/bardo/media/,
                                media/ for the home page)
_includes/base.html             Page skeleton: <head>, header, <main>, footer
_includes/header.html           Header + menu markup
_includes/project-card.html     One project card
_data/site.json                 Menu, footer links, site URL
eleventy.config.js              Build settings and the project collections
assets/css/style.css            All styles (colour tokens at the top)
assets/js/main.js               Mobile menu, gallery lightbox, on-screen video playback, back-to-top
assets/icons/                   Favicon and social icons
Docs/html/                      Generated Doxygen output (copied as-is, don't edit by hand)
```

## Working on it locally

Requires [Node.js](https://nodejs.org/) (the LTS version).

```sh
npm install     # once
npm start       # builds and serves at http://localhost:8080, reloads when you save
```

`npm run build` writes the finished site to `_site/` (not committed).

## Adding a page

Create `some-folder/index.html`:

```html
---
layout: base.html
title: "Page title"
description: "One sentence shown in search results."
---
    <h1>Hello</h1>
    <img src="media/picture.png" alt="Describe the image">
```

Everything below the `---` goes inside `<main>`. Put the page's images and videos in a `media/`
folder next to it and link them as `media/<file>`.

To link to another page or a shared file, either use a relative path (`../about/`) or start
from the site root (`/about/`, `/assets/...`). Root links get `/Portfolio` added automatically
when the site is built for github.io.

## Adding a project

Make a folder in `projects/` with an `index.html` like the existing ones. The `project:` block
in its front matter puts it in the Projects menu, on the project list and (with
`featured: true`) on the home page:

```yaml
project:
  number: 8                        # sort order (oldest first in the menu)
  name: "My Game"                  # card title and menu label
  menuLabel: "Shorter name"        # optional, menu label if different
  summary: "Genre in some engine"  # card text
  thumb: "media/thumbnail.png"     # card image, relative to the project folder
  featured: true                   # show on the home page
```

## Header, menu and footer

Edit `_data/site.json` for the menu and footer links, or `_includes/header.html` and
`_includes/footer.html` for the markup. The Projects dropdown fills itself from the project pages.

## Moving to christoffer-nilsson.com later

1. Point the domain's DNS at GitHub Pages (see GitHub's custom domain docs).
2. Settings → Pages → Custom domain: `christoffer-nilsson.com`, then enable "Enforce HTTPS"
   once the certificate is issued. No `CNAME` file is needed when deploying with Actions.
3. Re-run the "Deploy site" workflow (Actions tab → Run workflow) so links lose the
   `/Portfolio` prefix.

Don't set the custom domain before the DNS moves: GitHub would redirect the `github.io`
address to the domain, which still serves the old WordPress site.

## Content building blocks

- **Gallery card** – put images/videos in a `div.gallery`; the first four are previewed and
  clicking opens all of them in a lightbox.
  ```html
  <div class="gallery">
    <video src="media/clip.webm" data-autoplay muted loop playsinline preload="metadata"></video>
    <img src="media/shot.png" alt="Describe the image" loading="lazy">
  </div>
  ```
- **`data-autoplay`** on a `<video>` makes it a muted loop that only plays while on screen
  (skipped for visitors with reduced-motion or data-saver enabled).
- Layout helpers: `.panel`, `.columns`, `.media-text` (`--half` for 50/50), `.section-title`,
  `.notice`, `.button`, `.clip-grid`.
