/* ---------- mobile nav toggle ---------- */
(function () {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---------- scroll-triggered reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}
initReveal();

/* ---------- card / featured tilt (pointer devices only) ---------- */
const canHoverTilt = !!(
  window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
);
function onTiltMove(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  const rx = (py - 0.5) * -7;
  const ry = (px - 0.5) * 7;
  el.style.transition = "transform .06s linear";
  el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.012)`;
}
function onTiltLeave(e) {
  const el = e.currentTarget;
  el.style.transition = "transform .5s cubic-bezier(.16,.8,.3,1)";
  el.style.transform = "";
}
if (canHoverTilt) {
  document.querySelectorAll(".card, .featured").forEach((el) => {
    el.addEventListener("pointermove", onTiltMove);
    el.addEventListener("pointerleave", onTiltLeave);
  });
}

/* ---------- scroll progress bar ---------- */
function updateScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  bar.style.width = pct + "%";
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

/* ---------- hero parallax texture ---------- */
function updateHeroParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;
  bg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
}
window.addEventListener("scroll", updateHeroParallax, { passive: true });
updateHeroParallax();

/* ---------- share button ---------- */
document.querySelectorAll("[data-share-title]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.getAttribute("data-share-title") || document.title;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, text: `${title} — The P List`, url }).catch(() => {});
      return;
    }
    const label = btn.querySelector("[data-share-label]");
    navigator.clipboard
      .writeText(url)
      .then(() => {
        if (label) {
          const original = label.textContent;
          label.textContent = "Link copied!";
          setTimeout(() => {
            label.textContent = original;
          }, 1800);
        }
      })
      .catch(() => {});
  });
});

/* ---------- video lightbox (mobile teaser tile) ---------- */
function openVideoLightbox(youtubeId, title) {
  const overlay = document.getElementById("videoLightbox");
  const win = document.getElementById("videoLightboxWindow");
  if (!overlay || !win) return;
  win.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeVideoLightbox() {
  const overlay = document.getElementById("videoLightbox");
  const win = document.getElementById("videoLightboxWindow");
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (win) win.innerHTML = "";
}
const videoLightboxClose = document.getElementById("videoLightboxClose");
const videoLightboxEl = document.getElementById("videoLightbox");
if (videoLightboxClose) videoLightboxClose.addEventListener("click", closeVideoLightbox);
if (videoLightboxEl) {
  videoLightboxEl.addEventListener("click", (e) => {
    if (e.target.id === "videoLightbox") closeVideoLightbox();
  });
}
document.querySelectorAll("[data-video-teaser]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openVideoLightbox(btn.getAttribute("data-youtube-id"), btn.getAttribute("data-video-title") || "");
  });
});

/* ---------- photo lightbox ---------- */
let lbPhotos = [];
let lbIndex = 0;

function renderLightbox() {
  const photo = lbPhotos[lbIndex];
  const img = document.getElementById("lbImg");
  const cap = document.getElementById("lbCaption");
  if (!img || !cap || !photo) return;
  img.classList.add("fading");
  cap.classList.add("fading");
  setTimeout(() => {
    img.src = photo.src;
    img.alt = photo.caption || "";
    cap.textContent = (photo.caption ? photo.caption + " — " : "") + (lbIndex + 1) + " / " + lbPhotos.length;
    requestAnimationFrame(() => {
      img.classList.remove("fading");
      cap.classList.remove("fading");
    });
  }, 160);
  const prevBtn = document.getElementById("lbPrev");
  const nextBtn = document.getElementById("lbNext");
  if (prevBtn) prevBtn.style.display = lbPhotos.length > 1 ? "flex" : "none";
  if (nextBtn) nextBtn.style.display = lbPhotos.length > 1 ? "flex" : "none";
}

function openLightbox(photos, index) {
  if (!photos || !photos.length) return;
  lbPhotos = photos;
  lbIndex = index;
  renderLightbox();
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function lightboxNext() {
  lbIndex = (lbIndex + 1) % lbPhotos.length;
  renderLightbox();
}
function lightboxPrev() {
  lbIndex = (lbIndex - 1 + lbPhotos.length) % lbPhotos.length;
  renderLightbox();
}

const lbClose = document.getElementById("lbClose");
const lbNext = document.getElementById("lbNext");
const lbPrev = document.getElementById("lbPrev");
const lightboxEl = document.getElementById("lightbox");
if (lbClose) lbClose.addEventListener("click", closeLightbox);
if (lbNext) lbNext.addEventListener("click", lightboxNext);
if (lbPrev) lbPrev.addEventListener("click", lightboxPrev);
if (lightboxEl) {
  lightboxEl.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (!lightboxEl || !lightboxEl.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") lightboxNext();
  if (e.key === "ArrowLeft") lightboxPrev();
});

let lbTouchStartX = 0;
if (lightboxEl) {
  lightboxEl.addEventListener(
    "touchstart",
    (e) => {
      lbTouchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  lightboxEl.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - lbTouchStartX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? lightboxNext() : lightboxPrev();
      }
    },
    { passive: true }
  );
}

document.querySelectorAll(".photo-strip").forEach((strip) => {
  const tiles = Array.from(strip.querySelectorAll(".ph-tile[data-photo-src]"));
  const photos = tiles.map((t) => ({
    src: t.getAttribute("data-photo-src"),
    caption: t.getAttribute("data-photo-caption") || "",
  }));
  tiles.forEach((tile, i) => {
    tile.addEventListener("click", () => openLightbox(photos, i));
  });
});

/* ---------- homepage filter / state / sort (progressive enhancement over
   the server-rendered grid — all posts are always in the markup so search
   engines see everything regardless of client-side filter state) ---------- */
(function () {
  const filterBar = document.querySelector(".filter-bar");
  if (!filterBar) return;

  const grid = document.getElementById("postGrid");
  const cards = grid ? Array.from(grid.querySelectorAll(".card[data-order]")) : [];
  const countLabel = document.getElementById("listingsCount");
  const noMatch = document.getElementById("noMatch");
  const chunkHeaders = grid ? Array.from(grid.querySelectorAll(".grid-chunk-header")) : [];
  const sortSelect = document.getElementById("sortSelect");

  let filter = "all";
  let state = "all";
  let sort = "newest";
  let headersRemoved = false;

  function matches(card) {
    const tags = (card.getAttribute("data-tags") || "").split("|").filter(Boolean);
    const status = (card.getAttribute("data-status") || "").toLowerCase();
    const cState = card.getAttribute("data-state") || "";
    const country = card.getAttribute("data-country") || "";

    let ok = true;
    if (filter === "for-sale") ok = !status;
    else if (filter === "sold") ok = status === "sold";
    else if (filter === "not-for-sale") ok = status.includes("not") || status.includes("contract");
    else if (filter === "international") ok = !!country;
    else if (filter !== "all") ok = tags.some((t) => t.toLowerCase() === filter.toLowerCase());

    if (ok && state !== "all") {
      if (state === "international") ok = !!country;
      else ok = cState === state && !country;
    }
    return ok;
  }

  function apply() {
    // Chunk headers ("Keep Scrolling, We Dare You" etc.) only make sense
    // interleaved through the untouched, full-order grid. Once the visitor
    // touches any filter/sort control we drop them for good rather than
    // trying to keep them correctly positioned through repeated reordering.
    if (!headersRemoved) {
      chunkHeaders.forEach((h) => h.remove());
      headersRemoved = true;
    }

    let visibleCount = 0;
    cards.forEach((card) => {
      const show = matches(card);
      card.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    let sorted;
    if (sort === "quirk" || sort === "beds-desc") {
      const key = sort === "quirk" ? "data-quirk" : "data-beds";
      sorted = cards.slice().sort((a, b) => (parseFloat(b.getAttribute(key)) || 0) - (parseFloat(a.getAttribute(key)) || 0));
    } else {
      sorted = cards.slice().sort((a, b) => (+a.getAttribute("data-order")) - (+b.getAttribute("data-order")));
    }
    sorted.forEach((c) => grid.appendChild(c));

    if (countLabel) {
      const plural = visibleCount === 1 ? "property" : "properties";
      countLabel.textContent =
        visibleCount === 0 ? "No properties match this filter" : `Showing ${visibleCount} ${plural}`;
    }
    if (noMatch) noMatch.style.display = visibleCount === 0 ? "" : "none";
  }

  document.querySelectorAll(".filter-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filter = btn.dataset.filter;
      apply();
    });
  });
  document.querySelectorAll(".state-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".state-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state = btn.dataset.state;
      apply();
    });
  });
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sort = e.target.value;
      apply();
    });
  }
})();
