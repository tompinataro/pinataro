const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (header) {
  header.dataset.navOpen = "false";

  const syncHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
}

if (header && navToggle && siteNav) {
  const navLinks = siteNav.querySelectorAll("a");

  const setNavState = (isOpen) => {
    header.dataset.navOpen = String(isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  setNavState(false);

  navToggle.addEventListener("click", () => {
    setNavState(header.dataset.navOpen !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 760) {
        setNavState(false);
      }
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      setNavState(false);
    }
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    document.body.classList.add("has-animations");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}
