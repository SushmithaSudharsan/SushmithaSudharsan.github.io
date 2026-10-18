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
/* ========================================
   EEG PULSE
   A slowly scrolling EEG-style trace under the hero.
   Synthetic signal (mixed rhythms plus occasional spikes),
   drawn as one SVG path. Stops when off screen and is
   drawn once, still, for visitors who prefer reduced motion.
======================================== */

(function () {
  const path = document.querySelector(".pulse-trace");
  if (!path) return;

  const WIDTH = 1200;
  const MID = 60;
  const STEP = 4;
  const POINTS = WIDTH / STEP;

  function signal(x) {
    let y =
      9 * Math.sin(x * 0.11) +
      6 * Math.sin(x * 0.27 + 1.3) +
      3.5 * Math.sin(x * 0.71 + 0.4) +
      2 * Math.sin(x * 1.9 + 2.1);

    // an occasional sharp spike, like an event in the recording
    const phase = x % 180;
    if (phase < 3) y -= 34 * Math.sin((phase / 3) * Math.PI);
    else if (phase < 6) y += 22 * Math.sin(((phase - 3) / 3) * Math.PI);

    return MID + y;
  }

  function draw(offset) {
    let d = "";
    for (let i = 0; i <= POINTS; i++) {
      d += (i ? "L" : "M") + i * STEP + " " + signal(i + offset).toFixed(1);
    }
    path.setAttribute("d", d);
  }

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) {
    draw(0);
    return;
  }

  let offset = 0;
  let running = true;
  let last = 0;

  function frame(time) {
    if (!running) return;
    if (time - last > 33) {
      offset += 0.6;
      draw(offset);
      last = time;
    }
    requestAnimationFrame(frame);
  }

  draw(0);
  requestAnimationFrame(frame);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      const visible = entries[0].isIntersecting;
      if (visible && !running) {
        running = true;
        requestAnimationFrame(frame);
      } else if (!visible) {
        running = false;
      }
    }).observe(path);
  }
})();

/* ========================================
   EMAIL
   The address is not written anywhere in the page source,
   so simple scraper bots can't harvest it. It's put
   together here for real visitors. Without JavaScript,
   email links fall back to the Contact page.
======================================== */

(function () {
  const email = ["sushmitha.sudharsan21", "gmail.com"].join("@");

  document.querySelectorAll("[data-email-link]").forEach(function (a) {
    a.setAttribute("href", "mailto:" + email);
  });
  document.querySelectorAll("[data-email-text]").forEach(function (el) {
    el.textContent = email;
  });

  document.querySelectorAll(".copy-email").forEach(function (button) {
    button.addEventListener("click", function () {
      const status = button.parentElement.querySelector(".copy-status");
      function done(message) { if (status) status.textContent = message; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { done("Copied"); },
          function () { done("Select the address to copy it"); }
        );
      } else {
        done("Select the address to copy it");
      }
    });
  });
})();

/* ========================================
   CASE STUDY "ON THIS PAGE" MENU
   Built from each page's own section labels, so every
   case study gets an accurate list. Only the sections a
   recruiter is most likely to jump to are listed.
======================================== */

(function () {
  if (!document.body.classList.contains("case-study")) return;
  const main = document.querySelector("main");
  if (!main) return;

  const WANTED = {
    "WHAT I BUILT": "What I built",
    "ARCHITECTURE": "Architecture",
    "ARCHITECTURE AND DEMO": "Architecture and demo",
    "DEMO": "Demo",
    "THE PROBLEM": "The problem",
    "THE APPROACH": "The approach",
    "HOW IT WORKS": "How it works",
    "MY ROLE": "My role",
    "CHALLENGES": "Challenges",
    "RESULTS": "Results",
    "WHAT I LEARNED": "What I learned",
    "TAKEAWAYS": "Takeaways",
    "TECHNOLOGY": "Technology"
  };

  const items = [];
  main.querySelectorAll("section").forEach(function (section) {
    const label = section.querySelector(":scope > .section-label, :scope > div > .section-label");
    if (!label) return;
    const key = label.textContent.replace(/\s+/g, " ").trim().toUpperCase();
    if (!WANTED[key]) return;
    if (!section.id) {
      section.id = key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    items.push({ id: section.id, text: WANTED[key], el: section });
  });
  if (items.length < 3) return;

  const nav = document.createElement("nav");
  nav.className = "toc";
  nav.setAttribute("aria-label", "On this page");
  nav.innerHTML =
    '<span class="toc-label">ON THIS PAGE</span><ol>' +
    items.map(function (i) { return '<li><a href="#' + i.id + '">' + i.text + "</a></li>"; }).join("") +
    '</ol><a class="toc-top" href="#top">Back to top</a>';

  const hero = main.querySelector(".project-detail-hero");
  if (hero) hero.after(nav); else main.prepend(nav);
  main.classList.add("has-toc");
  if (!document.getElementById("top")) document.body.id = "top";

  const links = nav.querySelectorAll("ol a");
  function setCurrent(id) {
    links.forEach(function (a) {
      const on = a.getAttribute("href") === "#" + id;
      if (on) {
        a.setAttribute("aria-current", "true");
        // keep the active chip visible in the phone row
        if (window.innerWidth < 1100) a.scrollIntoView({ block: "nearest", inline: "nearest" });
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  // the current section is the last one whose top has passed 30% of the screen
  let ticking = false;
  function update() {
    ticking = false;
    const line = window.innerHeight * 0.3;
    let current = items[0].id;
    items.forEach(function (i) {
      if (i.el.getBoundingClientRect().top <= line) current = i.id;
    });
    setCurrent(current);
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  update();
})();
