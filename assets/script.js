(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const fileName = window.location.pathname.split("/").pop() || "index.html";
  const pageMap = {
    "index.html": "home",
    "about.html": "about",
    "experience.html": "experience",
    "projects.html": "projects",
    "contact.html": "contact"
  };

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    if (link.dataset.page === pageMap[fileName]) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
