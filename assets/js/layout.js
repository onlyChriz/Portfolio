/* Shared site header and footer.
   ------------------------------------------------------------------
   Edit the menu here and every page updates.

   Each page includes this file with a normal (not deferred) script tag at
   the top of <body>:

     <script src="../../assets/js/layout.js"></script>

   The header is written in place of that tag, so it appears without a
   flash; the footer and back-to-top button are added at the end of the page.
   Paths are relative to the site root; they work on github.io, a custom
   domain, Rider's preview and when a file is opened from disk. */
(function () {
  "use strict";

  /* ---------- Menu ----------
     href: path from the site root.  children: dropdown items.          */
  var MENU = [
    { label: "Home", href: "index.html" },
    { label: "Specialization", href: "home/specialization/index.html" },
    {
      label: "Projects",
      href: "projects/index.html",
      children: [
        { label: "Duck Duck Die", href: "projects/duckduckdie/index.html" },
        { label: "Call Of The Deep", href: "projects/call-of-the-deep/index.html" },
        { label: "Bardo", href: "projects/bardo/index.html" },
        { label: "Slashimi", href: "projects/slashimi/index.html" },
        { label: "Spite: Blood and Gold", href: "projects/spite-blod-and-gold/index.html" },
        { label: "Aliens Stole My Shit", href: "projects/aliens-stole-my-shit/index.html" },
        { label: "Tilberinn", href: "projects/tilberinn/index.html" },
        { label: "Internship", href: "projects/internship/index.html" }
      ]
    },
    { label: "About", href: "about/index.html" }
  ];

  /* ---------- Footer links ---------- */
  var FOOTER_LINKS = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/christoffer-nilsson-0539591b9/" },
    { label: "itch.io", href: "https://christga.itch.io/" },
    { label: "Email", href: "mailto:ChrisENilsson@outlook.com" }
  ];

  /* ------------------------------------------------------------------ */

  var script = document.currentScript;
  // This file lives in assets/js/, so the site root is two folders up.
  var root = new URL("../../", script.src);

  function url(href) {
    return new URL(href, root).href;
  }

  // Treat ".../folder/" and ".../folder/index.html" as the same page.
  function normalise(u) {
    return u.split("#")[0].split("?")[0].replace(/index\.html$/, "");
  }

  var here = normalise(location.href);
  var isHome = here === normalise(url("index.html"));

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function link(item) {
    var target = url(item.href);
    var current = normalise(target) === here ? ' aria-current="page"' : "";
    return '<a href="' + esc(target) + '"' + current + ">" + esc(item.label) + "</a>";
  }

  function menuItems(items) {
    return items
      .map(function (item) {
        if (!item.children) return "<li>" + link(item) + "</li>";
        return (
          '<li class="has-submenu">' + link(item) +
          '<ul class="submenu">' + menuItems(item.children) + "</ul></li>"
        );
      })
      .join("");
  }

  // The home page shows the large logo instead of the name in the header.
  var brand = isHome
    ? "<span></span>"
    : '<a class="brand" href="' + esc(url("index.html")) + '"><span class="brand__initial">C</span>hristoffer ' +
      '<span class="brand__initial">N</span>ilsson</a>';

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="site-header"><div class="site-header__inner">' +
    brand +
    '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
    '<span class="visually-hidden">Menu</span>' +
    '<svg class="icon-open" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"/></svg>' +
    '<svg class="icon-close" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z"/></svg>' +
    "</button>" +
    '<nav id="site-nav" class="site-nav" aria-label="Primary"><ul>' + menuItems(MENU) + "</ul></nav>" +
    "</div></header>";

  script.insertAdjacentHTML("beforebegin", header);

  document.addEventListener("DOMContentLoaded", function () {
    var footer =
      '<footer class="site-footer"><div class="site-footer__inner">' +
      "<p>© Christoffer Nilsson</p><ul>" +
      FOOTER_LINKS.map(function (l) {
        return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + "</a></li>";
      }).join("") +
      "</ul></div></footer>" +
      '<a class="to-top" href="#main" aria-label="Back to top">↑</a>';
    document.body.insertAdjacentHTML("beforeend", footer);
  });
})();
