/* Christoffer Nilsson – portfolio
   Small progressive enhancements; every page works without this file. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var conn = navigator.connection || {};
  var saveData = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
  var canAutoplay = !reduceMotion && !saveData;

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
  }

  /* ---------- Autoplay videos only while they are on screen ----------
     Videos marked [data-autoplay] are muted loops. They start when visible
     and pause when scrolled away, so a page full of clips stays light. */
  var autoVideos = document.querySelectorAll("video[data-autoplay]");

  function prepare(video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
  }

  if (!canAutoplay || !("IntersectionObserver" in window)) {
    // Let the visitor start them manually instead.
    autoVideos.forEach(function (v) {
      if (!v.closest(".gallery") && !v.classList.contains("hero__video")) v.controls = true;
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    autoVideos.forEach(function (v) {
      prepare(v);
      observer.observe(v);
    });
  }

  /* ---------- Galleries ---------- */
  var galleries = document.querySelectorAll(".gallery");
  var lightbox, lightboxItems, lastFocus;

  function buildLightbox() {
    lightbox = document.createElement("dialog");
    lightbox.className = "lightbox";
    lightbox.setAttribute("aria-label", "Gallery");

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox__close";
    close.textContent = "✕ Close gallery";
    close.addEventListener("click", closeLightbox);

    lightboxItems = document.createElement("div");
    lightboxItems.className = "lightbox__items";

    lightbox.append(close, lightboxItems);

    // Click on the backdrop closes the dialog.
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("close", function () {
      lightboxItems.replaceChildren(); // stops the cloned videos
      document.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    });

    document.body.appendChild(lightbox);
  }

  function openLightbox(gallery, opener) {
    if (!lightbox) buildLightbox();
    lastFocus = opener;

    gallery.querySelectorAll(":scope > img, :scope > video").forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.removeAttribute("data-autoplay");
      if (clone.tagName === "VIDEO") {
        prepare(clone);
        clone.controls = true;
        clone.preload = "auto";
        if (canAutoplay) clone.autoplay = true;
      } else {
        clone.loading = "lazy";
      }
      lightboxItems.appendChild(clone);
    });

    document.body.classList.add("is-locked");
    lightbox.showModal();
    lightbox.scrollTop = 0;
  }

  function closeLightbox() {
    if (lightbox && lightbox.open) lightbox.close();
  }

  if (typeof HTMLDialogElement === "function") {
    galleries.forEach(function (gallery) {
      var count = gallery.querySelectorAll(":scope > img, :scope > video").length;
      gallery.dataset.count = String(Math.min(count, 4));

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery__open";
      btn.textContent = "Click to view full gallery";
      btn.setAttribute(
        "aria-label",
        "View full gallery (" + count + (count === 1 ? " item)" : " items)")
      );
      btn.addEventListener("click", function () {
        openLightbox(gallery, btn);
      });
      gallery.appendChild(btn);
    });
  }

  /* ---------- Scroll to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
