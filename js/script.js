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

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.classList.toggle("is-open");

        navLinks.classList.toggle("is-open", isOpen);

        navToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        navToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });
}

const backToTop = document.createElement("button");

backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.innerHTML = "↑";

document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        backToTop.classList.add("is-visible");
    } else {
        backToTop.classList.remove("is-visible");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});