/* ========================================
   PROJECT FILTER
======================================== */

const projectCategory = document.getElementById("project-category");
const projectCards = document.querySelectorAll(".project-page-card");

if (projectCategory) {
  projectCategory.addEventListener("change", function () {
    const selectedCategory = this.value;

    projectCards.forEach(function (card) {
      const categories = card.dataset.category.split(" ");

      if (selectedCategory === "all" || categories.includes(selectedCategory)) {
        card.classList.remove("is-hidden");
      } else {
        card.classList.add("is-hidden");
      }
    });
  });
}

/* ========================================
   NAV TOGGLE (mobile hamburger menu)
======================================== */

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.classList.toggle("is-open");

    navLinks.classList.toggle("is-open", isOpen);

    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });
}

/* ========================================
   BACK TO TOP
   Shows once the visitor has scrolled past ~15% of the
   page's total scrollable height, instead of a fixed pixel
   value — a flat threshold (e.g. 500px) never triggers on
   shorter pages or taller mobile viewports, which is why the
   button could appear to "vanish" on some devices/pages.
======================================== */

const backToTop = document.createElement("button");

backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.innerHTML = "↑";

document.body.appendChild(backToTop);

const SCROLL_SHOW_RATIO = 0.15;

// Cache the page's scrollable height instead of reading window.innerHeight
// on every scroll event — on mobile, the address bar hiding/showing while
// you scroll changes innerHeight mid-scroll, which made the ratio flicker
// back and forth across the threshold and caused the button to blink.
let cachedScrollable = 0;
let lastWidth = window.innerWidth;

function measureScrollable() {
  cachedScrollable = document.documentElement.scrollHeight - window.innerHeight;
}

function updateBackToTopVisibility() {
  const scrolledRatio = cachedScrollable > 0 ? window.scrollY / cachedScrollable : 0;
  backToTop.classList.toggle("is-visible", scrolledRatio > SCROLL_SHOW_RATIO);
}

measureScrollable();
updateBackToTopVisibility();

// Re-measure once everything (images, fonts) has finished loading, since
// that can change the page's real height after the initial measurement.
window.addEventListener("load", () => {
  measureScrollable();
  updateBackToTopVisibility();
});

window.addEventListener("scroll", updateBackToTopVisibility);

// Only re-measure on an actual width change (real resize or device
// rotation) — not on height-only changes, which on mobile are almost
// always just the browser's address bar toggling, not a real resize.
window.addEventListener("resize", () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    measureScrollable();
    updateBackToTopVisibility();
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* ========================================
   THEME TOGGLE
   Works with the .theme-toggle button styles in style.css.
   Remembers the visitor's choice; falls back to their OS
   setting otherwise.
======================================== */

(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");

  if (stored) {
    root.setAttribute("data-theme", stored);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";

      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  });
})();